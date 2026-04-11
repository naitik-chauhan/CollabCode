# CollabCode - Real-Time Collaborative Code Editor

A real-time, bi-directional collaborative code editor built with the MERN stack (Node.js, Express, React) and WebSockets. CollabCode enables developers to write, edit, and share code in the exact same room instantly without screen sharing delays, resembling a pair-programming environment.

## Features
- **Real-Time Code Sync**: Utilizing `Socket.io` for millisecond-latency code propagation.
- **Multi-room Architecture**: Generate a unique Room ID or join an existing one to keep work isolated.
- **Live Active Users**: See who is currently connected in your room.
- **Integrated Chat**: Talk with your peers directly within the coding environment.
- **Premium UI/UX**: Dark-mode glassmorphism aesthetic built with pure modern CSS.
- **VS Code Engine**: Under the hood, it uses Microsoft's Monaco Editor for an authentic coding experience.

## Tech Stack
- **Frontend**: React.js (Vite), Monaco Editor (`@monaco-editor/react`), Lucide React (Icons), React Hot Toast
- **Backend**: Node.js, Express.js
- **Communication**: Socket.io (WebSockets)

---

## How to Run Locally

You will need to open **two separate terminal windows** to run the Backend and the Frontend concurrently.

### 1. Starting the Backend
Open your terminal and run the following commands:
```bash
cd backend
npm install
node server.js
```
*The backend server will start running on port 5000.*

### 2. Starting the Frontend
Open a new, second terminal and run the following commands:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will start on your local Vite port (usually `http://localhost:5173`).*

---

## Testing it out
1. Open `http://localhost:5173` in your browser.
2. Enter a username and click **create a new room**.
3. Once inside, copy the Room ID.
4. **Open a new tab** or window, go to the website again, paste the Room ID, enter a different username, and hit Join.
5. You can now test live coding and chatting side-by-side!

## License
MIT License
