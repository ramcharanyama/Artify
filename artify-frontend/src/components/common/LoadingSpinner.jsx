import React from 'react';

export const LoadingSpinner = ({ fullPage = false }) => {
  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="ajio-spinner border-ajio-red mb-3"></div>
      <span className="text-muted text-uppercase text-xs font-weight-bold letter-spacing-1">
        Loading Artify...
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex align-items-center justify-content-center z-3"
        style={{ opacity: 0.95 }}
      >
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
