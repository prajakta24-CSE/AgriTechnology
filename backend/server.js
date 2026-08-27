const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const cropRoutes = require('./routes/cropRoutes');
const soilRoutes = require('./routes/soilRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const forumRoutes = require('./routes/forumRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Agri-Tech Smart Farming API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mentor: 'Syed Abul Arshad (arshad+mentor@thesmartbridge.com)',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌾 Agri-Tech Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Error: ${err.message}`);
});
