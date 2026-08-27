const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pestName: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      default: '',
    },
    affectedCrops: [{ type: String, required: true }],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    region: {
      type: String,
      default: 'All Regions',
    },
    symptoms: [{ type: String }],
    weatherTrigger: {
      type: String,
      default: 'High humidity (>80%) and temperatures between 25-32°C',
    },
    organicRemedy: {
      type: String,
      required: true,
    },
    chemicalRemedy: {
      type: String,
      required: true,
    },
    preventiveTips: [{ type: String }],
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=600',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PestAlert', pestAlertSchema);
