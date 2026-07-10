import React from 'react';
import ProductCard from './ProductCard';

export const ProductGrid = ({ products = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="col">
            <div className="ajio-skeleton-card card border-0 rounded-0 bg-white" style={{ height: '420px' }}>
              <div className="ajio-skeleton skeleton-image w-100" style={{ height: '300px' }}></div>
              <div className="card-body p-3">
                <div className="ajio-skeleton skeleton-text w-50 mb-2" style={{ height: '12px' }}></div>
                <div className="ajio-skeleton skeleton-text w-75 mb-3" style={{ height: '16px' }}></div>
                <div className="ajio-skeleton skeleton-text w-40 mb-3" style={{ height: '14px' }}></div>
                <div className="ajio-skeleton skeleton-btn w-100" style={{ height: '35px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5 bg-white border border-light mt-2">
        <h4 className="text-muted mb-3 font-weight-bold text-uppercase">No Artworks Found</h4>
        <p className="text-muted mb-0">Try adjusting your filters or search terms to find what you are looking for.</p>
      </div>
    );
  }

  return (
    <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4">
      {products.map((product) => (
        <div key={product.id} className="col">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
