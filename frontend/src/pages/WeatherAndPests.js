import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const QUICK_CITIES = ['Pune', 'Nashik', 'Nagpur', 'Hyderabad', 'Bengaluru', 'Ludhiana', 'Indore', 'Jaipur', 'Ahmedabad', 'Chennai', 'Lucknow'];

const WeatherAndPests = () => {
  const { t } = useLanguage();
  const [cityInput, setCityInput] = useState('Pune');
  const [activeCity, setActiveCity] = useState('Pune');
  const [weather, setWeather] = useState(null);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      const [weatherRes, pestRes] = await Promise.all([
        api.get(`/weather?city=${city.toLowerCase()}`),
        api.get('/weather/pest-alerts'),
      ]);

      if (weatherRes.data.success) {
        setWeather(weatherRes.data.data);
      }
      if (pestRes.data.success) {
        setPestAlerts(pestRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching weather & pests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(activeCity);
  }, [activeCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setActiveCity(cityInput.trim());
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Critical': return 'bg-danger text-white';
      case 'High': return 'bg-danger bg-opacity-75 text-white';
      case 'Medium': return 'bg-warning text-dark';
      case 'Low': return 'bg-info text-dark';
      default: return 'bg-secondary text-white';
    }
  };

  const filteredPests = pestAlerts.filter((p) => {
    if (selectedCropFilter === 'All') return true;
    return p.affectedCrops.some((c) => c.toLowerCase().includes(selectedCropFilter.toLowerCase()));
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('weather.title', 'Real-time Weather & Smart Pest Early Warning')}</h2>
          <p className="text-muted small mb-0">
            {t('weather.subtitle', 'Live meteorological conditions, 7-day agricultural forecast, and pest risk advisories.')}
          </p>
        </div>
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
          <i className="bi bi-broadcast me-1"></i> Open-Meteo Precision Radar
        </span>
      </div>

      {/* City Search Bar & Quick Tags */}
      <div className="agri-card p-3 mb-4 bg-white">
        <form onSubmit={handleSearch} className="row g-2 align-items-center">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-geo-alt-fill text-danger"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search agricultural region or district (e.g. Pune, Nashik, Ludhiana, Hyderabad)..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 d-grid">
            <button type="submit" className="btn btn-agri">
              <i className="bi bi-search me-1"></i> Check Weather & Forecast
            </button>
          </div>
        </form>

        <div className="d-flex align-items-center gap-2 flex-wrap mt-3 pt-2 border-top">
          <small className="text-muted fw-semibold">Quick Agricultural Hubs:</small>
          {QUICK_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`btn btn-sm py-0 px-2 rounded-pill ${
                activeCity.toLowerCase() === c.toLowerCase() ? 'btn-success text-white' : 'btn-outline-secondary'
              }`}
              style={{ fontSize: '0.75rem' }}
              onClick={() => {
                setCityInput(c);
                setActiveCity(c);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted mt-2">Loading meteorological radar...</p>
        </div>
      ) : (
        <>
          {/* Current Live Weather Hero Card */}
          <div className="agri-card p-4 mb-4 bg-white border-0 shadow-sm">
            <div className="row align-items-center g-4">
              <div className="col-md-4 text-center text-md-start border-end-md">
                <div className="d-flex align-items-center gap-2 mb-1 justify-content-center justify-content-md-start">
                  <span className="pulse-dot"></span>
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold">Live Sensor Feed</span>
                </div>
                <h3 className="fw-bold mb-0 text-dark">{weather?.city}, {weather?.state}</h3>
                <small className="text-muted d-block mb-3">Coords: {weather?.coordinates?.lat.toFixed(2)}°N, {weather?.coordinates?.lon.toFixed(2)}°E</small>
                
                <div className="display-3 fw-bold text-success lh-1 mb-1">
                  {weather?.current?.temp}&deg;C
                </div>
                <div className="fw-semibold text-muted">
                  Feels like {weather?.current?.feelsLike}&deg;C &bull; {weather?.current?.condition}
                </div>
              </div>

              <div className="col-md-8">
                <div className="row g-3 text-center">
                  <div className="col-6 col-sm-3">
                    <div className="p-3 rounded-3 bg-light border">
                      <i className="bi bi-droplet-fill text-info fs-4 d-block mb-1"></i>
                      <small className="text-muted d-block">{t('weather.humidity', 'Humidity')}</small>
                      <strong className="fs-5 text-dark">{weather?.current?.humidity}%</strong>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 rounded-3 bg-light border">
                      <i className="bi bi-wind text-primary fs-4 d-block mb-1"></i>
                      <small className="text-muted d-block">{t('weather.wind', 'Wind Speed')}</small>
                      <strong className="fs-5 text-dark">{weather?.current?.windSpeed} km/h</strong>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 rounded-3 bg-light border">
                      <i className="bi bi-cloud-rain-fill text-primary fs-4 d-block mb-1"></i>
                      <small className="text-muted d-block">{t('weather.rainProb', 'Rain Risk')}</small>
                      <strong className="fs-5 text-dark">{weather?.forecast?.[0]?.rainProb || 15}%</strong>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-3 rounded-3 bg-light border">
                      <i className="bi bi-speedometer2 text-warning fs-4 d-block mb-1"></i>
                      <small className="text-muted d-block">Pressure</small>
                      <strong className="fs-5 text-dark">{Math.round(weather?.current?.pressure || 1012)} hPa</strong>
                    </div>
                  </div>
                </div>

                {/* Advisories Strip */}
                {weather?.advisories && weather.advisories.length > 0 && (
                  <div className="mt-3 d-flex flex-column gap-2">
                    {weather.advisories.map((adv, idx) => (
                      <div
                        key={idx}
                        className={`p-2 px-3 rounded-3 border small d-flex align-items-center gap-2 ${
                          adv.type === 'critical' || adv.type === 'danger'
                            ? 'bg-danger bg-opacity-10 border-danger text-danger fw-semibold'
                            : adv.type === 'warning'
                            ? 'bg-warning bg-opacity-10 border-warning text-dark'
                            : 'bg-success bg-opacity-10 border-success text-success'
                        }`}
                      >
                        <i className="bi bi-info-circle-fill"></i>
                        <span>
                          <strong>{adv.category}:</strong> {adv.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 7-Day Agricultural Forecast Cards */}
          <div className="mb-5">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-calendar-week text-success"></i>
              7-Day Agricultural Weather Forecast
            </h5>
            <div className="row g-2">
              {weather?.forecast?.map((day, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg">
                  <div className="agri-card p-3 text-center bg-white h-100 border">
                    <small className="text-muted fw-bold d-block mb-1">
                      {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </small>
                    <div className="my-2">
                      <i
                        className={`bi fs-3 ${
                          day.rainProb > 40
                            ? 'bi-cloud-rain-heavy-fill text-primary'
                            : day.rainProb > 20
                            ? 'bi-cloud-sun-fill text-warning'
                            : 'bi-sun-fill text-warning'
                        }`}
                      ></i>
                    </div>
                    <div className="fw-bold text-dark">{day.maxTemp}&deg; / <span className="text-muted fw-normal">{day.minTemp}&deg;</span></div>
                    <small className="text-primary fw-semibold d-block mt-1">
                      <i className="bi bi-droplet-fill me-1" style={{ fontSize: '0.7rem' }}></i>
                      {day.rainProb}% Rain
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pest Early Warning & Outbreak Advisories Section */}
          <div className="agri-card p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <h4 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-shield-exclamation text-danger"></i>
                  {t('weather.pestAlerts', 'Active Pest & Disease Outbreaks')}
                </h4>
                <small className="text-muted">Hyperlocal early alerts, biological treatments, and chemical control protocols</small>
              </div>

              {/* Crop Filter */}
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted fw-semibold">Filter by Crop:</small>
                <select
                  className="form-select form-select-sm"
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="All">All Crops</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Rice">Rice / Paddy</option>
                </select>
              </div>
            </div>

            <div className="row g-4 mt-1">
              {filteredPests.map((pest) => (
                <div key={pest._id} className="col-lg-6">
                  <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{pest.title}</h5>
                      <span className={`badge ${getRiskBadge(pest.riskLevel)} px-2 py-1`}>
                        {pest.riskLevel} Risk
                      </span>
                    </div>

                    <p className="small text-muted mb-2">
                      <strong>Scientific Name:</strong> <em>{pest.scientificName || pest.pestName}</em> &bull; <strong>Region:</strong> {pest.region}
                    </p>

                    <div className="d-flex flex-wrap gap-1 mb-2">
                      <small className="text-muted me-1">Affected Crops:</small>
                      {pest.affectedCrops.map((c) => (
                        <span key={c} className="badge bg-secondary">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="p-2 rounded bg-white border small mb-2">
                      <strong className="text-danger d-block">Identified Symptoms:</strong>
                      <ul className="mb-0 ps-3">
                        {pest.symptoms?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-25 small mb-2">
                      <strong className="text-success d-block">🌿 Organic / Biological Control:</strong>
                      <span>{pest.organicRemedy}</span>
                    </div>

                    <div className="p-2 rounded bg-warning bg-opacity-10 border border-warning border-opacity-25 small mt-auto">
                      <strong className="text-dark d-block">🧪 Chemical Control Measure:</strong>
                      <span>{pest.chemicalRemedy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherAndPests;
