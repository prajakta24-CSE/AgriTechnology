import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-success border-opacity-25" style={{ background: '#0a1e11' }}>
      <div className="container">
        <div className="row g-4">
          {/* Brand & Mission */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-sm"
                style={{ width: '38px', height: '38px' }}
              >
                <i className="bi bi-tree-fill"></i>
              </div>
              <span className="brand-font fs-4 text-white">{t('appName', 'Agri-Tech')}</span>
            </div>
            <p className="text-white-50 small mb-3">
              A comprehensive MERN-based smart farming and precision agriculture management platform. Empowering farmers with real-time weather alerts, NPK soil diagnostics, pest prevention, and a certified direct marketplace.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-2 py-1">
                <i className="bi bi-shield-check me-1"></i> MERN Stack Architecture
              </span>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-2 py-1">
                <i className="bi bi-translate me-1"></i> 5 Languages Supported
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold text-success mb-3">Navigation</h6>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li><Link to="/" className="text-white-50 text-decoration-none hover-white">Home Page</Link></li>
              <li><Link to="/dashboard" className="text-white-50 text-decoration-none hover-white">Farm Dashboard</Link></li>
              <li><Link to="/crops" className="text-white-50 text-decoration-none hover-white">Crop Monitoring</Link></li>
              <li><Link to="/soil-health" className="text-white-50 text-decoration-none hover-white">Soil NPK Analyzer</Link></li>
              <li><Link to="/weather-pests" className="text-white-50 text-decoration-none hover-white">Weather & Pest Radar</Link></li>
              <li><Link to="/marketplace" className="text-white-50 text-decoration-none hover-white">Agri Marketplace</Link></li>
            </ul>
          </div>

          {/* Kisan Help & Resources */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-success mb-3">Farmer Helpline</h6>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-success"></i>
                <span>Toll-Free Kisan Call Center: <strong>1800-180-1551</strong></span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-whatsapp text-success"></i>
                <span>WhatsApp Advisory: <strong>+91 98765 43210</strong></span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-cloud-sun-fill text-warning"></i>
                <span>Open-Meteo Meteorological Radar</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-award-fill text-info"></i>
                <span>ICAR & Agronomy Standard Certified</span>
              </li>
            </ul>
          </div>

          {/* Project & Mentor Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold text-success mb-3">Academic & Mentor Info</h6>
            <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-secondary border-opacity-25 small">
              <div className="text-warning fw-semibold mb-1">
                <i className="bi bi-person-badge me-1"></i> Project Mentor:
              </div>
              <div className="text-white fw-bold">Syed Abul Arshad</div>
              <div className="text-white-50 text-truncate" style={{ fontSize: '0.8rem' }}>
                arshad+mentor@thesmartbridge.com
              </div>
              <div className="mt-2 pt-2 border-top border-white border-opacity-10 text-white-50" style={{ fontSize: '0.75rem' }}>
                Total Epics: 6 &bull; Subtasks: 19 &bull; Ready for Evaluation
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-top border-white border-opacity-10 text-center text-white-50 small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Agri-Tech Smart Farming Management System. Built with MERN Stack for Smart Farming & Digital Rural Transformation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
