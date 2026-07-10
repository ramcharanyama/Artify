import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as orderService from '../services/orderService';
import * as paymentService from '../services/paymentService';
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeClass } from '../utils/formatters';
import { FaChevronDown, FaChevronUp, FaBox, FaTimesCircle, FaTruck, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const OrderHistory = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderPayments, setOrderPayments] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Read order id from state/query param on mount (e.g. from checkout redirect)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlId = searchParams.get('id');
    const confirmedId = location.state?.confirmedOrderId;
    
    if (confirmedId) {
      setExpandedOrderId(Number(confirmedId));
    } else if (urlId) {
      setExpandedOrderId(Number(urlId));
    }
  }, [location]);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await orderService.getOrders();
      setOrders(list || []);
    } catch (err) {
      console.error('Failed to load user orders', err);
      toast.error('Failed to retrieve order history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Load payment details when order is expanded
  const toggleExpandOrder = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (!orderPayments[orderId]) {
      try {
        const payRes = await paymentService.getPaymentByOrderId(orderId);
        if (payRes.success && payRes.data) {
          setOrderPayments(prev => ({ ...prev, [orderId]: payRes.data }));
        }
      } catch (err) {
        console.warn(`Could not load payment details for order ${orderId}`, err);
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const res = await orderService.cancelOrder(orderId);
        if (res.success) {
          toast.success('Order cancelled successfully.');
          loadOrders(); // Refresh
        } else {
          toast.error(res.message || 'Failed to cancel order');
        }
      } catch (err) {
        toast.error(err.message || 'Order cancellation failed');
      }
    }
  };

  const getStepClass = (currentStatus, stepStatus) => {
    const statusPriority = {
      PENDING: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };
    
    const curr = statusPriority[currentStatus] || 0;
    const step = statusPriority[stepStatus] || 0;

    if (currentStatus === 'CANCELLED') return 'step-cancelled';
    if (curr >= step) return 'step-completed';
    return 'step-pending';
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading order history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ajio-orders-page bg-light-gray py-4">
      <div className="container py-3">
        <h1 className="h4 text-uppercase font-weight-black text-dark mb-4 letter-spacing-1">
          MY ORDERS
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-5 bg-white border">
            <h2 className="text-uppercase font-weight-bold fs-5 text-dark mb-2">No Orders Found</h2>
            <p className="text-muted fs-7 mb-4">You have not placed any orders on Artify yet.</p>
            <Link to="/products" className="btn btn-ajio-red rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1">
              Browse Artworks
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const payment = orderPayments[order.id];

              return (
                <div key={order.id} className="card rounded-0 border bg-white shadow-sm">
                  {/* Order header row */}
                  <div 
                    className="card-header bg-white border-0 p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 cursor-pointer"
                    onClick={() => toggleExpandOrder(order.id)}
                  >
                    <div className="d-flex flex-wrap gap-4 align-items-center">
                      <div>
                        <span className="text-xs text-muted text-uppercase block mb-1">ORDER ID</span>
                        <span className="font-weight-bold text-dark block">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted text-uppercase block mb-1">DATE PLACED</span>
                        <span className="text-dark block">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted text-uppercase block mb-1">TOTAL AMOUNT</span>
                        <span className="text-ajio-red font-weight-bold block">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                      <span className={`badge rounded-0 bg-${getStatusBadgeClass(order.status)} text-uppercase px-3 py-2 fs-8 font-weight-bold`}>
                        {order.status}
                      </span>
                      {isExpanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="card-body p-4 border-top">
                      
                      {/* Tracking timeline */}
                      <div className="order-tracking-timeline mb-5">
                        <h3 className="fs-8 font-weight-bold text-uppercase letter-spacing-1 text-dark mb-4">DELIVERY TIMELINE</h3>
                        
                        {order.status === 'CANCELLED' ? (
                          <div className="alert alert-danger rounded-0 border-0 p-3 fs-7">
                            This order was cancelled.
                          </div>
                        ) : (
                          <div className="timeline-steps-container d-flex flex-column flex-md-row justify-content-between position-relative">
                            <div className="timeline-line d-none d-md-block"></div>
                            
                            {/* Step 1: Pending */}
                            <div className={`timeline-step text-center ${getStepClass(order.status, 'PENDING')}`}>
                              <div className="step-circle mx-auto"><FaBox size={10} /></div>
                              <span className="step-label block mt-2 text-uppercase font-weight-bold text-xs">Ordered</span>
                              <span className="step-date block text-muted fs-8">{formatDate(order.createdAt)}</span>
                            </div>

                            {/* Step 2: Confirmed */}
                            <div className={`timeline-step text-center ${getStepClass(order.status, 'CONFIRMED')}`}>
                              <div className="step-circle mx-auto"><FaCheck size={10} /></div>
                              <span className="step-label block mt-2 text-uppercase font-weight-bold text-xs">Confirmed</span>
                              {payment && <span className="step-date block text-muted fs-8">Paid via {payment.method}</span>}
                            </div>

                            {/* Step 3: Shipped */}
                            <div className={`timeline-step text-center ${getStepClass(order.status, 'SHIPPED')}`}>
                              <div className="step-circle mx-auto"><FaTruck size={10} /></div>
                              <span className="step-label block mt-2 text-uppercase font-weight-bold text-xs">Shipped</span>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className={`timeline-step text-center ${getStepClass(order.status, 'DELIVERED')}`}>
                              <div className="step-circle mx-auto"><FaBox size={10} /></div>
                              <span className="step-label block mt-2 text-uppercase font-weight-bold text-xs">Delivered</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items Purchased Grid */}
                      <div className="row g-4 mb-4">
                        <div className="col-md-7">
                          <h3 className="fs-8 font-weight-bold text-uppercase letter-spacing-1 text-dark mb-3">ITEMS ORDERED</h3>
                          <div className="d-flex flex-column gap-3">
                            {order.items && order.items.map((item) => (
                              <div key={item.id} className="d-flex border p-3 align-items-center gap-3">
                                <img 
                                  src={item.product?.imageUrl} 
                                  alt={item.product?.title} 
                                  style={{ width: '60px', height: '70px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x400?text=Artwork';
                                  }}
                                />
                                <div className="flex-grow-1">
                                  <div className="text-muted text-uppercase text-xs font-weight-bold letter-spacing-1">{item.product?.artistName}</div>
                                  <h4 className="fs-7 font-weight-bold text-dark m-0">{item.product?.title}</h4>
                                  <span className="text-muted text-xs">Quantity: {item.quantity}</span>
                                </div>
                                <div className="font-weight-bold text-dark fs-7">
                                  {formatCurrency(item.priceAtPurchase * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery address & Payment info */}
                        <div className="col-md-5">
                          <div className="border bg-light-gray p-4 h-100 d-flex flex-column justify-content-between">
                            <div>
                              <h3 className="fs-8 font-weight-bold text-uppercase letter-spacing-1 text-dark mb-2">SHIPPING ADDRESS</h3>
                              <p className="text-muted fs-7 mb-4">{order.shippingAddress}</p>
                              
                              {payment && (
                                <>
                                  <h3 className="fs-8 font-weight-bold text-uppercase letter-spacing-1 text-dark mb-2">PAYMENT TRANSACTION</h3>
                                  <ul className="list-unstyled text-muted fs-7 mb-0">
                                    <li className="mb-1">Method: <strong>{payment.method}</strong></li>
                                    <li className="mb-1">Transaction ID: <span className="font-weight-bold text-dark">{payment.transactionId || 'N/A'}</span></li>
                                    <li className="mb-1">Amount: <strong>{formatCurrency(payment.amount)}</strong></li>
                                    <li className="mb-1">Status: <strong className="text-success">{payment.status}</strong></li>
                                    {payment.paidAt && <li>Paid On: {formatDateTime(payment.paidAt)}</li>}
                                  </ul>
                                </>
                              )}
                            </div>

                            {/* Cancel Order Action */}
                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="btn btn-outline-danger rounded-0 w-100 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1 mt-4"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
