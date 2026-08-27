import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CATEGORIES = ['All', 'Seeds', 'Fertilizers', 'Bio-Pesticides', 'Irrigation & Tools', 'Machinery & Equipment'];

const Marketplace = () => {
  const { t } = useLanguage();
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = '/resources?';
      if (activeCategory !== 'All') url += `category=${encodeURIComponent(activeCategory)}&`;
      if (organicOnly) url += `organic=true&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await api.get(url);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching marketplace resources:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, organicOnly, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 2500);
  };

  return (
    <div className="container py-4">
      {/* Header & Cart Badge */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('marketplace.title', 'Certified Agri-Marketplace')}</h2>
          <p className="text-muted small mb-0">
            {t('marketplace.subtitle', 'Purchase certified hybrid seeds, organic fertilizers, bio-pesticides, and IoT sensors.')}
          </p>
        </div>
        <Link to="/cart" className="btn btn-agri position-relative shadow-sm px-4">
          <i className="bi bi-cart3 me-2"></i> View Cart & Checkout
          {cartCount > 0 && (
            <span className="badge bg-warning text-dark rounded-pill ms-2">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {addedItem && (
        <div className="alert alert-success py-2 small d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-check-circle-fill me-2"></i>
            Added <strong>{addedItem}</strong> to your cart!
          </span>
          <Link to="/cart" className="btn btn-sm btn-outline-success py-0">
            Checkout Now
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search seeds, fertilizers, neem oil, soil sensors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-agri-outline" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="col-lg-6 d-flex align-items-center justify-content-lg-end gap-3 flex-wrap">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="organicSwitch"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold text-success" htmlFor="organicSwitch">
                🌿 {t('marketplace.organic', 'Organic Certified Only')}
              </label>
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="d-flex gap-2 flex-wrap mt-3 pt-3 border-top">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                activeCategory === cat ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <i className="bi bi-basket3 text-muted fs-1 mb-3 d-block"></i>
          <h5 className="fw-bold">No Products Found</h5>
          <p className="text-muted small">Try switching categories or clearing search keyword filters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-3">
              <div className="agri-card h-100 bg-white d-flex flex-column border">
                <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-100 h-100 object-fit-cover"
                    style={{ transition: 'transform 0.3s ease' }}
                  />
                  {item.organicCertified && (
                    <span className="badge bg-success position-absolute top-0 start-0 m-2 shadow-sm">
                      🌿 Organic Certified
                    </span>
                  )}
                  <span className="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-2">
                    {item.category}
                  </span>
                </div>

                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                      {item.brand}
                    </small>
                    <div className="small text-warning">
                      <i className="bi bi-star-fill me-1"></i>
                      <strong className="text-dark">{item.rating}</strong> ({item.numReviews})
                    </div>
                  </div>

                  <h6 className="fw-bold text-dark mb-2 text-truncate-2" style={{ minHeight: '40px' }}>
                    {item.name}
                  </h6>

                  <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '0.8rem', minHeight: '38px' }}>
                    {item.description}
                  </p>

                  <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold text-success mb-0">₹{item.price}</h5>
                      <small className="text-muted">per {item.unit}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-agri"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="bi bi-cart-plus me-1"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
