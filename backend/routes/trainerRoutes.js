const express = require('express');
const router = express.Router();
const {
    createTrainerProfile,
    getTrainers,
    getTrainerById,
    getMyTrainerProfile,
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getTrainers);
router
    .route('/profile')
    .get(protect, authorize('trainer'), getMyTrainerProfile)
    .post(protect, authorize('trainer'), createTrainerProfile);
router.route('/:id').get(getTrainerById);

module.exports = router;
