const express = require('express');
const router = express.Router();
const { registerUser, authUser, googleLogin, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/signup', registerUser); // Alias for signup
router.post('/login', authUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
