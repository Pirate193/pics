const express = require('express');
const { register,login, verifyEmail, forgotPassword, resetPassword,getMe,logout,googleAuth } = require('../controllers/ authController');
const {protect} = require('../middlewares/authMiddleware');
const router = express.Router();//initialize router

//public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/google-auth', googleAuth);

//protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;

