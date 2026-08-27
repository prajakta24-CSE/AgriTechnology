import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const STAGES = ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Harvesting', 'Completed'];

const Crops = () => {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  const [formData, setFormData] = useState({
    farm: '',
    cropName: '',
    variety: 'High Yield Hybrid',
    season: 'Kharif (Monsoon)',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    stage: 'Sowing',
    areaPlanted: '',
    expectedYield: '',
  });

  const [logActivity, setLogActivity] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchData = async () => {
    try {
      const [cropsRes, farmsRes] = await Promise.all([
        api.get('/crops'),
        api.get('/farms'),
      ]);
      if (cropsRes.data.success) setCrops(cropsRes.data.data);
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.data);
        if (farmsRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, farm: farmsRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching crops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdvanceStage = async (crop) => {
    const currentIdx = STAGES.indexOf(crop.stage);
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1];
      try {
        const res = await api.put(`/crops/${crop._id}`, { stage: nextStage });
        if (res.data.success) {
          if (nextStage === 'Harvesting' || nextStage === 'Completed') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
          setToastMsg(`Crop advanced to ${nextStage} stage! 🌾`);
          fetchData();
          setTimeout(() => setToastMsg(''), 3500);
        }
      } catch (err) {
        alert('Error updating crop stage');
      }
    }
  };

  const handleHealthChange = async (cropId, healthStatus) => {
    try {
      await api.put(`/crops/${cropId}`, { healthStatus });
      setToastMsg('Crop health status updated!');
      fetchData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Error updating health status');
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/crops', {
        ...formData,
        areaPlanted: Number(formData.areaPlanted),
        expectedYield: Number(formData.expectedYield || 0),
      });
      setShowAddModal(false);
      setToastMsg('New crop registered successfully!');
      fetchData();
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err) {
      alert('Error creating crop');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!selectedCrop || !logActivity) return;

    setSubmitting(true);
    try {
      await api.post(`/crops/${selectedCrop._id}/logs`, {
        activity: logActivity,
        notes: logNotes,
      });
      setShowLogModal(false);
      setLogActivity('');
      setLogNotes('');
      setToastMsg('Farm activity logged successfully!');
      fetchData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Error adding log');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm('Delete this crop record?')) {
      try {
        await api.delete(`/crops/${id}`);
        fetchData();
        setToastMsg('Crop deleted');
        setTimeout(() => setToastMsg(''), 3000);
      } catch (err) {
        alert('Failed to delete crop');
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('crops.title', 'Crop Lifecycle Management')}</h2>
          <p className="text-muted small mb-0">
            {t('crops.subtitle', 'Track vegetative progress from seed sowing to harvest yield estimation.')}
          </p>
        </div>
        <button className="btn btn-agri" onClick={() => setShowAddModal(true)} disabled={farms.length === 0}>
          <i className="bi bi-plus-circle-fill me-1"></i> {t('crops.registerCrop', 'Register New Crop')}
        </button>
      </div>

      {toastMsg && (
        <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {farms.length === 0 && (
        <div className="alert alert-warning py-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Please register at least one <strong>Farm Plot</strong> in the Farms tab before registering crops.
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : crops.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <i className="bi bi-flower1 text-success fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold">No Crops Registered</h4>
          <p className="text-muted small max-w-500 mx-auto mb-4">
            Start tracking your active crops through germination, vegetative growth, flowering, and harvest milestones.
          </p>
          <button className="btn btn-agri" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Register Crop
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {crops.map((crop) => {
            const currentStageIndex = STAGES.indexOf(crop.stage);
            return (
              <div key={crop._id} className="col-lg-6">
                <div className="agri-card p-4 bg-white h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-success bg-opacity-10 text-success fw-semibold mb-1">
                        {crop.season}
                      </span>
                      <h4 className="fw-bold text-dark mb-0">
                        {crop.cropName} <small className="text-muted fs-6 font-monospace">({crop.variety})</small>
                      </h4>
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i> {crop.farm?.name || 'Main Farm'} &bull; {crop.areaPlanted} Acres
                      </small>
                    </div>

                    <div className="text-end">
                      <select
                        className="form-select form-select-sm border-success text-success fw-bold"
                        value={crop.healthStatus}
                        onChange={(e) => handleHealthChange(crop._id, e.target.value)}
                        style={{ width: 'auto' }}
                      >
                        <option value="Optimal">🟢 Optimal</option>
                        <option value="Good">🟢 Good</option>
                        <option value="Moderate Attention">🟡 Attention</option>
                        <option value="Pest Risk">🔴 Pest Risk</option>
                        <option value="Diseased">🔴 Diseased</option>
                      </select>
                    </div>
                  </div>

                  {/* Growth Stages Interactive Stepper */}
                  <div className="my-3 py-2 px-1 rounded-3 bg-light border">
                    <small className="text-muted fw-semibold d-block text-center mb-2" style={{ fontSize: '0.75rem' }}>
                      CROP GROWTH LIFECYCLE STEPPER
                    </small>
                    <div className="d-flex justify-content-between position-relative px-2">
                      {STAGES.slice(0, 5).map((stg, idx) => {
                        const isCompleted = currentStageIndex > idx;
                        const isCurrent = currentStageIndex === idx;
                        return (
                          <div
                            key={stg}
                            className={`stage-timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                          >
                            <div className="stage-circle">
                              {isCompleted ? <i className="bi bi-check2"></i> : idx + 1}
                            </div>
                            <small
                              className={`mt-1 text-center fw-semibold ${
                                isCurrent ? 'text-success fw-bold' : isCompleted ? 'text-dark' : 'text-muted'
                              }`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {stg}
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="row g-2 text-center my-2 small">
                    <div className="col-4">
                      <div className="p-2 rounded bg-light border">
                        <span className="text-muted d-block">Planted</span>
                        <strong>{new Date(crop.plantingDate).toLocaleDateString()}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 rounded bg-light border">
                        <span className="text-muted d-block">Est. Harvest</span>
                        <strong>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2 rounded bg-light border">
                        <span className="text-muted d-block">Exp. Yield</span>
                        <strong className="text-success">{crop.expectedYield || 20} Qtl</strong>
                      </div>
                    </div>
                  </div>

                  {/* Activity Logs Accordion / Preview */}
                  {crop.logs && crop.logs.length > 0 && (
                    <div className="p-3 my-2 rounded-3 bg-light border small flex-grow-1">
                      <div className="fw-bold text-muted mb-2 d-flex justify-content-between">
                        <span>Recent Activity Logs ({crop.logs.length}):</span>
                        <span className="text-success">Latest Log</span>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-clock-history text-success mt-1"></i>
                        <div>
                          <div className="fw-semibold text-dark">{crop.logs[0].activity}</div>
                          <small className="text-muted">{new Date(crop.logs[0].date).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    {currentStageIndex < STAGES.length - 1 && (
                      <button
                        className="btn btn-sm btn-agri flex-fill"
                        onClick={() => handleAdvanceStage(crop)}
                      >
                        <i className="bi bi-arrow-right-circle me-1"></i> Advance to {STAGES[currentStageIndex + 1]}
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-agri-outline"
                      onClick={() => {
                        setSelectedCrop(crop);
                        setShowLogModal(true);
                      }}
                    >
                      <i className="bi bi-journal-plus me-1"></i> Log Activity
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteCrop(crop._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-flower1 me-2"></i> Register New Crop
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddCrop}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Select Farm Plot</label>
                      <select
                        required
                        className="form-select"
                        value={formData.farm}
                        onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
                      >
                        {farms.map((f) => (
                          <option key={f._id} value={f._id}>
                            {f.name} ({f.totalArea} Acres, {f.soilType})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Crop Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Cotton, Soybean, Wheat, Rice"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Variety / Hybrid</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Bollgard II, Pusa Basmati, JS-335"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Cultivation Season</label>
                      <select
                        className="form-select"
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      >
                        <option value="Kharif (Monsoon)">Kharif (Monsoon Season)</option>
                        <option value="Rabi (Winter)">Rabi (Winter Season)</option>
                        <option value="Zaid (Summer)">Zaid (Summer Season)</option>
                        <option value="Perennial">Perennial / Year-Round</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Planted Area (Acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        min="0.1"
                        className="form-control"
                        placeholder="e.g. 4.0"
                        value={formData.areaPlanted}
                        onChange={(e) => setFormData({ ...formData, areaPlanted: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Sowing / Planting Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={formData.plantingDate}
                        onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Expected Harvest Date</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={formData.expectedHarvestDate}
                        onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Starting Growth Stage</label>
                      <select
                        className="form-select"
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Expected Yield (Quintals / Tonnes)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-control"
                        placeholder="e.g. 25"
                        value={formData.expectedYield}
                        onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri" disabled={submitting}>
                    {submitting ? 'Registering...' : 'Register Crop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-journal-plus me-2"></i>
                  Log Farm Activity: {selectedCrop?.cropName}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowLogModal(false)}></button>
              </div>
              <form onSubmit={handleAddLog}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Activity Description</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Applied Bio-NPK fertilizer (20kg/acre), Drip irrigation 4hrs"
                      value={logActivity}
                      onChange={(e) => setLogActivity(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Additional Observations</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Foliage healthy, no signs of sucking pests..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLogModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri" disabled={submitting}>
                    {submitting ? 'Logging...' : 'Save Activity Log'}
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

export default Crops;
