const express = require('express');
const router = express.Router();
const { getSoilReports, createSoilReport, simulateSoilAdvisory, deleteSoilReport } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.post('/simulate', simulateSoilAdvisory);

router.use(protect);
router.route('/').get(getSoilReports).post(createSoilReport);
router.route('/:id').delete(deleteSoilReport);

module.exports = router;
