import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal, tax, shipping, cartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || 'Ramesh Patel',
    phoneNumber: user?.phone || '+91 98765 43210',
    farmAddress: 'Green Valley Plot, Sector 4',
    city: user?.location?.district || 'Pune',
    state: user?.location?.state || 'Maharashtra',
    postalCode: '413102',
    paymentMethod: 'Cash on Delivery (Kisan Pay)',
  });

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        resource: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit,
        image: item.product.imageUrl,
      }));

      const res = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          fullName: shippingForm.fullName,
          phoneNumber: shippingForm.phoneNumber,
          farmAddress: shippingForm.farmAddress,
          city: shippingForm.city,
          state: shippingForm.state,
          postalCode: shippingForm.postalCode,
        },
        paymentMethod: shippingForm.paymentMethod,
        itemsPrice: cartSubtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: cartTotal,
      });

      if (res.data.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        clearCart();
        setShowCheckoutModal(false);
        navigate('/orders');
      }
    } catch (err) {
      alert('Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="agri-card p-5 max-w-600 mx-auto bg-white">
          <i className="bi bi-cart-x text-muted fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold">Your Agri-Cart is Empty</h4>
          <p className="text-muted small mb-4">
            Browse our certified seeds, organic fertilizers, and smart equipment in the Agri-Marketplace.
          </p>
          <Link to="/marketplace" className="btn btn-agri px-4">
            <i className="bi bi-shop me-2"></i> Browse Agricultural Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Shopping Cart ({cartItems.length} Products)</h2>
        <button className="btn btn-sm btn-outline-danger" onClick={clearCart}>
          <i className="bi bi-trash me-1"></i> Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="agri-card p-4 bg-white">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light small">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style={{ width: '130px' }}>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="rounded-3 object-fit-cover"
                            style={{ width: '56px', height: '56px' }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold text-dark">{item.product.name}</h6>
                            <small className="text-muted">{item.product.brand} &bull; {item.product.unit}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-semibold">₹{item.product.price}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="input-group-text bg-white px-3 fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-success">₹{item.product.price * item.quantity}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          <i className="bi bi-trash3 fs-6"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="col-lg-4">
          <div className="agri-card p-4 bg-white sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3">Order Price Summary</h5>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Items Subtotal</span>
              <span className="text-dark fw-semibold">₹{cartSubtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>GST / Agricultural Tax (5%)</span>
              <span className="text-dark fw-semibold">₹{tax}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Rural Delivery Shipping</span>
              <span className={shipping === 0 ? 'text-success fw-bold' : 'text-dark fw-semibold'}>
                {shipping === 0 ? 'FREE (Above ₹2000)' : `₹${shipping}`}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold text-dark fs-5">Total Amount</span>
              <span className="fw-bold text-success fs-5">₹{cartTotal}</span>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-agri py-3 fw-bold" onClick={() => setShowCheckoutModal(true)}>
                <i className="bi bi-bag-check-fill me-2"></i> Proceed to Checkout
              </button>
              <Link to="/marketplace" className="btn btn-sm btn-outline-secondary py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-truck me-2"></i> Delivery Address & Payment
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckoutModal(false)}></button>
              </div>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Farmer / Full Name</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={shippingForm.fullName}
                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        required
                        className="form-control"
                        value={shippingForm.phoneNumber}
                        onChange={(e) => setShippingForm({ ...shippingForm, phoneNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Farm Address / Landmark</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={shippingForm.farmAddress}
                        onChange={(e) => setShippingForm({ ...shippingForm, farmAddress: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">District / City</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">State</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">PIN Code</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Payment Option</label>
                      <select
                        className="form-select"
                        value={shippingForm.paymentMethod}
                        onChange={(e) => setShippingForm({ ...shippingForm, paymentMethod: e.target.value })}
                      >
                        <option value="Cash on Delivery (Kisan Pay)">💵 Cash on Delivery (Kisan Pay)</option>
                        <option value="UPI / NetBanking">📲 UPI / NetBanking / GPay</option>
                        <option value="Kisan Credit Card (KCC)">💳 Kisan Credit Card (KCC Subsidized)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 mt-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">Grand Total Payable</small>
                      <h4 className="fw-bold text-success mb-0">₹{cartTotal}</h4>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success p-2">
                      <i className="bi bi-shield-check me-1"></i> 100% AgriTech Delivery Guarantee
                    </span>
                  </div>
                </div>

                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCheckoutModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri px-4" disabled={submitting}>
                    {submitting ? 'Confirming Order...' : 'Confirm & Place Order'}
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

export default Cart;
