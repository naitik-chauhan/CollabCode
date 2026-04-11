import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Generated a new Room ID');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room ID & Username are required');
            return;
        }
        // Redirect to workspace
        navigate(`/workspace/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homeWrapper">
            <div className="formWrapper">
                <div className="logo">
                    <Code2 size={40} color="#4da6ff" />
                    <h1>CollabCode</h1>
                </div>
                <h4 style={{ marginBottom: '20px', color: '#ccc' }}>Paste Invitation Room ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite, create a &nbsp;
                        <button onClick={createNewRoom} className="createNewBtn">
                            new room
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
