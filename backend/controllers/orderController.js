const Order = require('../models/Order');
const Resource = require('../models/Resource');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    // Verify and decrement stock
    for (const item of orderItems) {
      const resource = await Resource.findById(item.resource);
      if (resource) {
        resource.stockQuantity = Math.max(0, resource.stockQuantity - item.quantity);
        await resource.save();
      }
    }

    const order = await Order.create({
      farmer: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
      paymentStatus: 'Completed',
      itemsPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
      status: 'Order Placed',
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          comment: 'Your Agri-Tech order has been received and confirmed.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery initiated.',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in farmer's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('orderItems.resource', 'name category brand')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('orderItems.resource', 'name category brand imageUrl');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('farmer', 'name email phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status || order.status;
    order.trackingHistory.push({
      status: status || order.status,
      timestamp: new Date(),
      comment: comment || `Status updated to ${status}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
