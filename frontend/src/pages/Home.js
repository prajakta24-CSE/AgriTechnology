import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Home = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const { t } = useLanguage();
  const [quickWeather, setQuickWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get('/weather?city=pune');
        if (res.data.success) {
          setQuickWeather(res.data.data);
        }
      } catch (err) {
        console.error('Weather preview error:', err);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient py-5 py-lg-6 position-relative text-white">
        <div className="container py-lg-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-25 mb-3">
                <span className="pulse-dot"></span>
                <small className="fw-semibold text-white tracking-wide">Next-Gen Agricultural Intelligence &bull; MERN Platform</small>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.15 }}>
                {t('home.heroTitle', 'Empowering Farmers with Smart Agricultural Intelligence')}
              </h1>

              <p className="lead text-white-50 mb-4" style={{ fontSize: '1.15rem' }}>
                {t('home.heroSubtitle', 'All-in-one precision agriculture platform integrating real-time weather alerts, NPK soil diagnostics, pest mitigation advisories, and certified input marketplace.')}
              </p>

              <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-lg btn-agri-gold px-4 py-3 shadow">
                    <i className="bi bi-speedometer2 me-2"></i> {t('home.exploreDashboard', 'Open Farm Dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-lg btn-agri-gold px-4 py-3 shadow">
                      <i className="bi bi-person-plus-fill me-2"></i> Get Started Free
                    </Link>
                    <button
                      className="btn btn-lg btn-outline-light px-4 py-3"
                      onClick={() => demoLogin('farmer')}
                    >
                      <i className="bi bi-play-circle-fill me-2"></i> {t('home.quickDemo', 'Try Farmer Demo')}
                    </button>
                  </>
                )}
                <Link to="/weather-pests" className="btn btn-lg btn-link text-white text-decoration-none">
                  <i className="bi bi-cloud-sun me-1"></i> Live Weather <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              {/* Fast Features Pill */}
              <div className="d-flex flex-wrap gap-3 pt-3 border-top border-white border-opacity-10 text-white-50 small">
                <div><i className="bi bi-check-circle-fill text-warning me-1"></i> Real-time Open-Meteo Radar</div>
                <div><i className="bi bi-check-circle-fill text-warning me-1"></i> NPK Soil Health Scoring</div>
                <div><i className="bi bi-check-circle-fill text-warning me-1"></i> Multilingual Support</div>
              </div>
            </div>

            {/* Quick Live Weather & Health Preview Card */}
            <div className="col-lg-5">
              <div className="agri-card p-4 text-dark bg-white shadow-lg border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill">
                      <i className="bi bi-broadcast me-1"></i> Live Weather Hub
                    </span>
                    <h5 className="mt-2 mb-0 fw-bold">{quickWeather?.city || 'Pune Hub'}, {quickWeather?.state || 'Maharashtra'}</h5>
                  </div>
                  <div className="text-end">
                    <div className="display-6 fw-bold text-success">
                      {quickWeather?.current?.temp ?? 29}&deg;C
                    </div>
                    <small className="text-muted">{quickWeather?.current?.condition || 'Partly Cloudy'}</small>
                  </div>
                </div>

                <div className="row g-2 text-center my-2">
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light border">
                      <small className="text-muted d-block">Humidity</small>
                      <strong className="text-dark">{quickWeather?.current?.humidity ?? 62}%</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light border">
                      <small className="text-muted d-block">Wind Speed</small>
                      <strong className="text-dark">{quickWeather?.current?.windSpeed ?? 11} km/h</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light border">
                      <small className="text-muted d-block">Rain Risk</small>
                      <strong className="text-primary">{quickWeather?.forecast?.[0]?.rainProb ?? 15}%</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 mt-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-shield-check text-success fs-5"></i>
                    <div>
                      <div className="fw-bold text-success small">Foliar Spraying Condition</div>
                      <small className="text-muted">
                        Favorable weather window for organic pesticide and nutrient application today.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="d-grid mt-3">
                  <Link to="/weather-pests" className="btn btn-sm btn-agri-outline">
                    View 7-Day Agricultural Forecast <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Impact Bar */}
      <section className="py-4 bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-card justify-content-center">
                <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="text-start">
                  <h3 className="mb-0 fw-bold text-success">10,500+</h3>
                  <small className="text-muted">{t('home.statFarmers', 'Active Farmers')}</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card justify-content-center">
                <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="text-start">
                  <h3 className="mb-0 fw-bold text-dark">48,200</h3>
                  <small className="text-muted">{t('home.statAcres', 'Acres Monitored')}</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card justify-content-center">
                <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info">
                  <i className="bi bi-flower1"></i>
                </div>
                <div className="text-start">
                  <h3 className="mb-0 fw-bold text-dark">35+</h3>
                  <small className="text-muted">{t('home.statCrops', 'Crops Optimized')}</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card justify-content-center">
                <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-bell-fill"></i>
                </div>
                <div className="text-start">
                  <h3 className="mb-0 fw-bold text-primary">98.4%</h3>
                  <small className="text-muted">Advisory Accuracy</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="py-5 py-lg-6">
        <div className="container">
          <div className="text-center mb-5 max-w-700 mx-auto">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-bold text-uppercase">
              Comprehensive Modules
            </span>
            <h2 className="display-6 fw-bold mt-2">Smart Agricultural Management Architecture</h2>
            <p className="text-muted">
              Built on the robust MERN stack to deliver real-time data insights, lifecycle tracking, and agricultural empowerment.
            </p>
          </div>

          <div className="row g-4">
            {/* 1. Farm & Crop Management */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-success text-white">
                    <i className="bi bi-flower3"></i>
                  </div>
                  <span className="badge badge-soft-success">Lifecycle Tracking</span>
                </div>
                <h5 className="fw-bold">Crop & Land Profiling</h5>
                <p className="text-muted small flex-grow-1">
                  Manage multiple farm plots, record acreage, monitor growth stages (Sowing, Germination, Vegetative, Flowering, Harvesting), and forecast crop yield.
                </p>
                <Link to="/crops" className="btn btn-sm btn-agri-outline mt-3">
                  Explore Crop Tracker <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* 2. Soil Health Intelligence */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-warning text-white">
                    <i className="bi bi-droplet-half"></i>
                  </div>
                  <span className="badge badge-soft-warning">Nutrient Diagnostics</span>
                </div>
                <h5 className="fw-bold">Soil NPK & pH Analyzer</h5>
                <p className="text-muted small flex-grow-1">
                  Input Nitrogen, Phosphorus, Potassium, and pH test parameters to compute the overall Soil Health Score (0-100) and generate tailored organic fertilizer plans.
                </p>
                <Link to="/soil-health" className="btn btn-sm btn-agri-outline mt-3">
                  Run Soil Diagnostic <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* 3. Weather & Pest Alert Engine */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-info text-white">
                    <i className="bi bi-cloud-lightning-rain"></i>
                  </div>
                  <span className="badge badge-soft-info">Live Open-Meteo</span>
                </div>
                <h5 className="fw-bold">Weather Radar & Pest Warning</h5>
                <p className="text-muted small flex-grow-1">
                  7-day hyperlocal agricultural forecast, precipitation probability, humidity triggers, and early alerts for Pink Bollworm, Armyworm, and Blast diseases.
                </p>
                <Link to="/weather-pests" className="btn btn-sm btn-agri-outline mt-3">
                  View Weather Hub <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* 4. Agri Marketplace */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-primary text-white">
                    <i className="bi bi-cart4"></i>
                  </div>
                  <span className="badge badge-soft-info">Verified Catalog</span>
                </div>
                <h5 className="fw-bold">Certified Input Marketplace</h5>
                <p className="text-muted small flex-grow-1">
                  Procure certified high-yield hybrid seeds, neem-coated urea, bio-fungicides, smart IoT sensors, and solar insect traps with live order tracking.
                </p>
                <Link to="/marketplace" className="btn btn-sm btn-agri-outline mt-3">
                  Visit Marketplace <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* 5. Expert Consultation */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-danger text-white">
                    <i className="bi bi-chat-heart"></i>
                  </div>
                  <span className="badge badge-soft-danger">Community Q&A</span>
                </div>
                <h5 className="fw-bold">Agronomist Consultation</h5>
                <p className="text-muted small flex-grow-1">
                  Post crop disease symptoms with photos, receive verified advice from certified agricultural scientists, and collaborate with experienced peer farmers.
                </p>
                <Link to="/forum" className="btn btn-sm btn-agri-outline mt-3">
                  Join Discussion <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* 6. Admin Control Center */}
            <div className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="stat-icon-wrapper bg-dark text-white">
                    <i className="bi bi-shield-shaded"></i>
                  </div>
                  <span className="badge bg-secondary text-white">Role-Based Security</span>
                </div>
                <h5 className="fw-bold">Admin Management Center</h5>
                <p className="text-muted small flex-grow-1">
                  Executive oversight over registered farmers, aggregate crop acreages, order inventory management, and emergency pest alert broadcasting.
                </p>
                <button
                  className="btn btn-sm btn-outline-danger mt-3"
                  onClick={() => demoLogin('admin')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin Demo Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5 bg-success text-white text-center" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #0d381e 100%)' }}>
        <div className="container py-3">
          <h2 className="display-6 fw-bold text-white mb-3">Ready to Transform Your Farm Operations?</h2>
          <p className="lead text-white-50 max-w-700 mx-auto mb-4">
            Join thousands of modern farmers leveraging data-driven agriculture for higher yields, lower pest losses, and sustainable farming.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-lg btn-agri-gold px-4 py-2">
              Create Free Account <i className="bi bi-arrow-right ms-1"></i>
            </Link>
            <button
              className="btn btn-lg btn-outline-light px-4 py-2"
              onClick={() => demoLogin('farmer')}
            >
              Instant Farmer Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
