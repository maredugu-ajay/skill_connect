const asyncHandler = require('express-async-handler');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

// @desc    Create or Update Trainer Profile
// @route   POST /api/trainers/profile
// @access  Private (Trainer only)
const createTrainerProfile = asyncHandler(async (req, res) => {
    const {
        skills,
        experience,
        location,
        price,
        mode,
        qualifications,
        bio,
    } = req.body;

    const trainerFields = {
        user: req.user._id,
        skills,
        experience,
        location,
        price,
        mode,
        qualifications,
        bio,
    };

    let trainer = await Trainer.findOne({ user: req.user._id });

    if (trainer) {
        // Update
        trainer = await Trainer.findOneAndUpdate(
            { user: req.user._id },
            { $set: trainerFields },
            { new: true }
        );
        res.json(trainer);
    } else {
        // Create
        trainer = new Trainer(trainerFields);
        await trainer.save();
        res.status(201).json(trainer);
    }
});

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
const getTrainers = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            $or: [
                { skills: { $regex: req.query.keyword, $options: 'i' } },
                { bio: { $regex: req.query.keyword, $options: 'i' } },
                // Note: Searching by name requires aggregation or separate query because name is in User model. 
                // For simplicity in this MERN stack, we'll search by bio and skills here, 
                // and we can adhere to the user request by ensuring bio contains relevant keywords or implementing aggregation later.
                // However, to effectively search by name, we first find users with that name.
            ]
        }
        : {};

    let query = Trainer.find(keyword).populate('user', 'name email');

    // If searching by name, we need a special handling since it's a referenced field
    if (req.query.keyword) {
        const users = await User.find({ name: { $regex: req.query.keyword, $options: 'i' } }).select('_id');
        const userIds = users.map(user => user._id);
        if (userIds.length > 0) {
            // We want trainers who match filter OR belong to these users
            query = Trainer.find({
                $or: [
                    { skills: { $regex: req.query.keyword, $options: 'i' } },
                    { bio: { $regex: req.query.keyword, $options: 'i' } },
                    { user: { $in: userIds } }
                ]
            }).populate('user', 'name email');
        }
    }

    const trainers = await query;
    res.json(trainers);
});

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
// @access  Public
const getTrainerById = asyncHandler(async (req, res) => {
    const trainer = await Trainer.findById(req.params.id).populate('user', 'name email');

    if (trainer) {
        res.json(trainer);
    } else {
        res.status(404);
        throw new Error('Trainer not found');
    }
});

// @desc    Get current trainer profile
// @route   GET /api/trainers/profile
// @access  Private
const getMyTrainerProfile = asyncHandler(async (req, res) => {
    const trainer = await Trainer.findOne({ user: req.user._id }).populate('user', 'name email');
    if (trainer) {
        res.json(trainer);
    } else {
        // It's possible a trainer user exists but hasn't created a profile yet
        res.status(200).json({}); // Return empty object instead of 404 to allow form creation
    }
});

module.exports = {
    createTrainerProfile,
    getTrainers,
    getTrainerById,
    getMyTrainerProfile,
};
