import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const CartSummary = ({ totalAmount = 0, itemCount = 0, onCheckout, showCheckoutBtn = true }) => {
  // AJIO style billing breakdown:
  const gst = totalAmount * 0.12; // 12% GST on Art
  const deliveryCharges = totalAmount >= 15000 ? 0 : 499; // Free shipping above 15,000
  const orderTotal = totalAmount + gst + deliveryCharges;

  return (
    <div className="ajio-cart-summary bg-white border p-4 rounded-0">
      <h4 className="fs-6 font-weight-bold text-uppercase pb-3 border-bottom mb-4 letter-spacing-1">
        ORDER DETAILS
      </h4>

      <div className="summary-row d-flex justify-content-between mb-3 fs-7 text-dark">
        <span>Bag Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>

      <div className="summary-row d-flex justify-content-between mb-3 fs-7 text-dark">
        <span>Estimated GST (12%)</span>
        <span>{formatCurrency(gst)}</span>
      </div>

      <div className="summary-row d-flex justify-content-between mb-4 fs-7 text-dark">
        <span>Delivery Fee</span>
        <span>
          {deliveryCharges === 0 ? (
            <span className="text-success font-weight-bold text-uppercase">FREE</span>
          ) : (
            formatCurrency(deliveryCharges)
          )}
        </span>
      </div>

      {deliveryCharges > 0 && (
        <div className="alert alert-info rounded-0 fs-8 p-2 mb-4 border-0 bg-light-gray text-muted text-center">
          Add artwork worth {formatCurrency(15000 - totalAmount)} more for <strong>FREE DELIVERY</strong>!
        </div>
      )}

      <div className="order-total-row d-flex justify-content-between font-weight-bold border-top border-bottom py-3 mb-4 fs-6 text-ajio-dark">
        <span>Total Amount</span>
        <span className="text-ajio-red">{formatCurrency(orderTotal)}</span>
      </div>

      {showCheckoutBtn && onCheckout && (
        <button 
          onClick={onCheckout}
          className="btn btn-ajio-red rounded-0 w-100 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
          disabled={itemCount === 0}
        >
          Proceed to Secure Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
