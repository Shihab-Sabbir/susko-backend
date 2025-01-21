# Multiplayer Realtime Quiz Documentation

## Overview
The **Multiplayer Realtime Quiz** application consists of a frontend built with **Next.js** and **Tailwind CSS**, and a backend developed using **Express.js** with **Socket.IO** for real-time communication. The platform supports creating and joining quiz rooms, real-time gameplay, and seamless interactions. The live deployment details are as follows:

- **Frontend**: [Susko Quiz Frontend](https://susko-quiz.vercel.app/)
- **Backend**: [Susko Quiz Backend](https://susko-backend.onrender.com)

---

## Frontend

### Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (React-based framework for server-side rendering and static site generation)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework for styling)
- **Real-Time Communication**: WebSocket (via backend integration with Socket.IO)

### Key Features

1. **Create Room**
   - Allows users to create a quiz room.
   - Generates a unique room ID for others to join.
   - Assigns the creator as the room leader.

2. **Join Room**
   - Enables users to join existing quiz rooms using a valid room ID.
   - Verifies room ID validity and connects to the backend.

3. **Session Management**
   - Utilizes `sessionStorage` to store temporary session data such as player name, team ID, and leader status.
   - Clears session data on page load to ensure a fresh start.

4. **Responsive Design**
   - Designed for compatibility across devices using Tailwind CSS.
   - Mobile-first layout ensures optimal usability on smaller screens.

5. **Real-Time Updates**
   - Syncs gameplay across all users using WebSocket communication via the backend.

### Project Structure

#### Components

- **`CreateRoom`**: Handles room creation functionality.
- **`JoinRoom`**: Allows players to join an existing room.
- **`HomePage`**: Landing page displaying the `CreateRoom` and `JoinRoom` components.

#### Styling

Key Tailwind CSS classes used:

- Background gradient: `bg-gradient-to-b from-gray-900 to-gray-800`
- Typography: `text-4xl font-bold text-center`
- Layout: `container mx-auto px-4 py-8`, `grid md:grid-cols-2 gap-8`

---

## Backend

### Technologies Used

- **Framework**: [Express.js](https://expressjs.com/) (Minimalist Node.js framework)
- **Database**: [MongoDB](https://www.mongodb.com/) (NoSQL database for storing room and user data)
- **Real-Time Communication**: [Socket.IO](https://socket.io/) (Real-time event-based communication)

### Key Features

1. **Room Management**
   - Create and store rooms with unique IDs.
   - Retrieve room details by ID.

2. **Player Interaction**
   - Allow players to join rooms.
   - Submit answers during gameplay.
   - Send chat messages within a room.

3. **Real-Time Communication**
   - Notify all players of updates such as new players joining or the game starting.
   - Handle disconnections gracefully.

### Routes

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/rooms/:roomId`          | Get room details by ID         |
| POST   | `/rooms`                  | Create a new room              |
| POST   | `/rooms/:roomId/join`     | Join a room                    |
| POST   | `/rooms/:roomId/answer`   | Submit an answer               |
| POST   | `/rooms/:roomId/start`    | Start the game in a room       |
| POST   | `/rooms/:roomId/message`  | Send a message to a room       |

### WebSocket Events

- **Connection**: Logs new client connections.
- **Disconnection**: Handles cleanup when a client disconnects.

### Database Connection

- Connects to MongoDB using `mongoose`.
- URI and credentials are stored in environment variables for security.

---

## Deployment

### Frontend

- Hosted on [Vercel](https://vercel.com/).
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Backend

- Hosted on [Render](https://render.com/).
- **Start Command**: `node server.js`

---

## Future Improvements

1. **Enhanced Validation**
   - Stricter checks for room IDs and user inputs.

2. **Error Handling**
   - Improved feedback for connection errors and invalid inputs.

3. **Game Analytics**
   - Track and display player performance metrics.

4. **State Management**
   - Implement Redux or Zustand in the frontend for better scalability.

5. **Leaderboard**
   - Display real-time leaderboards to players.

---

## Conclusion
The **Multiplayer Realtime Quiz** application leverages modern web technologies to deliver a dynamic and engaging user experience. The combination of Next.js, Tailwind CSS, Express.js, and Socket.IO ensures scalability, responsiveness, and real-time interactions. Both frontend and backend are deployed and ready for live use, offering seamless functionality for multiplayer quiz games.

