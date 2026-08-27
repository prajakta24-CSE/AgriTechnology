const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');

// @desc    Get all farms for the logged-in user (or all if admin)
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    const farms = await Farm.find(query).populate('farmer', 'name email phone').sort({ createdAt: -1 });

    // Include summary stats for each farm (number of crops, total acres)
    const farmsWithStats = await Promise.all(
      farms.map(async (farm) => {
        const cropsCount = await Crop.countDocuments({ farm: farm._id });
        const soilReport = await SoilReport.findOne({ farm: farm._id }).sort({ createdAt: -1 });
        return {
          ...farm.toObject(),
          activeCropsCount: cropsCount,
          latestSoilScore: soilReport ? soilReport.overallHealthScore : null,
        };
      })
    );

    res.json({
      success: true,
      count: farms.length,
      data: farmsWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm details
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('farmer', 'name email phone');

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this farm' });
    }

    const crops = await Crop.find({ farm: farm._id }).sort({ createdAt: -1 });
    const soilReports = await SoilReport.find({ farm: farm._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...farm.toObject(),
        crops,
        soilReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    const { name, location, totalArea, soilType, irrigationType, climateZone, notes } = req.body;

    const farm = await Farm.create({
      farmer: req.user._id,
      name,
      location: location || { city: 'Pune', state: 'Maharashtra', country: 'India' },
      totalArea,
      soilType: soilType || 'Black Soil',
      irrigationType: irrigationType || 'Drip Irrigation',
      climateZone: climateZone || 'Tropical Wet & Dry',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farm details
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this farm' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data: farm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (req.user.role !== 'admin' && farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
    }

    await Crop.deleteMany({ farm: farm._id });
    await SoilReport.deleteMany({ farm: farm._id });
    await Farm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Farm and associated crops/soil records deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
};
