# 💬 Live Messaging — How It Works

This project uses **Socket.IO** (WebSockets) for real-time delivery combined with **MongoDB** for message persistence.

---

## Architecture Overview

```
Learner Browser                    Backend (Node.js)                   Trainer Browser
──────────────────                 ──────────────────                  ──────────────────
                                   
1. [Page Load]                                                         1. [Page Load]
   │ socket connects ─────────────►  io.on('connection')               │ socket connects ───► io.on('connection')
   │ emit('join_room', userId) ───►  socket.join('user_<learnerId>')   │ emit('join_room') ──► socket.join('user_<trainerId>')
   │                                                                   │
   │                                                                   │
2. [Learner sends message]                                             │
   │ POST /api/chat ────────────►  chatController.sendMessage()        │
   │  { receiver, message }          ├─ Save to MongoDB (Chat model)   │
   │                                 └─ io.to('user_<trainerId>')      │
   │                                      .emit('receive_message', msg)│
   │                                                                   │
   │                                                           ◄───────┤ socket.on('receive_message')
   │                                                                   │  → append to chat UI instantly
   │
3. [Load old messages]
   │ GET /api/chat/:userId ──────►  chatController.getMessages()
   │                                  └─ MongoDB.find({ sender/receiver })
   │  ◄── returns sorted history ──┘
```

---

## Key Files

| File | Role |
|------|------|
| [`backend/server.js`](./backend/server.js) | Creates the Socket.IO server, handles `join_room` & `disconnect` events |
| [`backend/models/Chat.js`](./backend/models/Chat.js) | MongoDB schema: `sender`, `receiver`, `message`, `timestamps` |
| [`backend/controllers/chatController.js`](./backend/controllers/chatController.js) | `sendMessage` saves to DB + emits socket event; `getMessages` fetches history |
| [`backend/routes/chatRoutes.js`](./backend/routes/chatRoutes.js) | `POST /api/chat` and `GET /api/chat/:userId` (both protected) |
| [`frontend/src/context/SocketContext.jsx`](./frontend/src/context/SocketContext.jsx) | Connects socket on login, joins user's personal room |
| [`frontend/src/components/chat/ChatWindow.jsx`](./frontend/src/components/chat/ChatWindow.jsx) | The chat UI — loads history on open, sends via API, receives in real-time |

---

## Step-by-Step Message Flow

### Sending a Message
1. User types and submits in `ChatWindow`
2. `POST /api/chat` is called with `{ receiver: userId, message: "..." }`
3. Backend saves the message to MongoDB
4. Backend emits `receive_message` to the **receiver's Socket.IO room** (`user_<receiverId>`)
5. The sender's own chat list is updated from the HTTP response (no socket needed)

### Receiving a Message (Real-Time)
1. When the app loads, `SocketContext` connects to `http://localhost:5000`
2. It immediately emits `join_room` with the logged-in user's `_id`
3. The server runs `socket.join('user_<userId>')` — creating a private room
4. When another user sends a message, their backend emits to this room
5. `ChatWindow` listens for `receive_message` and appends the message to state instantly — **no page refresh needed**

### Loading Message History
1. When `ChatWindow` opens with a `receiverId`
2. It calls `GET /api/chat/:receiverId`
3. Backend queries: `{ sender: me, receiver: other } OR { sender: other, receiver: me }`
4. Returns sorted by `createdAt` ascending
5. Messages render immediately, scroll snaps to latest

---

## Where Chat is Accessible

| Role | Location | How |
|------|----------|-----|
| **Learner** | Trainer Profile page (`/trainers/:id`) | "Message" button in the header |
| **Learner** | Learner Dashboard (`/dashboard`) | 💬 icon on each booking row |
| **Trainer** | Trainer Dashboard (`/dashboard`) | 💬 icon on each booking row |

---

## Real-Time Notifications (Non-Chat)

Socket.IO also powers two booking notifications:

| Event | Emitted When | Received By |
|-------|-------------|-------------|
| `new_booking` | Learner books a session | Trainer — shows in-app toast |
| `booking_status_updated` | Trainer accepts/rejects | Learner — shows in-app toast |

---

## Running Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # starts nodemon on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # starts Vite on port 5173
```

### Required `.env` values

**`backend/.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skill_connect
JWT_SECRET=your_strong_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

---

## Tech Stack

- **WebSockets**: [Socket.IO v4](https://socket.io/) — handles rooms, reconnection, and event-based messaging
- **HTTP API**: [Express v5](https://expressjs.com/) — for sending and fetching messages (ensures DB persistence)
- **Database**: [MongoDB + Mongoose](https://mongoosejs.com/) — stores all messages permanently
- **Auth**: JWT — all chat routes are protected; socket rooms are keyed by user ID
