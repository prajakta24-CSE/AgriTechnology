const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema(
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
    sampleName: {
      type: String,
      default: 'Main Plot Topsoil',
    },
    nitrogen: {
      type: Number, // mg/kg or kg/ha
      required: true,
    },
    phosphorus: {
      type: Number, // mg/kg or kg/ha
      required: true,
    },
    potassium: {
      type: Number, // mg/kg or kg/ha
      required: true,
    },
    pH: {
      type: Number, // 0 - 14
      required: true,
    },
    moisture: {
      type: Number, // percentage
      default: 45,
    },
    organicMatter: {
      type: Number, // percentage
      default: 1.8,
    },
    electricalConductivity: {
      type: Number, // dS/m
      default: 0.75,
    },
    overallHealthScore: {
      type: Number, // 0 - 100
      default: 80,
    },
    recommendations: {
      fertilizerPlan: { type: String, default: '' },
      suitableCrops: [{ type: String }],
      phCorrection: { type: String, default: 'Soil pH is balanced.' },
      irrigationAdvice: { type: String, default: '' },
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SoilReport', soilReportSchema);
