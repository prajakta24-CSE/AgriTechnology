const express = require('express');
const router = express.Router();
const { getCrops, getCropById, addCrop, updateCrop, addCropLog, deleteCrop } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getCrops).post(addCrop);
router.route('/:id').get(getCropById).put(updateCrop).delete(deleteCrop);
router.route('/:id/logs').post(addCropLog);

module.exports = router;
