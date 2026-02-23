const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Trainer = require('../models/Trainer');
const Booking = require('../models/Booking');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Learner)
const createReview = asyncHandler(async (req, res) => {
    const { rating, comment, trainerId } = req.body;

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
        res.status(404);
        throw new Error('Trainer not found');
    }

    // Check if learner has already reviewed this trainer
    const alreadyReviewed = await Review.findOne({
        learner: req.user._id,
        trainer: trainerId,
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    // Optional: Check if learner has actually booked a session with this trainer
    // const hasBooking = await Booking.findOne({ learner: req.user._id, trainer: trainerId, status: 'completed' });
    // if (!hasBooking) {
    //     res.status(400);
    //     throw new Error('You can only review trainers you have booked sessions with');
    // }

    const review = await Review.create({
        learner: req.user._id,
        trainer: trainerId,
        rating: Number(rating),
        comment,
    });

    const reviews = await Review.find({ trainer: trainerId });

    trainer.numReviews = reviews.length;
    trainer.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await trainer.save();

    res.status(201).json(review);
});

// @desc    Get reviews for a trainer
// @route   GET /api/reviews/:trainerId
// @access  Public
const getTrainerReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ trainer: req.params.trainerId }).populate('learner', 'name');
    res.json(reviews);
});

module.exports = {
    createReview,
    getTrainerReviews,
};
