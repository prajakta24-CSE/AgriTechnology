const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Seeds', 'Fertilizers', 'Bio-Pesticides', 'Irrigation & Tools', 'Machinery & Equipment'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg', // e.g. 'kg', 'packet', 'liter', 'unit', 'bag (50kg)'
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 100,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 18,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: 'AgriTech Certified',
    },
    organicCertified: {
      type: Boolean,
      default: false,
    },
    specifications: {
      purity: { type: String, default: '99%' },
      germinationRate: { type: String, default: '92%' },
      dosage: { type: String, default: '2-3 kg/acre' },
    },
    adminApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
