import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, languages } from '../context/LanguageContext';

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    preferredLanguage: 'en',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Baramati',
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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
        location: {
          state: formData.state,
          district: formData.district,
          village: formData.village,
        },
      };

      const res = await register(payload);
      if (res.success) {
        navigate(formData.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-6">
          <div className="agri-card p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-sm mb-2"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h3 className="fw-bold">{t('nav.register', 'Create Farmer Account')}</h3>
              <p className="text-muted small">Join Agri-Tech to digitize your crop lifecycle and farm operations</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Full Name / Farmer Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control"
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control"
                    placeholder="farmer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Password (Min 6 characters)</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Role Selection</label>
                  <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                    <option value="farmer">🌾 Farmer / Cultivator</option>
                    <option value="expert">🔬 Agronomist / Expert</option>
                    <option value="admin">🛡️ System Administrator</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">District / City</label>
                  <input
                    type="text"
                    name="district"
                    className="form-control"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Village / Taluka</label>
                  <input
                    type="text"
                    name="village"
                    className="form-control"
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    className="form-select"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.native} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="d-grid my-4">
                <button type="submit" className="btn btn-agri py-2" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : (
                    <i className="bi bi-person-check-fill me-2"></i>
                  )}
                  Register Account
                </button>
              </div>
            </form>

            <div className="text-center text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="text-success fw-bold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
