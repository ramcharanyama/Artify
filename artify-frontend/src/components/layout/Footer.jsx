import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="ajio-footer bg-dark-gray text-light py-5 mt-auto border-top">
      <div className="container py-4">
        <div className="row g-4">
          {/* About Artify */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title text-uppercase mb-4 text-white letter-spacing-1">ARTIFY</h5>
            <p className="footer-desc text-muted fs-7">
              ARTIFY is India's premium e-commerce platform dedicated exclusively to original works of art. We connect passionate art lovers directly with verified independent artists from around the country.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title text-uppercase mb-4 text-white letter-spacing-1">Quick Links</h5>
            <ul className="list-unstyled footer-links fs-7">
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none">Explore Gallery</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none">Our Story</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none">Contact Support</Link></li>
              <li className="mb-2"><Link to="/register?role=ARTIST" className="text-muted text-decoration-none">Sell Art on Artify</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title text-uppercase mb-4 text-white letter-spacing-1">Shop By Categories</h5>
            <ul className="list-unstyled footer-links fs-7">
              <li className="mb-2"><Link to="/products?category=1" className="text-muted text-decoration-none">Paintings</Link></li>
              <li className="mb-2"><Link to="/products?category=2" className="text-muted text-decoration-none">Digital Art</Link></li>
              <li className="mb-2"><Link to="/products?category=3" className="text-muted text-decoration-none">Sculptures</Link></li>
              <li className="mb-2"><Link to="/products?category=4" className="text-muted text-decoration-none">Photography</Link></li>
              <li className="mb-2"><Link to="/products?category=5" className="text-muted text-decoration-none">Sketches</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title text-uppercase mb-4 text-white letter-spacing-1">Contact Info</h5>
            <ul className="list-unstyled text-muted fs-7">
              <li className="mb-2">Email: support@artify.com</li>
              <li className="mb-2">Phone: +91 90000 00000</li>
              <li className="mb-2">Address: 42 Gallery Road, Andheri West, Mumbai - 400053</li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <p className="text-muted fs-8 mb-0">&copy; {new Date().getFullYear()} ARTIFY. All rights reserved.</p>
          <div className="footer-payment-icons d-flex gap-3 text-muted fs-8">
            <span>SECURE PAYMENT:</span>
            <span>UPI</span>
            <span>|</span>
            <span>CREDIT CARD</span>
            <span>|</span>
            <span>NET BANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
