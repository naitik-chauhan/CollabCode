const Client = ({ username }) => {
    // Generate initials based on username
    const initials = username
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="client">
            <div className="avatar">{initials}</div>
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
