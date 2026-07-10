import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';

export const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity, id } = item;

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      onQuantityChange(id, quantity + 1);
    }
  };

  return (
    <div className="ajio-cart-item border-bottom py-4 d-flex flex-column flex-sm-row align-items-sm-center bg-white px-3 mb-2">
      {/* Product Image */}
      <div className="cart-item-img-container mb-3 mb-sm-0 me-sm-4 border flex-shrink-0">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="img-fluid"
            style={{ width: '100px', height: '120px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x120?text=Artwork';
            }}
          />
        </Link>
      </div>

      {/* Product details */}
      <div className="cart-item-details flex-grow-1">
        <div className="text-muted text-uppercase text-xs font-weight-bold letter-spacing-1 mb-1">
          {product.artistName || 'Independent Artist'}
        </div>
        <h3 className="h6 mb-2">
          <Link to={`/products/${product.id}`} className="text-decoration-none text-dark hover-ajio-red">
            {product.title}
          </Link>
        </h3>
        <div className="text-muted text-xs mb-3">
          Status: <span className="text-success">Available</span>
        </div>
        
        {/* Actions block */}
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => onRemove(id)}
            className="btn btn-link text-muted p-0 text-decoration-none text-xs hover-ajio-red d-flex align-items-center gap-1 border-0"
          >
            <FaTrash size={12} /> Remove
          </button>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="cart-item-quantity d-flex align-items-center gap-2 my-3 my-sm-0 mx-sm-4">
        <button 
          onClick={handleDecrease}
          className="btn btn-outline-secondary btn-sm rounded-0 p-1 px-2 d-flex align-items-center justify-content-center"
          disabled={quantity <= 1}
        >
          <FaMinus size={10} />
        </button>
        <span className="px-3 py-1 border text-center font-weight-bold fs-7" style={{ minWidth: '40px' }}>
          {quantity}
        </span>
        <button 
          onClick={handleIncrease}
          className="btn btn-outline-secondary btn-sm rounded-0 p-1 px-2 d-flex align-items-center justify-content-center"
          disabled={quantity >= product.stock}
        >
          <FaPlus size={10} />
        </button>
      </div>

      {/* Price block */}
      <div className="cart-item-price text-sm-end flex-shrink-0" style={{ minWidth: '120px' }}>
        <div className="fs-6 font-weight-bold text-dark mb-1">
          {formatCurrency(product.price * quantity)}
        </div>
        {quantity > 1 && (
          <div className="text-muted text-xs">
            ({formatCurrency(product.price)} each)
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
