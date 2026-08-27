const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      default: 'Standard Hybrid',
      trim: true,
    },
    season: {
      type: String,
      enum: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Perennial'],
      default: 'Kharif (Monsoon)',
    },
    plantingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedHarvestDate: {
      type: Date,
      required: true,
    },
    stage: {
      type: String,
      enum: ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Harvesting', 'Completed'],
      default: 'Sowing',
    },
    areaPlanted: {
      type: Number,
      required: [true, 'Planted area in acres is required'],
    },
    healthStatus: {
      type: String,
      enum: ['Optimal', 'Good', 'Moderate Attention', 'Pest Risk', 'Diseased'],
      default: 'Optimal',
    },
    expectedYield: {
      type: Number, // in metric quintals or tonnes
      default: 0,
    },
    actualYield: {
      type: Number,
      default: 0,
    },
    logs: [
      {
        date: { type: Date, default: Date.now },
        activity: { type: String, required: true }, // e.g. 'Fertilizer NPK applied', 'Pest spray', 'Irrigation cycle'
        notes: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);
