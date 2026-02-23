const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { receiver, message } = req.body;

    if (!receiver || !message) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const chat = await Chat.create({
        sender: req.user._id,
        receiver,
        message,
    });

    const fullChat = await Chat.findOne({ _id: chat._id })
        .populate('sender', 'name email')
        .populate('receiver', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    io.to('user_' + receiver).emit('receive_message', fullChat);

    res.status(201).json(fullChat);
});

// @desc    Get messages between two users
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const messages = await Chat.find({
        $or: [
            { sender: req.user._id, receiver: userId },
            { sender: userId, receiver: req.user._id },
        ],
    })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort({ createdAt: 1 });

    res.json(messages);
});

module.exports = {
    sendMessage,
    getMessages,
};
