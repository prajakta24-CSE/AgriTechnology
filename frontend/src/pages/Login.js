import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const res = await demoLogin(role);
      if (res.success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError('Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="agri-card p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-sm mb-2"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-shield-lock-fill fs-3"></i>
              </div>
              <h3 className="fw-bold">{t('nav.login', 'Sign In to Agri-Tech')}</h3>
              <p className="text-muted small">Access your farm metrics, soil analysis, and marketplace</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Evaluation Buttons */}
            <div className="p-3 mb-4 rounded-3 bg-light border text-center">
              <small className="text-muted fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                🚀 Quick 1-Click Evaluation Logins
              </small>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success flex-fill fw-semibold py-2"
                  onClick={() => handleQuickDemo('farmer')}
                  disabled={loading}
                >
                  <i className="bi bi-person-fill me-1"></i> Farmer Demo
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger flex-fill fw-semibold py-2"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={loading}
                >
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin Demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control border-start-0 ps-0"
                    placeholder="farmer@agritech.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    className="form-control border-start-0 ps-0"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-agri py-2" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                  )}
                  Sign In
                </button>
              </div>
            </form>

            <div className="text-center text-muted small mt-3">
              Don't have an account?{' '}
              <Link to="/register" className="text-success fw-bold text-decoration-none">
                Register New Farm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
