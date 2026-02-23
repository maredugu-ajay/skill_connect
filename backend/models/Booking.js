const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        learner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Trainer',
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'accepted', 'rejected', 'completed'],
            default: 'pending',
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
