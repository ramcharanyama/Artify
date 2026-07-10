import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product details
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please log in to add items to the cart.');
      return;
    }
    
    if (user?.role !== 'CUSTOMER') {
      toast.warning('Only customers can purchase items.');
      return;
    }

    if (product.stock <= 0) {
      toast.error('This artwork is sold out.');
      return;
    }

    const res = await addToCart(product.id, 1);
    if (res.success) {
      toast.success(`${product.title} added to cart!`);
    } else {
      toast.error(res.message || 'Failed to add item to cart');
    }
  };

  // Simulate a retail discount percentage (e.g., based on id)
  const discountPercent = product.id % 2 === 0 ? 10 : null;
  const originalPrice = discountPercent ? product.price * (1 + discountPercent / 100) : product.price;

  return (
    <div className="card ajio-product-card h-100 border-0 rounded-0 bg-white">
      <Link to={`/products/${product.id}`} className="text-decoration-none text-dark position-relative d-block overflow-hidden">
        <div className="product-image-container">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="card-img-top rounded-0 img-fluid"
            style={{ height: '300px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400?text=Artwork+Image';
            }}
          />
        </div>
        
        {/* Status badge */}
        {product.status === 'SOLD' && (
          <span className="product-status-tag bg-secondary text-white text-uppercase py-1 px-2 position-absolute top-0 start-0 m-2 font-weight-bold fs-8">
            SOLD OUT
          </span>
        )}
        
        {product.status === 'DRAFT' && (
          <span className="product-status-tag bg-warning text-dark text-uppercase py-1 px-2 position-absolute top-0 start-0 m-2 font-weight-bold fs-8">
            DRAFT
          </span>
        )}

        {discountPercent && product.status === 'ACTIVE' && (
          <span className="product-status-tag bg-danger text-white text-uppercase py-1 px-2 position-absolute top-0 start-0 m-2 font-weight-bold fs-8">
            {discountPercent}% OFF
          </span>
        )}
      </Link>
      
      <div className="card-body p-3 d-flex flex-column">
        {/* Artist / Brand Name in Small Caps */}
        <div className="product-artist-caps mb-1 text-muted text-uppercase letter-spacing-1 fs-8 font-weight-bold">
          {product.artistName || 'Independent Artist'}
        </div>
        
        {/* Title */}
        <h3 className="product-card-title text-truncate h6 mb-2">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-ajio-dark hover-ajio-red">
            {product.title}
          </Link>
        </h3>
        
        {/* Rating indicator */}
        <div className="d-flex align-items-center mb-2 fs-8 text-warning gap-1">
          <FaStar />
          <span className="text-dark font-weight-bold">4.5</span>
        </div>

        {/* Pricing block */}
        <div className="product-price-block d-flex align-items-center gap-2 mt-auto mb-3">
          <span className="current-price fs-6 text-ajio-red font-weight-bold">
            {formatCurrency(product.price)}
          </span>
          {discountPercent && (
            <>
              <span className="original-price text-muted text-decoration-line-through fs-7">
                {formatCurrency(originalPrice)}
              </span>
              <span className="discount-tag text-ajio-red fs-8">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Action Button */}
        {product.status === 'ACTIVE' && (!isAuthenticated || user?.role === 'CUSTOMER') && (
          <button 
            onClick={handleAddToCart}
            className="btn btn-outline-ajio-red rounded-0 w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-uppercase font-weight-bold text-xs"
            disabled={product.stock <= 0}
          >
            <FaShoppingCart size={12} />
            {product.stock <= 0 ? 'SOLD OUT' : 'Add To Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
