import { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';

const ChatBox = ({ socketRef, roomId, username }) => {
    const [messages, setMessages] = null || useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('receive_message', (data) => {
                setMessages((prev) => [...prev, data]);
            });
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.off('receive_message');
            }
        };
    }, [socketRef.current]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (messageInput.trim() === '') return;

        const data = {
            roomId,
            username,
            message: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        socketRef.current.emit('send_message', data);
        setMessages((prev) => [...prev, data]);
        setMessageInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="chatPanel">
            <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#ccc', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Room Chat</h4>
            <div className="chatMessages">
                {messages.map((msg, idx) => (
                    <div key={idx} className="message" style={{ background: msg.username === username ? 'rgba(77, 166, 255, 0.15)' : 'var(--bg-panel)' }}>
                        <div className="sender">{msg.username}</div>
                        <div className="content">{msg.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatInputWrap">
                <input
                    type="text"
                    className="chatInput"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="chatSendBtn" onClick={sendMessage}>
                    <SendIcon size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
