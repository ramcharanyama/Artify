import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import * as orderService from '../services/orderService';
import * as paymentService from '../services/paymentService';
import { validateRequired } from '../utils/validators';
import { formatCurrency } from '../utils/formatters';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '../utils/constants';
import { toast } from 'react-toastify';
import CartSummary from '../components/cart/CartSummary';

export const Checkout = () => {
  const { cart, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.items.length === 0) {
      toast.info('Your cart is empty. Please add items before checking out.');
      navigate('/products');
    }
  }, [cart, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressCheck = validateRequired(shippingAddress, 'Shipping Address');
    if (!addressCheck.isValid) {
      setErrors({ address: addressCheck.message });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Place order
      const orderRes = await orderService.placeOrder({ shippingAddress });
      if (orderRes.success && orderRes.data) {
        const order = orderRes.data;
        
        // 2. Process payment
        const paymentRes = await paymentService.processPayment({
          orderId: order.id,
          method: paymentMethod,
        });

        if (paymentRes.success) {
          toast.success('Order placed and paid successfully!');
          clearCart(); // Local clear
          navigate('/orders', { state: { confirmedOrderId: order.id } });
        } else {
          toast.warning(`Order placed but payment status is pending: ${paymentRes.message}`);
          clearCart();
          navigate('/orders');
        }
      } else {
        toast.error(orderRes.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout failure', err);
      toast.error(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ajio-checkout-page bg-light-gray py-4">
      <div className="container py-3">
        <h1 className="h4 text-uppercase font-weight-black text-dark mb-4 letter-spacing-1">
          SECURE CHECKOUT
        </h1>

        <div className="row g-4 align-items-start">
          {/* Checkout Forms (Left) */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Shipping Details */}
              <div className="bg-white border p-4 mb-4 rounded-0">
                <h2 className="fs-6 font-weight-bold text-uppercase pb-2 border-bottom mb-4 letter-spacing-1">
                  1. DELIVERY ADDRESS
                </h2>
                
                <div className="form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">
                    Shipping Address (Street, Building, City, Pin Code)
                  </label>
                  <textarea
                    rows="3"
                    className={`form-control rounded-0 ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter full delivery address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                  {errors.address && <div className="invalid-feedback fs-8">{errors.address}</div>}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border p-4 mb-4 rounded-0">
                <h2 className="fs-6 font-weight-bold text-uppercase pb-2 border-bottom mb-4 letter-spacing-1">
                  2. PAYMENT OPTIONS
                </h2>

                <div className="payment-options-list d-flex flex-column gap-3">
                  {Object.keys(PAYMENT_METHODS).map((methodKey) => (
                    <div key={methodKey} className="form-check p-3 border cursor-pointer hover-bg-light-gray d-flex align-items-center">
                      <input
                        className="form-check-input payment-radio ms-0 me-3"
                        type="radio"
                        name="paymentMethod"
                        id={`pay-${methodKey}`}
                        value={methodKey}
                        checked={paymentMethod === methodKey}
                        onChange={() => setPaymentMethod(methodKey)}
                      />
                      <label className="form-check-label fs-7 cursor-pointer w-100 font-weight-bold" htmlFor={`pay-${methodKey}`}>
                        {PAYMENT_METHOD_LABELS[methodKey]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit panel */}
              <div className="bg-white border p-3 rounded-0 text-end">
                <button 
                  type="submit"
                  className="btn btn-ajio-red rounded-0 px-5 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
                  disabled={isSubmitting || cart.items.length === 0}
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Order & Pay'}
                </button>
              </div>

            </form>
          </div>

          {/* Cart billing preview (Right) */}
          <div className="col-lg-4">
            <div className="bg-white border p-4 mb-4 rounded-0">
              <h3 className="fs-7 font-weight-bold text-uppercase pb-2 border-bottom mb-3 letter-spacing-1">
                BAG ITEMS ({cartCount})
              </h3>
              
              <div className="checkout-items-preview max-h-300 overflow-auto mb-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.title} 
                        style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fs-7 font-weight-bold text-dark text-truncate" style={{ maxWidth: '140px' }}>{item.product.title}</div>
                        <div className="text-muted text-xs">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="fs-7 font-weight-bold text-dark">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <CartSummary
              totalAmount={cart.totalAmount}
              itemCount={cartCount}
              showCheckoutBtn={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
