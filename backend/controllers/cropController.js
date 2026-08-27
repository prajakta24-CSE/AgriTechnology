const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get crops (filter by farm or get all for farmer)
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    if (req.query.farmId) {
      query.farm = req.query.farmId;
    }

    if (req.query.stage) {
      query.stage = req.query.stage;
    }

    const crops = await Crop.find(query)
      .populate('farm', 'name location totalArea soilType')
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crops.length,
      data: crops,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farm', 'name location totalArea soilType irrigationType')
      .populate('farmer', 'name email phone');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop record not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this crop' });
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new crop
// @route   POST /api/crops
// @access  Private
const addCrop = async (req, res) => {
  try {
    const { farm, cropName, variety, season, plantingDate, expectedHarvestDate, stage, areaPlanted, expectedYield } = req.body;

    const farmDoc = await Farm.findById(farm);
    if (!farmDoc) {
      return res.status(404).json({ success: false, message: 'Associated farm not found' });
    }

    if (req.user.role !== 'admin' && farmDoc.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add crop to this farm' });
    }

    const crop = await Crop.create({
      farm,
      farmer: req.user._id,
      cropName,
      variety: variety || 'Standard Hybrid',
      season: season || 'Kharif (Monsoon)',
      plantingDate: plantingDate || Date.now(),
      expectedHarvestDate,
      stage: stage || 'Sowing',
      areaPlanted,
      expectedYield: expectedYield || 0,
      healthStatus: 'Optimal',
      logs: [
        {
          date: new Date(),
          activity: `Planted ${cropName} (${variety || 'Hybrid'}) across ${areaPlanted} acres.`,
          notes: 'Crop planting registered in system.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: crop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop (stage progression, health, yield)
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this crop' });
    }

    // Auto log stage transition
    if (req.body.stage && req.body.stage !== crop.stage) {
      crop.logs.push({
        date: new Date(),
        activity: `Growth stage advanced: ${crop.stage} ➔ ${req.body.stage}`,
        notes: req.body.stageNotes || 'Stage milestone reached.',
      });
    }

    Object.assign(crop, req.body);
    await crop.save();

    res.json({
      success: true,
      message: 'Crop updated successfully',
      data: crop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add activity log entry to crop
// @route   POST /api/crops/:id/logs
// @access  Private
const addCropLog = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { activity, notes, date } = req.body;

    crop.logs.unshift({
      activity,
      notes: notes || '',
      date: date || new Date(),
    });

    await crop.save();

    res.json({
      success: true,
      message: 'Activity logged successfully',
      data: crop.logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (req.user.role !== 'admin' && crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  addCrop,
  updateCrop,
  addCropLog,
  deleteCrop,
};
