const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide farm name'],
      trim: true,
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Pune' },
      state: { type: String, default: 'Maharashtra' },
      country: { type: String, default: 'India' },
      latitude: { type: Number, default: 18.5204 },
      longitude: { type: Number, default: 73.8567 },
    },
    totalArea: {
      type: Number,
      required: [true, 'Please provide total farm area in acres'],
      min: 0.1,
    },
    soilType: {
      type: String,
      enum: ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Clayey Soil', 'Sandy Loam', 'Laterite Soil'],
      default: 'Black Soil',
    },
    irrigationType: {
      type: String,
      enum: ['Drip Irrigation', 'Sprinkler', 'Canal / Flood', 'Rainfed', 'Tube Well'],
      default: 'Drip Irrigation',
    },
    climateZone: {
      type: String,
      default: 'Tropical Wet & Dry',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', farmSchema);
