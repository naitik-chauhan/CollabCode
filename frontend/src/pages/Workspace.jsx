import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import Client from '../components/Client';
import CodeEditor from '../components/CodeEditor';
import ChatBox from '../components/ChatBox';
import { initSocket } from '../socket';
import { CopyIcon, LogOutIcon, Code2 } from 'lucide-react';

const Workspace = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const codeRef = useRef('');

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            // Join Room
            socketRef.current.emit('join_room', {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on('joined', ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                
                // Sync the current code to the newly joined user
                if (username !== location.state?.username && codeRef.current) {
                    socketRef.current.emit('sync_code', {
                        code: codeRef.current,
                        socketId,
                    });
                }
            });

            // Listening for disconnected event
            socketRef.current.on('disconnected', ({ socketId, username }) => {
                toast(`${username} left the room.`, { icon: '👋' });
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            });
        };

        if (location.state?.username) {
            init();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off('joined');
                socketRef.current.off('disconnected');
            }
        };
    }, []);

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy Room ID');
            console.error(err);
        }
    };

    const leaveRoom = () => {
        reactNavigator('/');
    };

    return (
        <div className="workspaceWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="asideLogo">
                        <Code2 size={28} color="#4da6ff" />
                        <h1>CollabCode</h1>
                    </div>
                    <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#ccc' }}>Connected Users</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                    
                    <ChatBox 
                        socketRef={socketRef} 
                        roomId={roomId} 
                        username={location.state?.username} 
                    />
                </div>
                
                <div className="leaveBtnWrap">
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        <CopyIcon size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Copy Room ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        <LogOutIcon size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Leave Room
                    </button>
                </div>
            </div>
            
            <div className="editorWrap">
                <CodeEditor 
                    socketRef={socketRef} 
                    roomId={roomId} 
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }} 
                />
            </div>
        </div>
    );
};

export default Workspace;
