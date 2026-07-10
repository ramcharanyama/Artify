import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import * as categoryService from '../../services/categoryService';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Navbar category fetch failed', err);
      }
    };
    fetchCats();
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin';
    if (user?.role === 'ARTIST') return '/dashboard/artist';
    return '/dashboard/customer';
  };

  return (
    <header className="ajio-header sticky-top">
      {/* Top utility bar */}
      <div className="ajio-topbar d-none d-md-block">
        <div className="container-fluid d-flex justify-content-between align-items-center py-1 px-4">
          <span className="topbar-promo">FREE SHIPPING ON ARTWORKS OVER ₹15,000!</span>
          <div className="topbar-links">
            <Link to="/about">About Us</Link>
            <span className="mx-2 text-muted">|</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 px-3 px-md-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Mobile toggle */}
          <button 
            className="navbar-toggler border-0 p-0 text-dark d-lg-none" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="ajio-logo text-decoration-none">
            ARTIFY<span className="logo-dot">.</span>
          </Link>

          {/* Desktop Categories Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex flex-grow-0 ms-4" id="navbarNav">
            <ul className="navbar-nav gap-2">
              <li className="nav-item">
                <Link to="/products" className={`nav-link category-link ${location.pathname === '/products' && !location.search ? 'active' : ''}`}>
                  ALL ARTWORKS
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id} className="nav-item">
                  <Link 
                    to={`/products?category=${cat.id}`} 
                    className={`nav-link category-link ${location.search.includes(`category=${cat.id}`) ? 'active' : ''}`}
                  >
                    {cat.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Search bar */}
          <form className="ajio-search-form d-none d-md-flex position-relative mx-3" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search artists, paintings, digital art..."
              className="form-control rounded-pill search-input py-2 ps-4 pe-5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn search-btn position-absolute end-0 top-50 translate-middle-y me-3 bg-transparent border-0 text-muted">
              <FaSearch />
            </button>
          </form>

          {/* Right menu (Cart, profile, logout) */}
          <div className="ajio-nav-actions d-flex align-items-center gap-3">
            {/* Search toggler for mobile/small screen */}
            <Link to="/products" className="d-md-none text-dark p-2">
              <FaSearch size={18} />
            </Link>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="position-relative">
                <button 
                  className="btn btn-link text-dark text-decoration-none p-2 d-flex align-items-center gap-1 border-0"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <FaUser size={18} />
                  <span className="d-none d-md-inline user-nav-name">{user?.name?.split(' ')[0]}</span>
                </button>
                
                {profileDropdownOpen && (
                  <div className="ajio-profile-dropdown position-absolute end-0 mt-2 bg-white border shadow-sm rounded py-2 z-3" style={{ width: '180px' }}>
                    <Link to="/profile" className="dropdown-item py-2 px-3 text-dark">My Profile</Link>
                    <Link to={getDashboardLink()} className="dropdown-item py-2 px-3 text-dark">Dashboard</Link>
                    {user?.role === 'CUSTOMER' && (
                      <Link to="/orders" className="dropdown-item py-2 px-3 text-dark">Order History</Link>
                    )}
                    <hr className="my-1 text-muted" />
                    <button 
                      onClick={() => { logout(); navigate('/'); }}
                      className="dropdown-item py-2 px-3 text-danger border-0 bg-transparent w-100 text-start d-flex align-items-center gap-2"
                    >
                      <FaSignOutAlt size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-dark rounded-0 px-3 py-1 text-uppercase text-xs d-flex align-items-center gap-1">
                <FaUser size={14} /> <span className="d-none d-md-inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Icon (visible to customers and guest, hidden for admins/artists) */}
            {(!isAuthenticated || user?.role === 'CUSTOMER') && (
              <Link to="/cart" className="ajio-cart-icon position-relative text-dark p-2">
                <FaShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge badge rounded-circle bg-ajio-red text-white position-absolute translate-middle start-100 top-0 fs-7">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="mobile-side-menu d-lg-none position-fixed top-0 start-0 h-100 w-75 bg-white shadow z-3 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="ajio-logo text-decoration-none">ARTIFY</span>
            <button className="btn border-0 text-dark" onClick={() => setMobileMenuOpen(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                placeholder="Search..."
                className="form-control search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn position-absolute end-0 top-50 translate-middle-y text-muted border-0 bg-transparent">
                <FaSearch />
              </button>
            </form>
          </div>

          <ul className="list-unstyled mobile-nav-links">
            <li className="py-2 border-bottom">
              <Link to="/products" className="text-dark text-decoration-none d-block font-weight-bold">ALL ARTWORKS</Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="py-2 border-bottom">
                <Link to={`/products?category=${cat.id}`} className="text-dark text-decoration-none d-block">
                  {cat.name.toUpperCase()}
                </Link>
              </li>
            ))}
            <li className="py-2 border-bottom">
              <Link to="/about" className="text-dark text-decoration-none d-block">ABOUT US</Link>
            </li>
            <li className="py-2 border-bottom">
              <Link to="/contact" className="text-dark text-decoration-none d-block">CONTACT</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
