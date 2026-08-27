const axios = require('axios');
const PestAlert = require('../models/PestAlert');

// Major Indian / Global Agricultural Hub coordinates
const CITY_COORDINATES = {
  pune: { lat: 18.5204, lon: 73.8567, city: 'Pune', state: 'Maharashtra' },
  nashik: { lat: 19.9975, lon: 73.7898, city: 'Nashik', state: 'Maharashtra' },
  nagpur: { lat: 21.1458, lon: 79.0882, city: 'Nagpur', state: 'Maharashtra' },
  hyderabad: { lat: 17.3850, lon: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  bengaluru: { lat: 12.9716, lon: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  ludhiana: { lat: 30.9010, lon: 75.8573, city: 'Ludhiana', state: 'Punjab' },
  indore: { lat: 22.7196, lon: 75.8577, city: 'Indore', state: 'Madhya Pradesh' },
  jaipur: { lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  ahmedabad: { lat: 23.0225, lon: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  chennai: { lat: 13.0827, lon: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  lucknow: { lat: 26.8467, lon: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' },
  patna: { lat: 25.5941, lon: 85.1376, city: 'Patna', state: 'Bihar' },
  delhi: { lat: 28.6139, lon: 77.2090, city: 'Delhi NCR', state: 'Delhi' },
};

// Weather advisory generator
const getAgriAdvisories = (temp, humidity, rainProb, windSpeed) => {
  const advisories = [];

  // Spraying Conditions
  if (windSpeed > 15) {
    advisories.push({
      type: 'warning',
      category: 'Pesticide / Foliar Spray',
      text: `High wind speeds (${windSpeed} km/h). Avoid chemical spraying today to prevent chemical drift.`,
    });
  } else if (rainProb > 50) {
    advisories.push({
      type: 'warning',
      category: 'Pesticide / Fertilizer Application',
      text: `Rain probability is high (${rainProb}%). Delay pesticide and urea top-dressing to prevent nutrient runoff.`,
    });
  } else {
    advisories.push({
      type: 'optimal',
      category: 'Spraying Conditions',
      text: 'Ideal calm weather for foliar nutrient sprays and biological pest treatments.',
    });
  }

  // Irrigation Advisory
  if (temp > 35) {
    advisories.push({
      type: 'critical',
      category: 'Heat & Irrigation Alert',
      text: `High temperature (${temp}°C) causing accelerated evapotranspiration. Increase drip irrigation cycles during early mornings or late evenings.`,
    });
  } else if (rainProb < 20 && humidity < 40) {
    advisories.push({
      type: 'info',
      category: 'Soil Moisture',
      text: 'Dry atmospheric condition. Check root-zone moisture levels and schedule light watering.',
    });
  }

  // Pest Risk Advisory
  if (humidity > 75 && temp >= 24 && temp <= 32) {
    advisories.push({
      type: 'danger',
      category: 'Fungal & Bacterial Disease Alert',
      text: `High humidity (${humidity}%) and warm weather (${temp}°C) create prime breeding conditions for Downy Mildew, Rust, and Stem Borers. Inspect undersides of leaves immediately.`,
    });
  }

  return advisories;
};

// @desc    Get real-time weather & 7-day agricultural forecast
// @route   GET /api/weather
// @access  Public
const getWeatherForecast = async (req, res) => {
  try {
    const cityQuery = (req.query.city || 'pune').toLowerCase().trim();
    let lat = Number(req.query.lat);
    let lon = Number(req.query.lon);
    let cityName = req.query.city || 'Pune';
    let regionName = 'Maharashtra';

    if (CITY_COORDINATES[cityQuery]) {
      lat = CITY_COORDINATES[cityQuery].lat;
      lon = CITY_COORDINATES[cityQuery].lon;
      cityName = CITY_COORDINATES[cityQuery].city;
      regionName = CITY_COORDINATES[cityQuery].state;
    } else if (!lat || !lon) {
      // Default to Pune
      lat = 18.5204;
      lon = 73.8567;
      cityName = req.query.city || 'Pune';
    }

    let weatherData = null;

    try {
      // Call Open-Meteo Free Weather API
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;
      
      const response = await axios.get(url, { timeout: 4000 });
      const current = response.data.current;
      const daily = response.data.daily;

      const temp = Math.round(current.temperature_2m);
      const humidity = Math.round(current.relative_humidity_2m);
      const windSpeed = Math.round(current.wind_speed_10m);
      const rainProb = daily.precipitation_probability_max[0] || 15;

      const advisories = getAgriAdvisories(temp, humidity, rainProb, windSpeed);

      // Map daily forecast
      const forecast = daily.time.map((dateStr, idx) => ({
        date: dateStr,
        maxTemp: Math.round(daily.temperature_2m_max[idx]),
        minTemp: Math.round(daily.temperature_2m_min[idx]),
        rainProb: daily.precipitation_probability_max[idx] || 10,
        uvIndex: daily.uv_index_max[idx] || 6,
        windSpeed: Math.round(daily.wind_speed_10m_max[idx]),
        condition: daily.precipitation_probability_max[idx] > 50 ? 'Rainy / Showers' : daily.precipitation_probability_max[idx] > 20 ? 'Partly Cloudy' : 'Sunny / Clear',
      }));

      weatherData = {
        city: cityName,
        state: regionName,
        coordinates: { lat, lon },
        current: {
          temp,
          feelsLike: Math.round(current.apparent_temperature),
          humidity,
          windSpeed,
          rain: current.rain || 0,
          pressure: current.surface_pressure,
          condition: rainProb > 50 ? 'Showers Expected' : humidity > 70 ? 'Humid & Overcast' : 'Clear Sky / Sunny',
        },
        forecast,
        advisories,
        source: 'Live Open-Meteo Engine',
      };
    } catch (apiErr) {
      // Fallback Simulation Engine
      const mockTemp = 28;
      const mockHumidity = 65;
      const mockWind = 9;
      const mockRainProb = 25;
      const advisories = getAgriAdvisories(mockTemp, mockHumidity, mockRainProb, mockWind);

      const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      const forecast = days.map((day, idx) => ({
        date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
        dayName: day,
        maxTemp: 31 + (idx % 3),
        minTemp: 21 + (idx % 2),
        rainProb: [15, 20, 60, 45, 10, 5, 20][idx],
        uvIndex: 7,
        windSpeed: 10 + (idx % 4),
        condition: [15, 20, 60, 45, 10, 5, 20][idx] > 50 ? 'Rainy / Showers' : 'Partly Sunny',
      }));

      weatherData = {
        city: cityName,
        state: regionName,
        coordinates: { lat, lon },
        current: {
          temp: mockTemp,
          feelsLike: mockTemp + 2,
          humidity: mockHumidity,
          windSpeed: mockWind,
          rain: 0,
          pressure: 1012,
          condition: 'Partly Cloudy',
        },
        forecast,
        advisories,
        source: 'Smart Agri Backup Simulation',
      };
    }

    res.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Pest Alerts list
// @route   GET /api/weather/pest-alerts
// @access  Public
const getPestAlerts = async (req, res) => {
  try {
    let query = { isActive: true };

    if (req.query.crop) {
      query.affectedCrops = { $regex: new RegExp(req.query.crop, 'i') };
    }

    if (req.query.riskLevel) {
      query.riskLevel = req.query.riskLevel;
    }

    const alerts = await PestAlert.find(query).sort({ riskLevel: 1, createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new Pest Alert (Admin or Expert)
// @route   POST /api/weather/pest-alerts
// @access  Private (Admin / Expert)
const createPestAlert = async (req, res) => {
  try {
    const alert = await PestAlert.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Pest alert broadcasted',
      data: alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWeatherForecast,
  getPestAlerts,
  createPestAlert,
};
