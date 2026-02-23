const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
    const { trainer, date, message } = req.body;

    if (!trainer || !date) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const booking = await Booking.create({
        learner: req.user._id,
        trainer,
        date,
        message,
    });

    // Notify Trainer
    const Trainer = require('../models/Trainer');
    const trainerProfile = await Trainer.findById(trainer);

    if (trainerProfile) {
        const io = req.app.get('io');
        io.to('user_' + trainerProfile.user.toString()).emit('new_booking', booking);
    }

    res.status(201).json(booking);
});

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    let bookings;

    if (req.user.role === 'trainer') {
        const Trainer = require('../models/Trainer');
        const trainerProfile = await Trainer.findOne({ user: req.user._id });

        if (trainerProfile) {
            bookings = await Booking.find({ trainer: trainerProfile._id })
                .populate('learner', 'name email')
                .sort({ date: 1 }); // Sort by date ascending
        } else {
            bookings = [];
        }
    } else {
        // Learner
        bookings = await Booking.find({ learner: req.user._id })
            .populate({
                path: 'trainer',
                populate: { path: 'user', select: 'name email' }
            })
            .sort({ date: 1 });
    }

    res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Trainer Only)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Verify that the user is the trainer for this booking
    const Trainer = require('../models/Trainer');
    const trainerProfile = await Trainer.findOne({ user: req.user._id });

    if (!trainerProfile || booking.trainer.toString() !== trainerProfile._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this booking');
    }

    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();

    // Notify Learner
    const io = req.app.get('io');
    io.to('user_' + booking.learner.toString()).emit('booking_status_updated', updatedBooking);

    res.json(updatedBooking);
});

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus,
};
