const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, updateUserByAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);

module.exports = router;
