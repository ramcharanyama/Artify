import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light-gray text-ajio-dark">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
