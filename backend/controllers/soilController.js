const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');

// Intelligent soil recommendation calculator helper
const calculateSoilAdvisory = (n, p, k, ph, moisture, organicMatter, soilType = 'Black Soil') => {
  let score = 100;
  let fertilizerPlan = [];
  let suitableCrops = [];
  let phCorrection = 'Soil pH is in the optimal balanced range (6.2 - 7.5).';
  let irrigationAdvice = '';

  // Nitrogen (Optimal: 280 - 450 kg/ha)
  if (n < 200) {
    score -= 15;
    fertilizerPlan.push('Severe Nitrogen deficiency: Apply Neem-coated Urea (45 kg/acre) in split doses with organic compost.');
  } else if (n < 280) {
    score -= 8;
    fertilizerPlan.push('Mild Nitrogen deficit: Apply 25 kg/acre Urea or incorporate Nitrogen-fixing leguminous cover crops (Sesbania/Cowpea).');
  } else if (n > 560) {
    score -= 5;
    fertilizerPlan.push('Excess Nitrogen detected: Reduce chemical fertilizer application to prevent vegetative lodging and pest vulnerability.');
  }

  // Phosphorus (Optimal: 25 - 60 kg/ha)
  if (p < 20) {
    score -= 15;
    fertilizerPlan.push('Low Phosphorus: Apply Single Super Phosphate (SSP) 50 kg/acre or DAP 30 kg/acre at root zone.');
  } else if (p < 28) {
    score -= 6;
    fertilizerPlan.push('Moderate Phosphorus: Add Rock Phosphate or bone meal enriched compost.');
  }

  // Potassium (Optimal: 150 - 300 kg/ha)
  if (k < 120) {
    score -= 12;
    fertilizerPlan.push('Potassium deficiency: Apply Muriate of Potash (MOP) 20 kg/acre to boost drought tolerance and disease resistance.');
  } else if (k < 150) {
    score -= 5;
    fertilizerPlan.push('Slight Potassium deficit: Apply 10 kg/acre SOP or wood ash compost.');
  }

  // pH Analysis
  if (ph < 5.8) {
    score -= 18;
    phCorrection = 'Strongly Acidic Soil (pH < 5.8): Apply agricultural lime (calcium carbonate) 1.5 - 2 tonnes/acre to neutralize acidity.';
  } else if (ph < 6.3) {
    score -= 8;
    phCorrection = 'Slightly Acidic Soil: Add dolomite lime and farmyard manure.';
  } else if (ph > 8.3) {
    score -= 18;
    phCorrection = 'Alkaline/Saline Soil (pH > 8.3): Apply agricultural gypsum (1-2 tonnes/acre) followed by heavy flushing irrigation to displace sodium ions.';
  } else if (ph > 7.8) {
    score -= 8;
    phCorrection = 'Moderately Alkaline Soil: Apply elemental sulfur and enrich with organic humic acid.';
  }

  // Moisture Analysis
  if (moisture < 30) {
    irrigationAdvice = 'Soil moisture is low (<30%). Immediate drip irrigation cycle (3-4 hours) recommended.';
  } else if (moisture > 75) {
    irrigationAdvice = 'High moisture saturation detected (>75%). Ensure field drainage channels are clear to avoid root rot.';
  } else {
    irrigationAdvice = 'Optimal soil moisture levels (40-65%). Standard irrigation schedule maintained.';
  }

  // Organic Matter
  if (organicMatter < 1.0) {
    score -= 10;
    fertilizerPlan.push('Low Organic Matter (<1%): Apply 4-5 tonnes/acre well-decomposed Farmyard Manure (FYM) or Vermicompost.');
  }

  // Suitable Crops Matching
  if (ph >= 6.0 && ph <= 7.8) {
    if (soilType.includes('Black') || soilType.includes('Clay')) {
      suitableCrops = ['Cotton', 'Soybean', 'Wheat', 'Sugarcane', 'Chickpea (Gram)', 'Onion'];
    } else if (soilType.includes('Red') || soilType.includes('Laterite')) {
      suitableCrops = ['Groundnut', 'Millets (Ragi/Bajra)', 'Pulses', 'Turmeric', 'Maize', 'Chili'];
    } else {
      suitableCrops = ['Rice / Paddy', 'Wheat', 'Mustard', 'Vegetables', 'Maize', 'Potato'];
    }
  } else if (ph < 6.0) {
    suitableCrops = ['Tea', 'Coffee', 'Potato', 'Sweet Potato', 'Pineapple', 'Rice'];
  } else {
    suitableCrops = ['Barley', 'Mustard', 'Cotton', 'Guar (Cluster Bean)', 'Date Palm'];
  }

  if (fertilizerPlan.length === 0) {
    fertilizerPlan.push('Nutrient levels are well balanced! Maintain standard maintenance dose of organic compost.');
  }

  score = Math.max(25, Math.min(100, score));

  return {
    score,
    fertilizerPlan: fertilizerPlan.join(' | '),
    suitableCrops,
    phCorrection,
    irrigationAdvice,
  };
};

// @desc    Get all soil reports (for farmer/farm)
// @route   GET /api/soil
// @access  Private
const getSoilReports = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    if (req.query.farmId) {
      query.farm = req.query.farmId;
    }

    const reports = await SoilReport.find(query)
      .populate('farm', 'name location totalArea soilType')
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Calculate soil report
// @route   POST /api/soil
// @access  Private
const createSoilReport = async (req, res) => {
  try {
    const { farm, sampleName, nitrogen, phosphorus, potassium, pH, moisture, organicMatter, electricalConductivity } = req.body;

    const farmDoc = await Farm.findById(farm);
    if (!farmDoc) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const n = Number(nitrogen);
    const p = Number(phosphorus);
    const k = Number(potassium);
    const phVal = Number(pH);
    const moist = moisture ? Number(moisture) : 45;
    const om = organicMatter ? Number(organicMatter) : 1.8;
    const ec = electricalConductivity ? Number(electricalConductivity) : 0.75;

    const advisory = calculateSoilAdvisory(n, p, k, phVal, moist, om, farmDoc.soilType);

    const report = await SoilReport.create({
      farm,
      farmer: req.user._id,
      sampleName: sampleName || 'Seasonal Plot Assessment',
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      pH: phVal,
      moisture: moist,
      organicMatter: om,
      electricalConductivity: ec,
      overallHealthScore: advisory.score,
      recommendations: {
        fertilizerPlan: advisory.fertilizerPlan,
        suitableCrops: advisory.suitableCrops,
        phCorrection: advisory.phCorrection,
        irrigationAdvice: advisory.irrigationAdvice,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Soil report generated with smart agricultural advisory',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate / Preview soil test without saving (Real-time live calculator)
// @route   POST /api/soil/simulate
// @access  Public
const simulateSoilAdvisory = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, pH, moisture, organicMatter, soilType } = req.body;

    const advisory = calculateSoilAdvisory(
      Number(nitrogen || 250),
      Number(phosphorus || 30),
      Number(potassium || 180),
      Number(pH || 6.8),
      Number(moisture || 45),
      Number(organicMatter || 1.8),
      soilType || 'Black Soil'
    );

    res.json({
      success: true,
      data: advisory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete soil report
// @route   DELETE /api/soil/:id
// @access  Private
const deleteSoilReport = async (req, res) => {
  try {
    const report = await SoilReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && report.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await SoilReport.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Soil test report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSoilReports,
  createSoilReport,
  simulateSoilAdvisory,
  deleteSoilReport,
};
