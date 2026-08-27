import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const ORDER_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const Orders = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStepIndex = (status) => {
    return ORDER_STEPS.indexOf(status);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t('nav.orders', 'My Agri-Tech Orders & Deliveries')}</h2>
          <p className="text-muted small mb-0">Track farm inputs, seeds, and equipment in real-time</p>
        </div>
        <Link to="/marketplace" className="btn btn-sm btn-agri">
          <i className="bi bi-cart-plus me-1"></i> Order More Supplies
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="agri-card p-5 text-center bg-white">
          <i className="bi bi-box-seam text-muted fs-1 mb-3 d-block"></i>
          <h4 className="fw-bold">No Orders Placed Yet</h4>
          <p className="text-muted small mb-4">
            You haven't ordered any agricultural seeds, fertilizers, or tools yet.
          </p>
          <Link to="/marketplace" className="btn btn-agri">
            Visit Agri-Marketplace
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const stepIdx = getStatusStepIndex(order.status);
            return (
              <div key={order._id} className="agri-card p-4 bg-white border">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 border-bottom mb-3">
                  <div>
                    <span className="badge bg-secondary font-monospace">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <small className="text-muted ms-2">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1 fw-bold">
                      {order.status}
                    </span>
                    <span className="fw-bold text-dark fs-6">₹{order.totalPrice}</span>
                  </div>
                </div>

                {/* Step Progress Bar */}
                <div className="p-3 my-3 rounded-3 bg-light border">
                  <div className="d-flex justify-content-between position-relative">
                    {ORDER_STEPS.map((stg, i) => {
                      const isDone = stepIdx >= i;
                      const isCurrent = stepIdx === i;
                      return (
                        <div key={stg} className="d-flex flex-column align-items-center flex-fill text-center">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${
                              isDone ? 'bg-success text-white' : 'bg-white border text-muted'
                            }`}
                            style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                          >
                            {isDone ? <i className="bi bi-check2"></i> : i + 1}
                          </div>
                          <small
                            className={`mt-1 ${isCurrent ? 'fw-bold text-success' : 'text-muted'}`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {stg}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="row g-3 my-2">
                  <div className="col-md-7">
                    <h6 className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                      Ordered Items ({order.orderItems.length})
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded bg-light border small">
                          <div className="d-flex align-items-center gap-2">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="rounded object-fit-cover" style={{ width: '40px', height: '40px' }} />
                            )}
                            <div>
                              <strong className="text-dark d-block">{item.name}</strong>
                              <small className="text-muted">Qty: {item.quantity} {item.unit || ''} &bull; ₹{item.price} each</small>
                            </div>
                          </div>
                          <strong className="text-success">₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address & Tracking Log */}
                  <div className="col-md-5">
                    <h6 className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                      Delivery Location & Payment
                    </h6>
                    <div className="p-3 rounded bg-light border small">
                      <div className="fw-bold text-dark">{order.shippingAddress?.fullName}</div>
                      <div className="text-muted">{order.shippingAddress?.farmAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</div>
                      <div className="text-muted mt-1"><i className="bi bi-telephone me-1"></i> {order.shippingAddress?.phoneNumber}</div>
                      <div className="mt-2 pt-2 border-top text-success fw-semibold">
                        <i className="bi bi-credit-card me-1"></i> {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Milestones History */}
                {order.trackingHistory && order.trackingHistory.length > 0 && (
                  <div className="mt-3 pt-3 border-top small text-muted">
                    <strong className="text-dark me-2">Latest Tracking Note:</strong>
                    <span>{order.trackingHistory[order.trackingHistory.length - 1]?.comment || 'Package processed.'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
