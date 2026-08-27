import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [soilReports, setSoilReports] = useState([]);
  const [weather, setWeather] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [farmsRes, cropsRes, soilRes, weatherRes, pestRes, ordersRes] = await Promise.all([
          api.get('/farms'),
          api.get('/crops'),
          api.get('/soil'),
          api.get(`/weather?city=${user?.location?.district || 'pune'}`),
          api.get('/weather/pest-alerts'),
          api.get('/orders/myorders'),
        ]);

        if (farmsRes.data.success) setFarms(farmsRes.data.data);
        if (cropsRes.data.success) setCrops(cropsRes.data.data);
        if (soilRes.data.success) setSoilReports(soilRes.data.data);
        if (weatherRes.data.success) setWeather(weatherRes.data.data);
        if (pestRes.data.success) setPestAlerts(pestRes.data.data);
        if (ordersRes.data.success) setOrders(ordersRes.data.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const totalAcreage = farms.reduce((sum, f) => sum + (f.totalArea || 0), 0);
  const latestSoilScore = soilReports.length > 0 ? soilReports[0].overallHealthScore : 85;

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Sowing': return 'bg-secondary';
      case 'Germination': return 'bg-info text-dark';
      case 'Vegetative': return 'bg-primary';
      case 'Flowering': return 'bg-warning text-dark';
      case 'Harvesting': return 'bg-success';
      default: return 'bg-success';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted fw-semibold">Loading farm operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Top Banner & Welcome */}
      <div className="agri-card p-4 mb-4 bg-white border-0 shadow-sm">
        <div className="row align-items-center g-3">
          <div className="col-md-7">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="pulse-dot"></span>
              <span className="badge bg-success bg-opacity-10 text-success fw-bold">Live Farm Command</span>
            </div>
            <h2 className="fw-bold mb-1">
              {t('dashboard.welcome', 'Welcome back,')} {user?.name}!
            </h2>
            <p className="text-muted small mb-0">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {user?.location?.village || 'Baramati'}, {user?.location?.district || 'Pune'}, {user?.location?.state || 'Maharashtra'} &bull; {totalAcreage} Total Acres Registered
            </p>
          </div>
          <div className="col-md-5 text-md-end">
            <div className="d-flex justify-content-md-end gap-2 flex-wrap">
              <Link to="/crops" className="btn btn-sm btn-agri">
                <i className="bi bi-plus-circle me-1"></i> Register Crop
              </Link>
              <Link to="/soil-health" className="btn btn-sm btn-agri-gold">
                <i className="bi bi-droplet-half me-1"></i> Analyze Soil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.activeFarms', 'Total Farms')}</small>
                <h3 className="fw-bold my-1 text-success">{farms.length}</h3>
                <small className="text-muted">{totalAcreage} Acres</small>
              </div>
              <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success">
                <i className="bi bi-geo-alt"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.activeCrops', 'Active Crops')}</small>
                <h3 className="fw-bold my-1 text-primary">{crops.length}</h3>
                <small className="text-muted">In Lifecycle</small>
              </div>
              <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-flower2"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.soilQuality', 'Soil Health')}</small>
                <h3 className="fw-bold my-1 text-warning">{latestSoilScore}/100</h3>
                <small className="text-success fw-semibold">
                  <i className="bi bi-check2"></i> High Fertility
                </small>
              </div>
              <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning">
                <i className="bi bi-moisture"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="agri-card p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted fw-semibold">{t('dashboard.pendingOrders', 'Active Orders')}</small>
                <h3 className="fw-bold my-1 text-dark">{orders.length}</h3>
                <small className="text-muted">Supplies In Transit</small>
              </div>
              <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Active Crops & Farm Progress */}
        <div className="col-lg-8">
          {/* Active Crops Widget */}
          <div className="agri-card p-4 mb-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">Active Crops & Growth Milestones</h5>
                <small className="text-muted">Tracking vegetative timeline and harvest forecast</small>
              </div>
              <Link to="/crops" className="btn btn-sm btn-agri-outline">
                View All Crops <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {crops.length === 0 ? (
              <div className="text-center py-4 bg-light rounded-3">
                <i className="bi bi-flower3 text-muted fs-1 d-block mb-2"></i>
                <p className="text-muted mb-2">No crops registered yet.</p>
                <Link to="/crops" className="btn btn-sm btn-agri">
                  Register Your First Crop
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {crops.map((crop) => (
                  <div key={crop._id} className="p-3 rounded-3 border bg-light bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">
                          {crop.cropName} <span className="text-muted fw-normal">({crop.variety})</span>
                        </h6>
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i> {crop.farm?.name || 'Main Farm'} &bull; {crop.areaPlanted} Acres
                        </small>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <span className={`badge ${getStageBadge(crop.stage)} px-2 py-1`}>
                          {crop.stage}
                        </span>
                        <span className="badge bg-success bg-opacity-25 text-success border border-success px-2 py-1">
                          {crop.healthStatus}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar through 5 stages */}
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width:
                            crop.stage === 'Sowing' ? '20%' :
                            crop.stage === 'Germination' ? '40%' :
                            crop.stage === 'Vegetative' ? '60%' :
                            crop.stage === 'Flowering' ? '80%' : '100%',
                        }}
                      ></div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2 small text-muted">
                      <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                      <span>Target Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Pest Warnings Alert Banner */}
          {pestAlerts.length > 0 && (
            <div className="agri-card p-4 bg-white border-start border-danger border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold text-danger mb-0">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  Active Pest Early Warning
                </h5>
                <Link to="/weather-pests" className="btn btn-sm btn-outline-danger">
                  Prevention Guide <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <p className="text-dark small mb-2">
                <strong>{pestAlerts[0].title}</strong> &bull; Affecting: {pestAlerts[0].affectedCrops.join(', ')}
              </p>
              <div className="p-2 rounded bg-light small text-muted">
                <strong>Organic Control:</strong> {pestAlerts[0].organicRemedy}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Hyperlocal Weather & Soil Health Score */}
        <div className="col-lg-4">
          {/* Weather Widget */}
          <div className="agri-card p-4 mb-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-uppercase text-muted mb-0" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Hyperlocal Weather
              </h6>
              <span className="badge bg-success bg-opacity-10 text-success">Live Radar</span>
            </div>

            <div className="text-center my-3">
              <div className="display-4 fw-bold text-dark">{weather?.current?.temp ?? 29}&deg;C</div>
              <div className="fw-semibold text-success">{weather?.current?.condition || 'Clear & Sunny'}</div>
              <small className="text-muted">{weather?.city || 'Pune Hub'}, {weather?.state || 'Maharashtra'}</small>
            </div>

            <div className="row g-2 text-center small mb-3">
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <span className="text-muted d-block">Humidity</span>
                  <strong>{weather?.current?.humidity ?? 60}%</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded bg-light border">
                  <span className="text-muted d-block">Wind Speed</span>
                  <strong>{weather?.current?.windSpeed ?? 12} km/h</strong>
                </div>
              </div>
            </div>

            <div className="d-grid">
              <Link to="/weather-pests" className="btn btn-sm btn-agri-outline">
                Check 7-Day Rain Forecast
              </Link>
            </div>
          </div>

          {/* Soil Diagnostic Snapshot */}
          <div className="agri-card p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-uppercase text-muted mb-0" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Soil Fertility Card
              </h6>
              <span className="badge bg-warning text-dark">NPK Analysis</span>
            </div>

            <div className="p-3 rounded-3 bg-light text-center mb-3">
              <span className="text-muted small d-block">Overall Soil Health Score</span>
              <div className="display-6 fw-bold text-success my-1">{latestSoilScore}/100</div>
              <small className="text-success fw-semibold">
                <i className="bi bi-shield-check"></i> Balanced Organic Profile
              </small>
            </div>

            <div className="d-grid">
              <Link to="/soil-health" className="btn btn-sm btn-agri-gold">
                Open Full Soil Lab & NPK Radar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
