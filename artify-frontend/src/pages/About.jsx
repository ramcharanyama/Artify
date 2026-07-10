import React from 'react';
import { FaPalette, FaUsers, FaGlobe, FaCertificate } from 'react-icons/fa';

export const About = () => {
  return (
    <div className="ajio-about bg-light-gray py-5">
      <div className="container py-4 bg-white border p-5 rounded-0">
        
        {/* Hero Section */}
        <div className="text-center mb-5 max-w-700 mx-auto">
          <span className="text-uppercase text-ajio-red font-weight-bold text-xs letter-spacing-2 mb-2 block">Our Story</span>
          <h1 className="text-uppercase font-weight-black text-dark mb-4 letter-spacing-1 h2">CONNECTING ARTISTS WITH CONNOISSEURS</h1>
          <p className="text-muted fs-6">
            Founded in 2025, ARTIFY is India's premier online destination for verified, authentic, and high-quality fine art. We believe art has the power to transform spaces and inspire minds, and that buying art should be as transparent and trustworthy as buying any other premium good.
          </p>
        </div>

        {/* Banner Image */}
        <div className="mb-5 overflow-hidden border">
          <img 
            src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200" 
            alt="Art Gallery Workspace" 
            className="w-100 img-fluid"
            style={{ height: '350px', objectFit: 'cover' }}
          />
        </div>

        {/* Mission Statement */}
        <div className="row g-4 mb-5 align-items-center">
          <div className="col-md-6">
            <h2 className="text-uppercase font-weight-bold text-dark mb-3 letter-spacing-1 h4">OUR MISSION</h2>
            <p className="text-muted fs-7">
              Our mission is twofold: to empower independent visual artists by providing them with a secure, global platform to monetize their talent, and to offer art lovers a curated, high-integrity marketplace where they can discover and purchase original creations with confidence.
            </p>
            <p className="text-muted fs-7">
              By removing complex intermediary networks, we return the majority of transaction revenues directly to the creators, helping build a sustainable ecosystem for artists, painters, sculptors, and digital creators.
            </p>
          </div>
          <div className="col-md-6 bg-light-gray p-4 border border-light">
            <h3 className="h6 text-uppercase font-weight-bold text-dark mb-3">WHY COLLECT WITH ARTIFY?</h3>
            <ul className="list-unstyled text-muted fs-7 mb-0">
              <li className="mb-2">✓ <strong>Verified Artists:</strong> Every seller is vetted through a review of their portfolio and credentials.</li>
              <li className="mb-2">✓ <strong>Certificate of Authenticity:</strong> All physical artworks ship with an artist-signed registry number.</li>
              <li className="mb-2">✓ <strong>Secure Shipments:</strong> Specialized crating and handling for museum-grade canvases.</li>
              <li className="mb-2">✓ <strong>Direct Support:</strong> 100% of the proceeds (less minor portal fees) support independent artists directly.</li>
            </ul>
          </div>
        </div>

        {/* Platform Milestones / Stats */}
        <div className="row g-4 mb-5 text-center border-top border-bottom py-4 my-5">
          <div className="col-6 col-md-3">
            <div className="text-ajio-red h3 font-weight-black m-0 mb-1">500+</div>
            <div className="text-uppercase text-xs font-weight-bold text-muted letter-spacing-1">Verified Artists</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-ajio-red h3 font-weight-black m-0 mb-1">10,000+</div>
            <div className="text-uppercase text-xs font-weight-bold text-muted letter-spacing-1">Artworks Listed</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-ajio-red h3 font-weight-black m-0 mb-1">12%</div>
            <div className="text-uppercase text-xs font-weight-bold text-muted letter-spacing-1">Fixed Portal Fee</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-ajio-red h3 font-weight-black m-0 mb-1">₹4.5Cr+</div>
            <div className="text-uppercase text-xs font-weight-bold text-muted letter-spacing-1">Artist Earnings</div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-uppercase font-weight-bold text-center text-dark mb-4 letter-spacing-1 h4">OUR VALUES</h2>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="bg-light-gray p-3 mb-3 inline-block rounded-0 text-ajio-red">
                <FaPalette size={20} />
              </div>
              <h3 className="h6 font-weight-bold text-dark text-uppercase">Creativity</h3>
              <p className="text-muted fs-8">Fostering diverse creative styles from cyber-art to oil landscapes.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="bg-light-gray p-3 mb-3 inline-block rounded-0 text-ajio-red">
                <FaCertificate size={20} />
              </div>
              <h3 className="h6 font-weight-bold text-dark text-uppercase">Authenticity</h3>
              <p className="text-muted fs-8">Direct provenance checking and high-resolution imaging transparency.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="bg-light-gray p-3 mb-3 inline-block rounded-0 text-ajio-red">
                <FaUsers size={20} />
              </div>
              <h3 className="h6 font-weight-bold text-dark text-uppercase">Community</h3>
              <p className="text-muted fs-8">Regular interactions between collectors, critics and visual creators.</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="bg-light-gray p-3 mb-3 inline-block rounded-0 text-ajio-red">
                <FaGlobe size={20} />
              </div>
              <h3 className="h6 font-weight-bold text-dark text-uppercase">Empowerment</h3>
              <p className="text-muted fs-8">Ensuring independent financial viability for contemporary artists.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
