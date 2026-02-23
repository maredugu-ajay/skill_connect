# SkillCon – Skill-Trainer Marketplace

A full-stack web platform that connects learners with skilled trainers. Browse trainer profiles, book sessions, chat in real-time, and leave reviews — all in one place.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?logo=socket.io)

---

## ✨ Features

- **🔐 Authentication** — Email/password & Google OAuth signup/login with role selection (Learner / Trainer)
- **👨‍🏫 Trainer Profiles** — Rich profiles with skills, bio, hourly rate, and availability
- **🔍 Browse & Filter** — Search trainers by skill, filter with chip-based categories
- **📅 Session Booking** — Book, manage, and complete training sessions
- **💬 Real-Time Chat** — Live messaging between learners and trainers via WebSockets
- **⭐ Reviews & Ratings** — Leave and view reviews on trainer profiles
- **📊 Dashboards** — Dedicated dashboards for both learners and trainers
- **🎨 Modern UI** — Glassmorphism design, smooth animations, and responsive layout

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS, Framer Motion     |
| Backend    | Node.js, Express 5                              |
| Database   | MongoDB (Mongoose ODM)                          |
| Auth       | JWT, bcrypt, Google Auth Library                 |
| Real-Time  | Socket.IO                                       |
| Other      | Axios, Nodemailer, Lucide Icons                 |

---

## 📁 Project Structure

```
skillcon/
├── backend/
│   ├── config/          # DB connection config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── utils/            # Helper utilities
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # App root & routing
│   └── index.html
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/skillcon.git
cd skillcon
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the dev server:

```bash
npm run dev
```

The app will be running at **http://localhost:5173**.

---

## 📜 API Endpoints

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/api/auth/register`      | Register a new user      |
| POST   | `/api/auth/login`         | Login                    |
| POST   | `/api/auth/google`        | Google OAuth login       |
| GET    | `/api/trainers`           | List all trainers        |
| GET    | `/api/trainers/:id`       | Get trainer details      |
| POST   | `/api/bookings`           | Create a booking         |
| GET    | `/api/bookings`           | Get user bookings        |
| POST   | `/api/reviews`            | Submit a review          |
| GET    | `/api/reviews/:trainerId` | Get trainer reviews      |
| GET    | `/api/chat/:id`           | Get chat messages        |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
