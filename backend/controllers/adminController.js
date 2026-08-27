const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const ForumPost = require('../models/ForumPost');
const PestAlert = require('../models/PestAlert');

// @desc    Get comprehensive system analytics & dashboard metrics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalExperts = await User.countDocuments({ role: 'expert' });
    const totalFarms = await Farm.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalSoilReports = await SoilReport.countDocuments();
    const totalProducts = await Resource.countDocuments();
    const totalOrders = await Order.countDocuments();
    const activePestAlerts = await PestAlert.countDocuments({ isActive: true });
    const openForumQuestions = await ForumPost.countDocuments({ status: { $ne: 'Resolved' } });

    // Aggregate total farm acreage
    const farmAreaAgg = await Farm.aggregate([
      { $group: { _id: null, totalAcreage: { $sum: '$totalArea' } } },
    ]);
    const totalAcreage = farmAreaAgg.length > 0 ? farmAreaAgg[0].totalAcreage : 0;

    // Aggregate order revenue
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Crop distribution by stage
    const cropStageDistribution = await Crop.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalExperts,
        totalFarms,
        totalAcreage,
        totalCrops,
        totalSoilReports,
        totalProducts,
        totalOrders,
        totalRevenue,
        activePestAlerts,
        openForumQuestions,
        cropStageDistribution,
        recentOrders,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    let query = {};
    if (req.query.role && req.query.role !== 'All') {
      query.role = req.query.role;
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status / role
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserByAdmin = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User profile updated by admin',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserByAdmin,
};
