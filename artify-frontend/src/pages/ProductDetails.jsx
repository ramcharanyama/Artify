import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaChevronRight, FaRegStar } from 'react-icons/fa';
import * as productService from '../services/productService';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from 'react-toastify';
import StarRating from '../components/common/StarRating';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch Product Details
      const prodRes = await productService.getProductById(id);
      if (prodRes.success && prodRes.data) {
        const prodData = prodRes.data;
        setProduct(prodData);

        // Fetch Related Products (same category)
        const relRes = await productService.getAllProducts({ category: prodData.categoryId, size: 4 });
        const relList = relRes?.content || relRes?.data?.content || relRes?.data || [];
        setRelatedProducts(relList.filter(p => p.id !== prodData.id).slice(0, 4));
      }

      // Fetch Reviews
      const revList = await reviewService.getReviewsByProduct(id);
      setReviews(revList || []);
    } catch (err) {
      console.error('Failed to load product details', err);
      toast.error('Artwork not found or loading failed');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart.');
      navigate('/login');
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

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to make a purchase.');
      navigate('/login');
      return;
    }

    if (user?.role !== 'CUSTOMER') {
      toast.warning('Only customers can purchase items.');
      return;
    }

    const res = await addToCart(product.id, 1);
    if (res.success) {
      navigate('/cart');
    } else {
      toast.error(res.message || 'Failed to add item to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment for your review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewService.createReview({
        productId: product.id,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        toast.success('Thank you for your review!');
        setComment('');
        setRating(5);
        // Refresh reviews list
        const revList = await reviewService.getReviewsByProduct(product.id);
        setReviews(revList || []);
      } else {
        toast.error(res.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading artwork details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-uppercase font-weight-black text-dark mb-4">Artwork Not Found</h2>
        <Link to="/products" className="btn btn-ajio-red rounded-0 px-4 py-2">Back to Catalog</Link>
      </div>
    );
  }

  // Calculate simulated retail discount
  const discountPercent = product.id % 2 === 0 ? 10 : null;
  const originalPrice = discountPercent ? product.price * (1 + discountPercent / 100) : product.price;

  return (
    <div className="ajio-product-details-page bg-light-gray py-4">
      <div className="container py-3">
        
        {/* Breadcrumbs */}
        <div className="breadcrumb-nav bg-white border py-2 px-3 mb-4 fs-8 text-uppercase letter-spacing-1 d-flex align-items-center gap-2">
          <Link to="/" className="text-muted text-decoration-none">Home</Link>
          <FaChevronRight size={8} className="text-muted" />
          <Link to="/products" className="text-muted text-decoration-none">Gallery</Link>
          <FaChevronRight size={8} className="text-muted" />
          <Link to={`/products?category=${product.categoryId}`} className="text-muted text-decoration-none">{product.categoryName}</Link>
          <FaChevronRight size={8} className="text-muted" />
          <span className="text-dark font-weight-bold">{product.title}</span>
        </div>

        {/* Main Details Body */}
        <div className="row g-4 mb-5">
          {/* Left Column - Large Image */}
          <div className="col-lg-7">
            <div className="bg-white border p-4 text-center">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="img-fluid border"
                style={{ maxHeight: '550px', objectFit: 'contain', width: '100%' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/800x600?text=Artwork+Image';
                }}
              />
            </div>
          </div>

          {/* Right Column - Sticky Buy Box */}
          <div className="col-lg-5">
            <div className="ajio-buy-box bg-white border p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Artist Small Caps */}
                <div className="text-uppercase text-muted letter-spacing-1 font-weight-bold fs-7 mb-2">
                  {product.artistName || 'Independent Artist'}
                </div>
                
                {/* Title */}
                <h1 className="h3 text-uppercase font-weight-black text-dark mb-3 letter-spacing-1">
                  {product.title}
                </h1>
                
                {/* Rating */}
                <div className="d-flex align-items-center gap-2 mb-4">
                  <StarRating rating={4.5} size={14} />
                  <span className="fs-8 text-muted font-weight-bold">
                    ({reviews.length} {reviews.length === 1 ? 'Customer Review' : 'Customer Reviews'})
                  </span>
                </div>

                {/* Price block */}
                <div className="d-flex align-items-baseline gap-3 mb-4 pb-4 border-bottom">
                  <span className="fs-3 text-ajio-red font-weight-bold">
                    {formatCurrency(product.price)}
                  </span>
                  {discountPercent && (
                    <>
                      <span className="text-muted text-decoration-line-through fs-6">
                        {formatCurrency(originalPrice)}
                      </span>
                      <span className="text-ajio-red fs-7 font-weight-bold">
                        ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="fs-8 font-weight-bold text-uppercase letter-spacing-1 text-dark mb-2">DESCRIPTION</h3>
                  <p className="text-muted fs-7 leading-relaxed">{product.description}</p>
                </div>

                {/* Stock status indicator */}
                <div className="mb-4">
                  <span className="text-xs font-weight-bold text-uppercase letter-spacing-1 text-dark me-2">STOCK STATUS:</span>
                  {product.stock > 0 ? (
                    <span className="badge bg-success rounded-0 text-uppercase fs-8 px-2 py-1">IN STOCK ({product.stock} left)</span>
                  ) : (
                    <span className="badge bg-secondary rounded-0 text-uppercase fs-8 px-2 py-1">SOLD OUT</span>
                  )}
                </div>
              </div>

              {/* Buy actions */}
              {product.status === 'ACTIVE' && (!isAuthenticated || user?.role === 'CUSTOMER') && (
                <div className="d-flex flex-column gap-3 mt-4 pt-4 border-top">
                  <button 
                    onClick={handleAddToCart}
                    className="btn btn-outline-dark rounded-0 w-100 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
                    disabled={product.stock <= 0}
                  >
                    Add To Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="btn btn-ajio-red rounded-0 w-100 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border p-5 rounded-0 mb-5">
          <h2 className="text-uppercase font-weight-black text-dark mb-4 letter-spacing-1 h4">
            CUSTOMER REVIEWS ({reviews.length})
          </h2>

          <div className="row g-5">
            {/* Reviews List */}
            <div className="col-md-7">
              {reviews.length === 0 ? (
                <p className="text-muted py-4 mb-0">No reviews have been written for this artwork yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="reviews-list d-flex flex-column gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-bottom pb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="font-weight-bold text-dark fs-7">{rev.userName}</div>
                        <span className="text-muted fs-8">{formatDate(rev.createdAt)}</span>
                      </div>
                      <div className="mb-2">
                        <StarRating rating={rev.rating} size={12} />
                      </div>
                      <p className="text-muted fs-7 mb-0">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form - Customer only */}
            <div className="col-md-5">
              {isAuthenticated && user?.role === 'CUSTOMER' ? (
                <div className="border bg-light-gray p-4">
                  <h3 className="h6 text-uppercase font-weight-bold text-dark mb-3 letter-spacing-1">WRITE A REVIEW</h3>
                  
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1 block">Rating</label>
                      <div>
                        <StarRating 
                          rating={rating} 
                          readonly={false} 
                          onRate={(val) => setRating(val)} 
                          size={20}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Comments</label>
                      <textarea
                        rows="4"
                        className="form-control rounded-0"
                        placeholder="Write your review comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-dark rounded-0 w-100 py-2 text-uppercase text-xs font-weight-bold"
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="border bg-light-gray p-4 text-center">
                  <p className="text-muted fs-7 mb-0">
                    Only logged-in customers can submit product reviews. <br />
                    <Link to="/login" className="text-ajio-red font-weight-bold text-decoration-none">Sign In here</Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-4">
            <h2 className="text-uppercase font-weight-black text-dark mb-4 letter-spacing-1 h4">
              YOU MAY ALSO LIKE
            </h2>
            <div className="row g-4 row-cols-2 row-cols-md-4">
              {relatedProducts.map((relProd) => (
                <div key={relProd.id} className="col">
                  {/* Reuse catalog style */}
                  <div className="card ajio-product-card h-100 border-0 rounded-0 bg-white shadow-sm p-2">
                    <Link to={`/products/${relProd.id}`} className="text-decoration-none text-dark d-block overflow-hidden mb-2">
                      <img 
                        src={relProd.imageUrl} 
                        alt={relProd.title} 
                        className="w-100 img-fluid"
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                    </Link>
                    <div className="product-artist-caps text-muted text-uppercase letter-spacing-1 fs-9 mb-1 font-weight-bold">{relProd.artistName}</div>
                    <h3 className="h6 text-truncate mb-2">
                      <Link to={`/products/${relProd.id}`} className="text-decoration-none text-dark hover-ajio-red">{relProd.title}</Link>
                    </h3>
                    <div className="text-ajio-red font-weight-bold fs-7">{formatCurrency(relProd.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
