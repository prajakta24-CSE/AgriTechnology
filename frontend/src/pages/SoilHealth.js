import React, { useState, useEffect } from 'react';
import SoilRadarChart from '../components/SoilRadarChart';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const SoilHealth = () => {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [reports, setReports] = useState([]);

  // Live Diagnostic Input State
  const [selectedFarm, setSelectedFarm] = useState('');
  const [sampleName, setSampleName] = useState('Central Plot Topsoil Test');
  const [nitrogen, setNitrogen] = useState(280);
  const [phosphorus, setPhosphorus] = useState(32);
  const [potassium, setPotassium] = useState(210);
  const [pH, setPH] = useState(6.8);
  const [moisture, setMoisture] = useState(48);
  const [organicMatter, setOrganicMatter] = useState(1.8);

  const [liveAdvisory, setLiveAdvisory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [farmsRes, soilRes] = await Promise.all([api.get('/farms'), api.get('/soil')]);
      if (farmsRes.data.success) {
        setFarms(farmsRes.data.data);
        if (farmsRes.data.data.length > 0) {
          setSelectedFarm(farmsRes.data.data[0]._id);
        }
      }
      if (soilRes.data.success) setReports(soilRes.data.data);
    } catch (err) {
      console.error('Error fetching soil data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate advisory live whenever sliders move
  useEffect(() => {
    const simulateAdvisory = async () => {
      try {
        const res = await api.post('/soil/simulate', {
          nitrogen,
          phosphorus,
          potassium,
          pH,
          moisture,
          organicMatter,
        });
        if (res.data.success) {
          setLiveAdvisory(res.data.data);
        }
      } catch (err) {
        console.error('Simulation error:', err);
      }
    };
    simulateAdvisory();
  }, [nitrogen, phosphorus, potassium, pH, moisture, organicMatter]);

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!selectedFarm) {
      alert('Please select a farm to link this report to.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/soil', {
        farm: selectedFarm,
        sampleName,
        nitrogen,
        phosphorus,
        potassium,
        pH,
        moisture,
        organicMatter,
      });
      setToastMsg('Soil health analysis saved to farm records! 🧪');
      fetchData();
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err) {
      alert('Error saving soil report');
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('soil.title', 'Soil Health Intelligence & Nutrient Diagnostics')}</h2>
          <p className="text-muted small mb-0">
            {t('soil.subtitle', 'Calculate NPK balance, pH suitability score, and generate custom fertilizer plans.')}
          </p>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
          <i className="bi bi-cpu-fill me-1"></i> Smart Algorithmic Soil Lab
        </span>
      </div>

      {toastMsg && (
        <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Interactive Lab Grid */}
      <div className="row g-4 mb-5">
        {/* Left Column: Interactive Nutrient Sliders */}
        <div className="col-lg-6">
          <div className="agri-card p-4 bg-white h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-sliders text-success"></i>
              Interactive Nutrient & Soil Parameter Sliders
            </h5>
            <p className="text-muted small mb-4">
              Adjust soil lab values or enter testing metrics to observe real-time health score updates and custom fertilizer requirements.
            </p>

            <form onSubmit={handleSaveReport}>
              {/* Farm Selector */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Target Farm Plot</label>
                <select
                  className="form-select"
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  required
                >
                  {farms.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.soilType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sample Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Sample / Zone Reference</label>
                <input
                  type="text"
                  className="form-control"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  placeholder="e.g. North Plot Topsoil 0-15cm"
                />
              </div>

              {/* Nitrogen (N) */}
              <div className="mb-3 p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0 fw-bold small text-dark">
                    {t('soil.nitrogen', 'Nitrogen (N)')} <small className="text-muted fw-normal">(Target: 280-450 kg/ha)</small>
                  </label>
                  <span className="badge bg-success">{nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="100"
                  max="600"
                  step="5"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                />
              </div>

              {/* Phosphorus (P) */}
              <div className="mb-3 p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0 fw-bold small text-dark">
                    {t('soil.phosphorus', 'Phosphorus (P)')} <small className="text-muted fw-normal">(Target: 25-60 kg/ha)</small>
                  </label>
                  <span className="badge bg-primary">{phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="5"
                  max="100"
                  step="1"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                />
              </div>

              {/* Potassium (K) */}
              <div className="mb-3 p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0 fw-bold small text-dark">
                    {t('soil.potassium', 'Potassium (K)')} <small className="text-muted fw-normal">(Target: 150-300 kg/ha)</small>
                  </label>
                  <span className="badge bg-warning text-dark">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="50"
                  max="400"
                  step="5"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                />
              </div>

              {/* pH Level */}
              <div className="mb-3 p-3 rounded-3 bg-light border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label mb-0 fw-bold small text-dark">
                    {t('soil.ph', 'Soil pH Level')} <small className="text-muted fw-normal">(Ideal: 6.2 - 7.5)</small>
                  </label>
                  <span className="badge bg-dark">{pH} pH</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="4.5"
                  max="9.5"
                  step="0.1"
                  value={pH}
                  onChange={(e) => setPH(Number(e.target.value))}
                />
              </div>

              {/* Moisture & Organic Matter */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div className="p-2 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold">Moisture %</small>
                      <small className="fw-bold text-info">{moisture}%</small>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="10"
                      max="90"
                      step="1"
                      value={moisture}
                      onChange={(e) => setMoisture(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 rounded-3 bg-light border">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-bold">Organic Carbon %</small>
                      <small className="fw-bold text-success">{organicMatter}%</small>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="0.2"
                      max="4.0"
                      step="0.1"
                      value={organicMatter}
                      onChange={(e) => setOrganicMatter(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-agri py-2" disabled={saving || farms.length === 0}>
                  {saving ? 'Saving...' : 'Save & Store Soil Diagnostic Record'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Real-time Radar Chart & Smart Recommendations */}
        <div className="col-lg-6">
          <div className="agri-card p-4 bg-white h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0">Nutrient Radar Visualizer</h5>
              <div className="text-end">
                <span className="small text-muted d-block">{t('soil.scoreLabel', 'Soil Quality Score')}</span>
                <span className={`display-6 fw-bold ${getScoreColor(liveAdvisory?.score || 85)}`}>
                  {liveAdvisory?.score ?? 85}/100
                </span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="my-2 p-2 rounded-3 bg-light border">
              <SoilRadarChart
                nitrogen={nitrogen}
                phosphorus={phosphorus}
                potassium={potassium}
                pH={pH}
                moisture={moisture}
                organicMatter={organicMatter}
              />
            </div>

            {/* AI Generated Fertilizer & Crop Recommendation Box */}
            <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 mt-3 flex-grow-1">
              <h6 className="fw-bold text-success d-flex align-items-center gap-1 mb-2">
                <i className="bi bi-lightbulb-fill"></i> {t('soil.recommendation', 'Expert Fertilizer & Crop Plan')}
              </h6>

              <div className="small mb-2">
                <strong>Fertilizer Protocol:</strong> {liveAdvisory?.fertilizerPlan}
              </div>

              <div className="small mb-2">
                <strong>pH Balance Advisory:</strong> {liveAdvisory?.phCorrection}
              </div>

              <div className="small mb-2">
                <strong>Moisture & Irrigation:</strong> {liveAdvisory?.irrigationAdvice}
              </div>

              {liveAdvisory?.suitableCrops && liveAdvisory.suitableCrops.length > 0 && (
                <div className="mt-2 pt-2 border-top border-success border-opacity-25">
                  <strong className="small text-dark d-block mb-1">Recommended Suitable Crops for this Profile:</strong>
                  <div className="d-flex flex-wrap gap-1">
                    {liveAdvisory.suitableCrops.map((c) => (
                      <span key={c} className="badge bg-success text-white">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Soil Records History */}
      <div className="agri-card p-4 bg-white">
        <h5 className="fw-bold mb-3">Farm Soil Testing History</h5>
        {reports.length === 0 ? (
          <p className="text-muted small mb-0">No historical soil tests saved yet. Run and save a diagnostic above!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Test Date</th>
                  <th>Farm / Plot</th>
                  <th>Sample Name</th>
                  <th>N-P-K (kg/ha)</th>
                  <th>pH</th>
                  <th>Moisture</th>
                  <th>Health Score</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.testDate).toLocaleDateString()}</td>
                    <td className="fw-semibold text-success">{r.farm?.name || 'Farm Plot'}</td>
                    <td>{r.sampleName}</td>
                    <td>
                      <span className="badge bg-success me-1">N: {r.nitrogen}</span>
                      <span className="badge bg-primary me-1">P: {r.phosphorus}</span>
                      <span className="badge bg-warning text-dark">K: {r.potassium}</span>
                    </td>
                    <td><span className="badge bg-secondary">{r.pH} pH</span></td>
                    <td>{r.moisture}%</td>
                    <td>
                      <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 fw-bold">
                        {r.overallHealthScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilHealth;
