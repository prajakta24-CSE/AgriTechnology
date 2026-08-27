const express = require('express');
const router = express.Router();
const { getWeatherForecast, getPestAlerts, createPestAlert } = require('../controllers/weatherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getWeatherForecast);
router.get('/pest-alerts', getPestAlerts);
router.post('/pest-alerts', protect, authorize('admin', 'expert'), createPestAlert);

module.exports = router;
