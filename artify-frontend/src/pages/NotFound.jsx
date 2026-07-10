import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <div className="container py-5 text-center min-vh-60 d-flex flex-column align-items-center justify-content-center bg-white border mt-4">
      <div className="text-ajio-red mb-3">
        <FaExclamationTriangle size={48} />
      </div>
      <h1 className="text-uppercase font-weight-black text-dark mb-2 letter-spacing-1 h3">
        404 — ARTWORK NOT FOUND
      </h1>
      <p className="text-muted fs-7 mb-4" style={{ maxWidth: '400px' }}>
        The gallery exhibit you are looking for has been sold, removed, or the link you followed is incorrect.
      </p>
      <Link to="/" className="btn btn-ajio-red rounded-0 px-4 py-3 text-uppercase font-weight-bold text-xs letter-spacing-1">
        Return To Main Gallery
      </Link>
    </div>
  );
};

export default NotFound;
