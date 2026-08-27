const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const PestAlert = require('../models/PestAlert');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const ForumPost = require('../models/ForumPost');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agritech';
    await mongoose.connect(mongoUri);
    console.log('🌿 Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Farm.deleteMany();
    await Crop.deleteMany();
    await SoilReport.deleteMany();
    await PestAlert.deleteMany();
    await Resource.deleteMany();
    await Order.deleteMany();
    await ForumPost.deleteMany();
    console.log('🧹 Cleaned existing database collections.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Syed Abul Arshad (Admin)',
      email: 'admin@agritech.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 98450 11223',
      preferredLanguage: 'en',
      location: { state: 'Maharashtra', district: 'Pune', village: 'Shivajinagar' },
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    });

    const farmerUser = await User.create({
      name: 'Ramesh Patel (Farmer)',
      email: 'farmer@agritech.com',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98765 43210',
      preferredLanguage: 'en',
      location: { state: 'Maharashtra', district: 'Pune', village: 'Baramati' },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const expertUser = await User.create({
      name: 'Dr. Anita Sharma (Senior Agronomist)',
      email: 'expert@agritech.com',
      password: 'password123',
      role: 'expert',
      phone: '+91 97123 99881',
      preferredLanguage: 'hi',
      location: { state: 'Punjab', district: 'Ludhiana', village: 'PAU Campus' },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    console.log('👤 Created Users (Admin, Farmer, Expert).');

    // 2. Create Farms
    const farm1 = await Farm.create({
      farmer: farmerUser._id,
      name: 'Green Valley Organic Plot',
      location: {
        address: 'Sector 4, Baramati Agro Belt',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        latitude: 18.1517,
        longitude: 74.5772,
      },
      totalArea: 12.5,
      soilType: 'Black Soil',
      irrigationType: 'Drip Irrigation',
      climateZone: 'Semi-Arid Tropical',
      notes: 'Certified organic acreage with solar automated drip fertigation.',
    });

    const farm2 = await Farm.create({
      farmer: farmerUser._id,
      name: 'Kaveri Delta Agro Farm',
      location: {
        address: 'Thanjavur Canal Belt',
        city: 'Thanjavur',
        state: 'Tamil Nadu',
        country: 'India',
        latitude: 10.7870,
        longitude: 79.1378,
      },
      totalArea: 8.0,
      soilType: 'Alluvial Soil',
      irrigationType: 'Canal / Flood',
      climateZone: 'Tropical Coastal',
      notes: 'High-yield paddy and pulse cultivation zone.',
    });

    console.log('🏡 Created Farm Profiles.');

    // 3. Create Crops
    const crop1 = await Crop.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      cropName: 'Cotton (Kapas)',
      variety: 'Bollgard II Hybrid',
      season: 'Kharif (Monsoon)',
      plantingDate: new Date(Date.now() - 45 * 86400000),
      expectedHarvestDate: new Date(Date.now() + 75 * 86400000),
      stage: 'Vegetative',
      areaPlanted: 5.0,
      healthStatus: 'Optimal',
      expectedYield: 25.0, // quintals
      logs: [
        { date: new Date(Date.now() - 45 * 86400000), activity: 'Sowing completed with 3x1 ft spacing.' },
        { date: new Date(Date.now() - 30 * 86400000), activity: 'First fertigation cycle: Bio-NPK 10kg/acre applied.' },
        { date: new Date(Date.now() - 10 * 86400000), activity: 'Weeding and inter-culture operation executed.' },
      ],
    });

    const crop2 = await Crop.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      cropName: 'Soybean',
      variety: 'JS-335 High Yield',
      season: 'Kharif (Monsoon)',
      plantingDate: new Date(Date.now() - 60 * 86400000),
      expectedHarvestDate: new Date(Date.now() + 35 * 86400000),
      stage: 'Flowering',
      areaPlanted: 4.5,
      healthStatus: 'Good',
      expectedYield: 18.0,
      logs: [
        { date: new Date(Date.now() - 60 * 86400000), activity: 'Rhizobium culture seed treatment & sowing.' },
        { date: new Date(Date.now() - 25 * 86400000), activity: 'Foliar spray with 19:19:19 water soluble fertilizer.' },
      ],
    });

    const crop3 = await Crop.create({
      farm: farm2._id,
      farmer: farmerUser._id,
      cropName: 'Basmati Rice',
      variety: 'Pusa Basmati 1121',
      season: 'Kharif (Monsoon)',
      plantingDate: new Date(Date.now() - 20 * 86400000),
      expectedHarvestDate: new Date(Date.now() + 100 * 86400000),
      stage: 'Germination',
      areaPlanted: 8.0,
      healthStatus: 'Optimal',
      expectedYield: 42.0,
      logs: [
        { date: new Date(Date.now() - 20 * 86400000), activity: 'System of Rice Intensification (SRI) transplanting completed.' },
      ],
    });

    console.log('🌾 Created Active Crops.');

    // 4. Create Soil Reports
    await SoilReport.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      sampleName: 'North-East Orchard & Cotton Grid',
      nitrogen: 310,
      phosphorus: 38,
      potassium: 240,
      pH: 6.8,
      moisture: 48,
      organicMatter: 2.1,
      electricalConductivity: 0.65,
      overallHealthScore: 92,
      recommendations: {
        fertilizerPlan: 'Optimal NPK profile. Maintain organic mulching with 2 tonnes/acre vermicompost.',
        suitableCrops: ['Cotton', 'Soybean', 'Wheat', 'Sugarcane', 'Onion'],
        phCorrection: 'Soil pH is in the optimal balanced range (6.2 - 7.5).',
        irrigationAdvice: 'Optimal soil moisture levels (40-65%). Standard irrigation schedule maintained.',
      },
    });

    await SoilReport.create({
      farm: farm2._id,
      farmer: farmerUser._id,
      sampleName: 'South Canal Paddy Basin',
      nitrogen: 195,
      phosphorus: 17,
      potassium: 120,
      pH: 5.6,
      moisture: 72,
      organicMatter: 0.9,
      electricalConductivity: 0.85,
      overallHealthScore: 62,
      recommendations: {
        fertilizerPlan: 'Severe Nitrogen & Phosphorus deficit. Apply SSP 50kg/acre and Neem-coated Urea in split doses.',
        suitableCrops: ['Rice / Paddy', 'Tea', 'Potato'],
        phCorrection: 'Strongly Acidic Soil (pH < 5.8): Apply agricultural lime (calcium carbonate) 1.5 tonnes/acre to neutralize acidity.',
        irrigationAdvice: 'High moisture saturation detected (>75%). Ensure field drainage channels are clear to avoid root rot.',
      },
    });

    console.log('🧪 Created Soil Health Reports.');

    // 5. Create Pest Alerts
    await PestAlert.create([
      {
        title: 'Pink Bollworm Warning on Cotton',
        pestName: 'Pink Bollworm (Pectinophora gossypiella)',
        scientificName: 'Pectinophora gossypiella',
        affectedCrops: ['Cotton', 'Okra (Bhindi)'],
        riskLevel: 'Critical',
        region: 'Maharashtra & Telangana Cotton Belt',
        symptoms: ['Rosette flowers on cotton', 'Bore holes in green bolls', 'Premature boll opening'],
        weatherTrigger: 'High humidity (>75%) and temperatures between 26-34°C',
        organicRemedy: 'Install 8 pheromone traps per acre. Release Trichogramma bactrae parasitoids (50,000/acre).',
        chemicalRemedy: 'Spray Emamectin Benzoate 5% SG @ 4g / 10L water or Chlorantraniliprole 18.5% SC @ 3ml / 10L water.',
        preventiveTips: ['Destroy crop residues', 'Avoid late-season crop extension', 'Use pheromone traps for monitoring'],
        imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=600',
      },
      {
        title: 'Fall Armyworm Outbreak Alert',
        pestName: 'Fall Armyworm (Spodoptera frugiperda)',
        scientificName: 'Spodoptera frugiperda',
        affectedCrops: ['Maize', 'Sorghum', 'Sugarcane', 'Millets'],
        riskLevel: 'High',
        region: 'Pan-India Semi-Arid Regions',
        symptoms: ['Window-pane leaf feeding', 'Sawdust-like frass inside central whorls', 'Ragged leaf margins'],
        weatherTrigger: 'Warm dry spells followed by intermittent rainfall',
        organicRemedy: 'Apply Bacillus thuringiensis (Bt) kurstaki @ 2g/L or Neem Oil (10000 ppm) @ 2ml/L.',
        chemicalRemedy: 'Apply Spinetoram 11.7% SC @ 0.5ml / L or Chlorantraniliprole 18.5% SC into the leaf whorls.',
        preventiveTips: ['Deep summer plowing', 'Intercropping with pulses like cowpea/pigeonpea'],
        imageUrl: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600',
      },
      {
        title: 'Yellow Mosaic Virus (YMV) Vector Alert',
        pestName: 'Whitefly (Bemisia tabaci)',
        scientificName: 'Bemisia tabaci',
        affectedCrops: ['Soybean', 'Blackgram', 'Greengram', 'Cotton'],
        riskLevel: 'Medium',
        region: 'Central and Western India',
        symptoms: ['Yellow patches on young leaves', 'Stunted plant growth', 'Curled leaf margins'],
        weatherTrigger: 'Dry and hot weather with temperatures >32°C',
        organicRemedy: 'Install yellow sticky traps (15 traps/acre). Spray 5% Neem Seed Kernel Extract (NSKE).',
        chemicalRemedy: 'Spray Acetamiprid 20% SP @ 0.4g / L or Diafenthiuron 50% WP @ 1.2g / L.',
        preventiveTips: ['Use resistant varieties (e.g. JS-335)', 'Maintain clean field borders'],
        imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600',
      },
      {
        title: 'Paddy Blast & Brown Spot Advisory',
        pestName: 'Rice Blast (Magnaporthe oryzae)',
        scientificName: 'Magnaporthe oryzae',
        affectedCrops: ['Rice / Paddy'],
        riskLevel: 'High',
        region: 'Coastal & Delta Rice Belts',
        symptoms: ['Spindle-shaped diamond lesions with gray centers', 'Neck rot on panicles', 'Lodging'],
        weatherTrigger: 'Continuous rain, high humidity (>90%) and cloudy skies',
        organicRemedy: 'Seed treatment with Pseudomonas fluorescens @ 10g/kg. Foliar spray of cow dung filtrate.',
        chemicalRemedy: 'Spray Tricyclazole 75% WP @ 0.6g / L or Isoprothiolane 40% EC @ 1.5ml / L.',
        preventiveTips: ['Avoid excess nitrogen fertilizer application', 'Maintain optimum water depth (2-3 cm)'],
        imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600',
      },
    ]);

    console.log('🐛 Created Pest Alerts & Advisories.');

    // 6. Create Marketplace Resources
    const resources = await Resource.create([
      {
        name: 'Bollgard II Hybrid Cotton Seeds (High Yield)',
        category: 'Seeds',
        description: 'Genetically enhanced high-vigor hybrid cotton seeds with built-in resistance to American bollworm and high lint output.',
        price: 850,
        unit: 'packet (450g)',
        stockQuantity: 250,
        rating: 4.9,
        numReviews: 42,
        brand: 'Mahyco AgriTech',
        organicCertified: false,
        imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=600',
        specifications: { purity: '99%', germinationRate: '92%', dosage: '2 packets/acre' },
      },
      {
        name: 'Neem-Coated Urea 46% (Slow Release Nitrogen)',
        category: 'Fertilizers',
        description: 'Premium slow-release nitrogen fertilizer coated with pure neem oil to minimize nitrogen volatilization and boost nutrient uptake.',
        price: 268,
        unit: 'bag (45kg)',
        stockQuantity: 400,
        rating: 4.8,
        numReviews: 89,
        brand: 'IFFCO Certified',
        organicCertified: false,
        imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600',
        specifications: { purity: '46% Nitrogen', germinationRate: 'N/A', dosage: '45-90 kg/acre' },
      },
      {
        name: 'Pure Vermicompost Organic Bio-Manure',
        category: 'Fertilizers',
        description: '100% organic earthworm compost enriched with beneficial microbes, humic acid, and essential micronutrients for revitalizing soil.',
        price: 450,
        unit: 'bag (50kg)',
        stockQuantity: 180,
        rating: 4.9,
        numReviews: 35,
        brand: 'AgriOrganic Gold',
        organicCertified: true,
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600',
        specifications: { purity: '100% Organic', germinationRate: 'N/A', dosage: '2-3 tonnes/acre' },
      },
      {
        name: 'Cold-Pressed Pure Neem Oil (10,000 PPM Azadirachtin)',
        category: 'Bio-Pesticides',
        description: 'Broad-spectrum organic bio-pesticide and insect growth regulator effective against 200+ sucking pests, caterpillars, and mites.',
        price: 520,
        unit: 'bottle (1 Liter)',
        stockQuantity: 140,
        rating: 4.7,
        numReviews: 29,
        brand: 'EcoShield Bio',
        organicCertified: true,
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
        specifications: { purity: '10000 PPM', germinationRate: 'N/A', dosage: '2-3 ml/Liter' },
      },
      {
        name: 'Trichoderma Viride Bio-Fungicide Powder',
        category: 'Bio-Pesticides',
        description: 'Eco-friendly fungal biocontrol agent for controlling soil-borne diseases like root rot, damping-off, wilt, and collar rot in all crops.',
        price: 190,
        unit: 'packet (1kg)',
        stockQuantity: 300,
        rating: 4.8,
        numReviews: 54,
        brand: 'BioAgro Defense',
        organicCertified: true,
        imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600',
        specifications: { purity: '2x10^8 CFU/g', germinationRate: 'N/A', dosage: '1 kg/acre' },
      },
      {
        name: 'Automatic Venturi Drip Fertigation Injector (1.5 Inch)',
        category: 'Irrigation & Tools',
        description: 'Heavy-duty chemical-resistant Venturi fertilizer injection system with flow control valve and suction hose for precise drip fertigation.',
        price: 1450,
        unit: 'set',
        stockQuantity: 75,
        rating: 4.6,
        numReviews: 22,
        brand: 'Jain Precision Drip',
        organicCertified: false,
        imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600',
        specifications: { purity: 'PP Material', germinationRate: 'N/A', dosage: 'N/A' },
      },
      {
        name: 'Smart Bluetooth Soil NPK, pH & Moisture Sensor Probe',
        category: 'Machinery & Equipment',
        description: 'Real-time wireless 5-in-1 digital soil probe that syncs NPK, pH, moisture, and temperature data directly to the Agri-Tech mobile app.',
        price: 3200,
        unit: 'unit',
        stockQuantity: 45,
        rating: 4.9,
        numReviews: 68,
        brand: 'AgriSensor IoT',
        organicCertified: false,
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        specifications: { purity: 'IP68 Waterproof', germinationRate: 'N/A', dosage: 'N/A' },
      },
      {
        name: 'Solar-Powered Agricultural Insect & Pest Trap',
        category: 'Machinery & Equipment',
        description: 'Automatic dusk-to-dawn LED UV light trap with high-voltage mesh grid, powered by high-efficiency mono-crystalline solar panel.',
        price: 2400,
        unit: 'unit',
        stockQuantity: 60,
        rating: 4.8,
        numReviews: 31,
        brand: 'Surya Kisan Green',
        organicCertified: true,
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600',
        specifications: { purity: 'Solar 10W', germinationRate: 'N/A', dosage: '1 trap/2 acres' },
      },
    ]);

    console.log('🛒 Created Marketplace Catalog.');

    // 7. Create Orders
    await Order.create({
      farmer: farmerUser._id,
      orderItems: [
        {
          resource: resources[0]._id,
          name: resources[0].name,
          quantity: 2,
          price: resources[0].price,
          unit: resources[0].unit,
          image: resources[0].imageUrl,
        },
        {
          resource: resources[3]._id,
          name: resources[3].name,
          quantity: 3,
          price: resources[3].price,
          unit: resources[3].unit,
          image: resources[3].imageUrl,
        },
      ],
      shippingAddress: {
        fullName: 'Ramesh Patel',
        phoneNumber: '+91 98765 43210',
        farmAddress: 'Green Valley Plot, Sector 4, Baramati Agro Belt',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '413102',
      },
      paymentMethod: 'Cash on Delivery (Kisan Pay)',
      paymentStatus: 'Completed',
      itemsPrice: 3260,
      taxPrice: 163,
      shippingPrice: 0,
      totalPrice: 3423,
      status: 'Shipped',
      trackingHistory: [
        { status: 'Order Placed', timestamp: new Date(Date.now() - 48 * 3600000), comment: 'Order received and verified.' },
        { status: 'Processing', timestamp: new Date(Date.now() - 36 * 3600000), comment: 'Dispatched from AgriTech Regional Warehouse (Pune Hub).' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 12 * 3600000), comment: 'In transit via Kisan Rural Express.' },
      ],
    });

    console.log('📦 Created Sample Orders.');

    // 8. Create Community Forum Posts & Expert Consultations
    await ForumPost.create([
      {
        author: farmerUser._id,
        authorName: farmerUser.name,
        title: 'Yellowing of lower leaves in 40-day-old Cotton crop — what could be the cause?',
        category: 'Crop Diseases',
        cropTag: 'Cotton',
        description: 'Noticeable yellowing starting from leaf margins towards the center in my Bt-Cotton plot. Moisture levels are normal. Should I spray micronutrients or is it Magnesium deficiency?',
        status: 'Expert Answered',
        upvotes: 7,
        upvotedBy: [expertUser._id, adminUser._id],
        replies: [
          {
            user: expertUser._id,
            authorName: 'Dr. Anita Sharma (Senior Agronomist)',
            authorRole: 'expert',
            content: 'Interveinal chlorosis (yellowing between green veins) in older leaves is a classic symptom of Magnesium (Mg) deficiency or mild Nitrogen deficit during vegetative spurts. Recommend a foliar spray of 1% Magnesium Sulphate (MgSO4) + 1% 19:19:19 water-soluble fertilizer in early morning.',
            isExpertAnswer: true,
            upvotes: 12,
            createdAt: new Date(Date.now() - 18 * 3600000),
          },
          {
            user: adminUser._id,
            authorName: 'Syed Abul Arshad (Admin)',
            authorRole: 'admin',
            content: 'Ensure you also verify soil pH. If pH is above 8.0, micronutrient absorption reduces. Check your latest soil health report in the Agri-Tech portal.',
            isExpertAnswer: true,
            upvotes: 4,
            createdAt: new Date(Date.now() - 8 * 3600000),
          },
        ],
      },
      {
        author: farmerUser._id,
        authorName: farmerUser.name,
        title: 'Best organic method to prevent Stem Borer in Basmati Paddy?',
        category: 'Pest Control',
        cropTag: 'Rice / Paddy',
        description: 'Transplanted Pusa 1121 two weeks ago. Want to avoid excessive chemicals this season. What biological control steps should I follow?',
        status: 'Open',
        upvotes: 4,
        upvotedBy: [],
        replies: [
          {
            user: expertUser._id,
            authorName: 'Dr. Anita Sharma (Senior Agronomist)',
            authorRole: 'expert',
            content: 'Release egg parasitoids Trichogramma japonicum @ 40,000/acre starting at 30 days after transplanting (repeat 3 times at 10-day intervals). Install 5 pheromone traps per acre to track male moth catches.',
            isExpertAnswer: true,
            upvotes: 9,
            createdAt: new Date(Date.now() - 4 * 3600000),
          },
        ],
      },
    ]);

    console.log('💬 Created Forum Discussions & Expert Q&As.');

    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
