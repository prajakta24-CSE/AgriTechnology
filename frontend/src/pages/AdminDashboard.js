import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Broadcast Alert Modal State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    pestName: '',
    scientificName: '',
    affectedCrops: 'Cotton, Maize',
    riskLevel: 'High',
    region: 'Maharashtra & Telangana',
    organicRemedy: '',
    chemicalRemedy: '',
  });

  // Product Inventory Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    category: 'Seeds',
    description: '',
    price: '',
    unit: 'kg',
    stockQuantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=600',
    brand: 'AgriTech Certified',
    organicCertified: false,
  });

  const [toastMsg, setToastMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userObj) => {
    try {
      await api.put(`/admin/users/${userObj._id}`, { isActive: !userObj.isActive });
      setToastMsg(`User ${userObj.name} status updated.`);
      fetchAdminData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setToastMsg('User role updated successfully');
      fetchAdminData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert('Error updating role');
    }
  };

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    try {
      await api.post('/weather/pest-alerts', {
        ...alertData,
        affectedCrops: alertData.affectedCrops.split(',').map((c) => c.trim()),
      });
      setShowAlertModal(false);
      setToastMsg('Emergency Pest Alert Broadcasted! 🚨');
      fetchAdminData();
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err) {
      alert('Error broadcasting alert');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', {
        ...productData,
        price: Number(productData.price),
        stockQuantity: Number(productData.stockQuantity),
      });
      setShowProductModal(false);
      setToastMsg('Product added to Marketplace inventory! 🛒');
      fetchAdminData();
      setTimeout(() => setToastMsg(''), 3500);
    } catch (err) {
      alert('Error adding product');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Loading Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger text-white">Administrator Access</span>
            <span className="text-muted small">Mentor: Syed Abul Arshad</span>
          </div>
          <h2 className="fw-bold mb-0">Agri-Tech System & Content Management</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-danger" onClick={() => setShowAlertModal(true)}>
            <i className="bi bi-megaphone-fill me-1"></i> Broadcast Pest Alert
          </button>
          <button className="btn btn-sm btn-agri" onClick={() => setShowProductModal(true)}>
            <i className="bi bi-plus-circle-fill me-1"></i> Add Store Product
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Farmers</small>
            <h4 className="fw-bold text-success my-1">{stats?.totalFarmers || 0}</h4>
            <small className="text-muted">Registered</small>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Total Farms</small>
            <h4 className="fw-bold text-primary my-1">{stats?.totalFarms || 0}</h4>
            <small className="text-muted">{stats?.totalAcreage || 0} Acres</small>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Active Crops</small>
            <h4 className="fw-bold text-warning my-1">{stats?.totalCrops || 0}</h4>
            <small className="text-muted">In Lifecycle</small>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Store Orders</small>
            <h4 className="fw-bold text-dark my-1">{stats?.totalOrders || 0}</h4>
            <small className="text-success">₹{stats?.totalRevenue || 0}</small>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Pest Alerts</small>
            <h4 className="fw-bold text-danger my-1">{stats?.activePestAlerts || 0}</h4>
            <small className="text-danger">Live Warnings</small>
          </div>
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <div className="agri-card p-3 bg-white text-center">
            <small className="text-muted d-block">Forum Q&As</small>
            <h4 className="fw-bold text-info my-1">{stats?.openForumQuestions || 0}</h4>
            <small className="text-muted">Open Queries</small>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 bg-white p-2 rounded-3 shadow-sm">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'overview' ? 'active bg-success' : 'text-dark'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-1"></i> Operations Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === 'users' ? 'active bg-success' : 'text-dark'}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i> User Oversight ({users.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="agri-card p-4 bg-white">
              <h5 className="fw-bold mb-3">Recent Marketplace Purchases</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Farmer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentOrders?.map((ord) => (
                      <tr key={ord._id}>
                        <td className="font-monospace">#{ord._id.slice(-6).toUpperCase()}</td>
                        <td className="fw-semibold">{ord.farmer?.name}</td>
                        <td>{ord.orderItems?.length} items</td>
                        <td className="fw-bold text-success">₹{ord.totalPrice}</td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="agri-card p-4 bg-white">
              <h5 className="fw-bold mb-3">Crop Growth Stage Distribution</h5>
              <div className="d-flex flex-column gap-2">
                {stats?.cropStageDistribution?.map((stg) => (
                  <div key={stg._id} className="d-flex justify-content-between align-items-center p-2 rounded bg-light border small">
                    <span className="fw-semibold">{stg._id || 'Sowing'}</span>
                    <span className="badge bg-success px-3 py-1">{stg.count} Crops</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Oversight */}
      {activeTab === 'users' && (
        <div className="agri-card p-4 bg-white">
          <h5 className="fw-bold mb-3">Registered Agricultural User Accounts</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={u.name}
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="text-dark d-block">{u.name}</strong>
                          <small className="text-muted">Joined {new Date(u.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <small className="text-muted">{u.phone || 'N/A'}</small>
                    </td>
                    <td>{u.location?.district || 'Pune'}, {u.location?.state || 'Maharashtra'}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{ width: '110px' }}
                      >
                        <option value="farmer">Farmer</option>
                        <option value="expert">Expert</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'} py-0`}
                        onClick={() => handleToggleUserStatus(u)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast Alert Modal */}
      {showAlertModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-megaphone-fill me-2"></i> Broadcast Emergency Pest Alert
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAlertModal(false)}></button>
              </div>
              <form onSubmit={handleBroadcastAlert}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Alert Title</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Locust Swarm Warning"
                        value={alertData.title}
                        onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Pest / Disease Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Desert Locust"
                        value={alertData.pestName}
                        onChange={(e) => setAlertData({ ...alertData, pestName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Affected Crops (Comma separated)</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={alertData.affectedCrops}
                        onChange={(e) => setAlertData({ ...alertData, affectedCrops: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Risk Level</label>
                      <select
                        className="form-select"
                        value={alertData.riskLevel}
                        onChange={(e) => setAlertData({ ...alertData, riskLevel: e.target.value })}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Affected Region</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={alertData.region}
                        onChange={(e) => setAlertData({ ...alertData, region: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Organic Remedy Protocol</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Neem seed extract 5% or Trichoderma application..."
                        value={alertData.organicRemedy}
                        onChange={(e) => setAlertData({ ...alertData, organicRemedy: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Chemical Control Measure</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Chlorantraniliprole 18.5% SC @ 0.3ml/L..."
                        value={alertData.chemicalRemedy}
                        onChange={(e) => setAlertData({ ...alertData, chemicalRemedy: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAlertModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger">
                    Broadcast to All Farmers
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-cart-plus me-2"></i> Add Product to Agri-Marketplace
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProductModal(false)}></button>
              </div>
              <form onSubmit={handleAddProduct}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Product Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. Bio-NPK Granules"
                        value={productData.name}
                        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={productData.category}
                        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Bio-Pesticides">Bio-Pesticides</option>
                        <option value="Irrigation & Tools">Irrigation & Tools</option>
                        <option value="Machinery & Equipment">Machinery & Equipment</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-control"
                        placeholder="e.g. 450"
                        value={productData.price}
                        onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Unit</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g. bag (50kg), packet, Liter"
                        value={productData.unit}
                        onChange={(e) => setProductData({ ...productData, unit: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Initial Stock</label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-control"
                        value={productData.stockQuantity}
                        onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Brand / Manufacturer</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productData.brand}
                        onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="orgCert"
                          checked={productData.organicCertified}
                          onChange={(e) => setProductData({ ...productData, organicCertified: e.target.checked })}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="orgCert">
                          Organic Certified
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Description</label>
                      <textarea
                        required
                        rows="2"
                        className="form-control"
                        value={productData.description}
                        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowProductModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri">
                    Add Product to Catalog
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

export default AdminDashboard;
