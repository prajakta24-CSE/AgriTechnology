const Resource = require('../models/Resource');

// @desc    Get all resources/products with filters
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    let query = { adminApproved: true };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    if (req.query.organic === 'true') {
      query.organicCertified = true;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ rating: -1, createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/resources
// @access  Private (Admin)
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product added to marketplace catalog',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resource/inventory
// @route   PUT /api/resources/:id
// @access  Private (Admin)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, message: 'Product removed from catalog' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
