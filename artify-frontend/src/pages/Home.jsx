import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaPalette, FaCheckCircle, FaTruck, FaLock } from 'react-icons/fa';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import { dummyReviews } from '../data/dummyData';
import StarRating from '../components/common/StarRating';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catsRes, productsRes] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllProducts({ size: 4 })
        ]);
        setCategories(catsRes || []);
        
        // Handle both api direct response and paged response shapes
        const prodList = productsRes?.content || productsRes?.data?.content || productsRes?.data || productsRes || [];
        setFeaturedProducts(prodList.slice(0, 4));
      } catch (err) {
        console.error('Home data load error', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="ajio-homepage bg-light-gray">
      {/* Hero Banner */}
      <section className="ajio-hero-section position-relative bg-white border-bottom">
        <div className="container-fluid p-0">
          <div className="row g-0 align-items-center">
            <div className="col-md-6 p-5 p-lg-6 d-flex flex-column justify-content-center bg-white order-2 order-md-1">
              <span className="hero-badge text-uppercase text-ajio-red font-weight-bold letter-spacing-2 fs-7 mb-3">
                Exquisite Art Exhibition
              </span>
              <h1 className="hero-heading text-uppercase font-weight-black text-dark mb-4 letter-spacing-1" style={{ fontSize: '3rem', lineHeight: 1.1 }}>
                ORIGINAL ARTWORKS FROM INDIA'S FINEST ARTISTS
              </h1>
              <p className="text-muted fs-6 mb-5" style={{ maxWidth: '480px' }}>
                Discover original paintings, surreal digital illustrations, handcrafted bronze sculptures, and breathtaking landscape photographs curated for collectors.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-ajio-red rounded-0 px-5 py-3 text-uppercase font-weight-bold text-xs letter-spacing-1">
                  Shop Now
                </Link>
                <Link to="/about" className="btn btn-outline-dark rounded-0 px-4 py-3 text-uppercase font-weight-bold text-xs letter-spacing-1">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 position-relative" style={{ minHeight: '400px', backgroundColor: '#F8F8F8' }}>
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200" 
                alt="Featured Art exhibition" 
                className="w-100 img-fluid"
                style={{ height: '600px', objectFit: 'cover' }}
              />
              <div className="hero-image-overlay position-absolute bottom-0 end-0 bg-white p-3 m-4 shadow-sm border border-light">
                <span className="text-xs text-muted block mb-1">FEATURED ARTIST</span>
                <span className="font-weight-bold block text-dark">Ravi Kumar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promos strip */}
      <section className="bg-white border-bottom py-3 d-none d-lg-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FaCheckCircle className="text-ajio-red" />
            <span className="text-xs font-weight-bold text-uppercase text-dark letter-spacing-1">100% Authentic Artworks</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaTruck className="text-ajio-red" />
            <span className="text-xs font-weight-bold text-uppercase text-dark letter-spacing-1">Free Delivery Above ₹15,000</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaPalette className="text-ajio-red" />
            <span className="text-xs font-weight-bold text-uppercase text-dark letter-spacing-1">Verified Artist Portfolios</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaLock className="text-ajio-red" />
            <span className="text-xs font-weight-bold text-uppercase text-dark letter-spacing-1">Secure Online Checkout</span>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="py-5 bg-white border-bottom">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="text-uppercase font-weight-black text-dark mb-1 letter-spacing-1 h4">SHOP BY CATEGORY</h2>
              <span className="text-muted text-xs">Browse collections curated by medium</span>
            </div>
            <Link to="/products" className="text-ajio-red text-decoration-none font-weight-bold fs-7 text-uppercase letter-spacing-1 d-flex align-items-center gap-1">
              View All <FaChevronRight size={10} />
            </Link>
          </div>
          
          <div className="row g-4 justify-content-center">
            {categories.map((cat) => (
              <div key={cat.id} className="col-6 col-md-4 col-lg-2">
                <Link to={`/products?category=${cat.id}`} className="text-decoration-none text-dark text-center d-block group">
                  <div className="category-image-wrapper border overflow-hidden mb-3 mx-auto" style={{ width: '120px', height: '120px' }}>
                    <img 
                      src={cat.imageUrl || `https://placehold.co/120?text=${cat.name}`}
                      alt={cat.name} 
                      className="w-100 h-100 img-fluid hover-scale-11"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/120?text=${cat.name}`;
                      }}
                    />
                  </div>
                  <h3 className="fs-8 text-uppercase font-weight-bold letter-spacing-1 text-center m-0 group-hover-ajio-red">
                    {cat.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light-gray">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 className="text-uppercase font-weight-black text-dark mb-1 letter-spacing-1 h4">TRENDING ARTWORKS</h2>
              <span className="text-muted text-xs">Fresh listings from our verified creators</span>
            </div>
            <Link to="/products" className="text-ajio-red text-decoration-none font-weight-bold fs-7 text-uppercase letter-spacing-1 d-flex align-items-center gap-1">
              Explore Catalog <FaChevronRight size={10} />
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* Special Promo Grid */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-3">
          <h2 className="text-uppercase font-weight-black text-center text-dark mb-5 letter-spacing-1 h4">COLLECTOR EXCLUSIVES</h2>
          
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/products?category=2" className="text-decoration-none text-white d-block position-relative overflow-hidden promo-banner-box">
                <img 
                  src="https://images.unsplash.com/photo-1634017839464-5c339afa560d?w=800" 
                  alt="Cyberpunk collection" 
                  className="w-100 img-fluid hover-scale-105"
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 p-4 w-100 bg-gradient-dark">
                  <h3 className="h4 text-uppercase font-weight-black m-0 mb-1">CYBERPUNK & NEON</h3>
                  <p className="fs-8 text-white-50 m-0">Modern digital prints from futuristic creators. Click to shop.</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/products?category=1" className="text-decoration-none text-white d-block position-relative overflow-hidden promo-banner-box">
                <img 
                  src="https://images.unsplash.com/photo-1549490349-8643362247b5?w=800" 
                  alt="Traditional Canvas" 
                  className="w-100 img-fluid hover-scale-105"
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 p-4 w-100 bg-gradient-dark">
                  <h3 className="h4 text-uppercase font-weight-black m-0 mb-1">OIL & CANVASES</h3>
                  <p className="fs-8 text-white-50 m-0">Hand-painted fine canvases with rich landscape tones. Shop now.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-5 bg-light-gray">
        <div className="container py-3">
          <h2 className="text-uppercase font-weight-black text-center text-dark mb-5 letter-spacing-1 h4">COLLECTOR EXPERIENCES</h2>
          
          <div className="row g-4">
            {dummyReviews.map((rev) => (
              <div key={rev.id} className="col-md-4">
                <div className="card border-0 rounded-0 bg-white shadow-sm p-4 h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="user-avatar rounded-circle bg-dark-gray text-white d-flex align-items-center justify-content-center font-weight-bold fs-7 me-3" style={{ width: '40px', height: '40px' }}>
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="fs-7 font-weight-bold text-dark m-0">{rev.userName}</h4>
                      <span className="text-muted fs-8">Verified Collector</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <StarRating rating={rev.rating} />
                  </div>
                  <p className="text-muted fs-7 mb-0">"{rev.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
