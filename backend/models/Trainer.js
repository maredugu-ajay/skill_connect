const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true,
        },
        skills: [
            {
                type: String,
                required: true,
            },
        ],
        experience: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        mode: {
            type: String, // 'online', 'offline', 'both'
            required: true,
            enum: ['online', 'offline', 'both'],
        },
        qualifications: {
            type: String,
        },
        bio: {
            type: String,
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
