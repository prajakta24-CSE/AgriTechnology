import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Farms = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    totalArea: '',
    soilType: 'Black Soil',
    irrigationType: 'Drip Irrigation',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms');
      if (res.data.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleOpenAdd = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      totalArea: '',
      soilType: 'Black Soil',
      irrigationType: 'Drip Irrigation',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      latitude: 18.5204,
      longitude: 73.8567,
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      totalArea: farm.totalArea,
      soilType: farm.soilType,
      irrigationType: farm.irrigationType,
      city: farm.location?.city || 'Pune',
      state: farm.location?.state || 'Maharashtra',
      country: farm.location?.country || 'India',
      latitude: farm.location?.latitude || 18.5204,
      longitude: farm.location?.longitude || 73.8567,
      notes: farm.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farm plot? Associated crops and soil records will be removed.')) {
      try {
        await api.delete(`/farms/${id}`);
        fetchFarms();
        setMessage('Farm deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        alert('Failed to delete farm');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        totalArea: Number(formData.totalArea),
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        notes: formData.notes,
      };

      if (editingFarm) {
        await api.put(`/farms/${editingFarm._id}`, payload);
        setMessage('Farm updated successfully!');
      } else {
        await api.post('/farms', payload);
        setMessage('Farm created successfully!');
      }

      setShowModal(false);
      fetchFarms();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Error saving farm');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAcres = farms.reduce((sum, f) => sum + (f.totalArea || 0), 0);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('farms.title', 'Farm Profile Setup & Land Management')}</h2>
          <p className="text-muted small mb-0">
            {t('farms.subtitle', 'Manage geographic plots, soil profiles, and irrigation systems.')} &bull; Total Holding: <strong>{totalAcres} Acres</strong>
          </p>
        </div>
        <button className="btn btn-agri" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle-fill me-1"></i> {t('farms.addNew', 'Add New Farm Plot')}
        </button>
      </div>

      {message && (
        <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <i className="bi bi-geo-alt text-success fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold">No Farm Plots Registered</h4>
          <p className="text-muted small max-w-500 mx-auto mb-4">
            Begin by adding your agricultural land details including acreage, soil type, and irrigation system to unlock personalized crop and fertilizer recommendations.
          </p>
          <button className="btn btn-agri" onClick={handleOpenAdd}>
            <i className="bi bi-plus-lg me-1"></i> Register Your First Farm Plot
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {farms.map((farm) => (
            <div key={farm._id} className="col-md-6 col-lg-4">
              <div className="agri-card h-100 p-4 bg-white d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success">
                    <i className="bi bi-tree-fill"></i>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light border-0 shadow-none" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2">
                      <li>
                        <button className="dropdown-item small" onClick={() => handleOpenEdit(farm)}>
                          <i className="bi bi-pencil me-2 text-primary"></i> Edit Plot Details
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item small text-danger" onClick={() => handleDelete(farm._id)}>
                          <i className="bi bi-trash me-2"></i> Delete Plot
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-bold text-dark mb-1">{farm.name}</h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {farm.location?.city}, {farm.location?.state}
                </p>

                <div className="p-3 rounded-3 bg-light border mb-3 flex-grow-1">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Total Acreage:</span>
                    <strong className="text-success">{farm.totalArea} Acres</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Soil Type:</span>
                    <span className="badge bg-secondary">{farm.soilType}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Irrigation:</span>
                    <span className="badge bg-info text-dark">{farm.irrigationType}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Active Crops:</span>
                    <strong className="text-dark">{farm.activeCropsCount || 0} Registered</strong>
                  </div>
                </div>

                {farm.notes && (
                  <p className="small text-muted fst-italic mb-3">
                    "{farm.notes}"
                  </p>
                )}

                <div className="d-flex gap-2 mt-auto">
                  <button className="btn btn-sm btn-agri-outline flex-fill" onClick={() => handleOpenEdit(farm)}>
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(farm._id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  {editingFarm ? 'Update Farm Plot Details' : 'Register New Farm Plot'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Farm / Plot Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Green Valley Organic Plot"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Total Area (in Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        min="0.1"
                        className="form-control"
                        placeholder="e.g. 5.5"
                        value={formData.totalArea}
                        onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Soil Classification</label>
                      <select
                        className="form-select"
                        value={formData.soilType}
                        onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      >
                        <option value="Black Soil">Black Soil (Regur)</option>
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Red Soil">Red Soil</option>
                        <option value="Clayey Soil">Clayey Soil</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Primary Irrigation Type</label>
                      <select
                        className="form-select"
                        value={formData.irrigationType}
                        onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                      >
                        <option value="Drip Irrigation">Drip Irrigation (Micro-drip)</option>
                        <option value="Sprinkler">Sprinkler System</option>
                        <option value="Canal / Flood">Canal / Flood Irrigation</option>
                        <option value="Tube Well">Tube Well / Borewell</option>
                        <option value="Rainfed">Rainfed / Dryland</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">City / District</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Plot Description / Crop History</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Solar pump installed, organic compost applied last season..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri" disabled={submitting}>
                    {submitting ? 'Saving...' : editingFarm ? 'Save Changes' : 'Register Farm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;
