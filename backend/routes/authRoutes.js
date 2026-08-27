const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, demoLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/demo/:role', demoLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
