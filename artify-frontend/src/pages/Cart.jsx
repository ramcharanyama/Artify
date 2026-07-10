import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { FaShoppingCart, FaChevronLeft } from 'react-icons/fa';

export const Cart = () => {
  const { cart, cartCount, updateCartItem, removeFromCart, isLoading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = async (itemId, qty) => {
    await updateCartItem(itemId, qty);
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  if (isLoading && cart.items.length === 0) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading shopping cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ajio-cart-page bg-light-gray py-4">
      <div className="container py-3">
        <h1 className="h4 text-uppercase font-weight-black text-dark mb-4 letter-spacing-1">
          SHOPPING BAG ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-5 bg-white border">
            <div className="text-muted mb-3">
              <FaShoppingCart size={48} />
            </div>
            <h2 className="text-uppercase font-weight-bold fs-5 text-dark mb-2">Your Bag is Empty</h2>
            <p className="text-muted fs-7 mb-4">You haven't added any artworks to your cart yet.</p>
            <Link to="/products" className="btn btn-ajio-red rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            {/* Cart Items List */}
            <div className="col-lg-8">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
              
              <div className="mt-4">
                <Link to="/products" className="btn btn-outline-dark rounded-0 px-4 py-3 text-uppercase font-weight-bold text-xs letter-spacing-1 d-inline-flex align-items-center gap-2">
                  <FaChevronLeft size={10} /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Billing Summary */}
            <div className="col-lg-4">
              <CartSummary
                totalAmount={cart.totalAmount}
                itemCount={cartCount}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
