const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Allow frontend
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Set io to be accessible in controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a user-specific room
    socket.on('join_room', (userId) => {
        socket.join('user_' + userId);
        console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes will be mounted here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.use(require('./middleware/errorMiddleware').errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
