import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, languages } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { currentLang, changeLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-agri sticky-top py-2">
      <div className="container-fluid px-lg-4">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-sm"
            style={{ width: '42px', height: '42px' }}
          >
            <i className="bi bi-tree-fill fs-5"></i>
          </div>
          <div>
            <div className="navbar-brand-title lh-1">{t('appName', 'Agri-Tech')}</div>
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
              Smart Farming Ecosystem
            </small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-expanded={navOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/" onClick={() => setNavOpen(false)}>
                <i className="bi bi-house-door"></i> {t('nav.home', 'Home')}
              </NavLink>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/dashboard" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-speedometer2"></i> {t('nav.dashboard', 'Dashboard')}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/farms" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-geo-alt"></i> {t('nav.farms', 'Farms')}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/crops" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-flower1"></i> {t('nav.crops', 'Crops')}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/soil-health" onClick={() => setNavOpen(false)}>
                    <i className="bi bi-droplet-half"></i> {t('nav.soilHealth', 'Soil Health')}
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/weather-pests" onClick={() => setNavOpen(false)}>
                <i className="bi bi-cloud-sun"></i> {t('nav.weather', 'Weather & Pests')}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/marketplace" onClick={() => setNavOpen(false)}>
                <i className="bi bi-shop"></i> {t('nav.marketplace', 'Marketplace')}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`} to="/forum" onClick={() => setNavOpen(false)}>
                <i className="bi bi-chat-square-text"></i> {t('nav.forum', 'Community')}
              </NavLink>
            </li>

            {isAuthenticated && isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link-custom text-danger fw-bold ${isActive ? 'active' : ''}`} to="/admin" onClick={() => setNavOpen(false)}>
                  <i className="bi bi-shield-lock-fill text-danger"></i> {t('nav.admin', 'Admin')}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Items */}
          <div className="d-flex align-items-center gap-2 flex-wrap mt-2 mt-lg-0">
            {/* Language Switcher */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 rounded-pill px-3 py-1 bg-white"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-translate text-success"></i>
                <span className="text-uppercase fw-semibold">{currentLang}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`dropdown-item d-flex justify-content-between align-items-center py-2 ${
                        currentLang === lang.code ? 'active bg-success text-white' : ''
                      }`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      <span>{lang.native}</span>
                      <small className="opacity-75">({lang.name})</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketplace Cart Button */}
            <Link to="/cart" className="btn btn-sm btn-light border position-relative rounded-pill px-3 py-1 shadow-sm d-flex align-items-center gap-1">
              <i className="bi bi-cart3 text-success fs-6"></i>
              <span className="d-none d-sm-inline fw-semibold text-muted">Cart</span>
              {cartCount > 0 && (
                <span className="badge bg-danger rounded-pill px-2 py-1 ms-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated ? (
              <div className="dropdown ms-1">
                <button
                  className="btn btn-sm btn-agri-outline dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                  />
                  <span className="fw-semibold text-truncate" style={{ maxWidth: '110px' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className={`badge ${isAdmin ? 'bg-danger' : 'bg-success'} text-white text-uppercase`} style={{ fontSize: '0.6rem' }}>
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom mb-1">
                    <div className="fw-bold text-dark">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-2 py-2" to="/dashboard">
                      <i className="bi bi-speedometer2 me-2 text-success"></i> Farm Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-2 py-2" to="/orders">
                      <i className="bi bi-box-seam me-2 text-primary"></i> {t('nav.orders', 'My Orders')}
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item rounded-2 py-2 text-danger fw-semibold" to="/admin">
                        <i className="bi bi-shield-lock-fill me-2"></i> Admin Control Center
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button className="dropdown-item rounded-2 py-2 text-danger d-flex align-items-center" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> {t('nav.logout', 'Sign Out')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-agri-outline rounded-pill px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> {t('nav.login', 'Login')}
                </Link>
                <Link to="/register" className="btn btn-sm btn-agri rounded-pill px-3">
                  <i className="bi bi-person-plus me-1"></i> {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
