const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        resource: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Resource',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        unit: { type: String, default: 'kg' },
        image: { type: String, default: '' },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      farmAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery (Kisan Pay)', 'UPI / NetBanking', 'Kisan Credit Card (KCC)'],
      default: 'Cash on Delivery (Kisan Pay)',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Refunded'],
      default: 'Completed',
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    trackingHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
