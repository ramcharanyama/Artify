import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaStar, FaRegStar } from 'react-icons/fa';

export const ProductFilter = ({ filters = {}, categories = [], onFilterChange }) => {
  const [sections, setSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const toggleSection = (section) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (categoryId) => {
    // If selecting the currently selected category, we clear it (de-select)
    const newCat = filters.category === categoryId ? null : categoryId;
    onFilterChange({ category: newCat });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    onFilterChange({
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
  };

  const handleClearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({
      category: null,
      minPrice: null,
      maxPrice: null,
      rating: null,
      search: '',
    });
  };

  return (
    <div className="ajio-filter-sidebar bg-white border p-4 rounded-0">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h4 className="fs-6 font-weight-bold text-uppercase mb-0 letter-spacing-1">FILTERS</h4>
        <button 
          onClick={handleClearAll}
          className="btn btn-link text-ajio-red text-decoration-none p-0 text-uppercase font-weight-bold text-xs"
        >
          Clear All
        </button>
      </div>

      {/* Categories Collapsible Section */}
      <div className="filter-section mb-4">
        <button 
          className="btn btn-link w-100 text-decoration-none text-dark d-flex justify-content-between align-items-center p-0 mb-3 border-0"
          onClick={() => toggleSection('categories')}
        >
          <span className="font-weight-bold text-uppercase fs-7 letter-spacing-1">CATEGORIES</span>
          {sections.categories ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        
        {sections.categories && (
          <div className="filter-content ps-1">
            {categories.map((cat) => (
              <div key={cat.id} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input rounded-0 filter-checkbox"
                  id={`cat-check-${cat.id}`}
                  checked={Number(filters.category) === cat.id}
                  onChange={() => handleCategorySelect(cat.id)}
                />
                <label className="form-check-label fs-7 cursor-pointer" htmlFor={`cat-check-${cat.id}`}>
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="filter-section mb-4 border-top pt-4">
        <button 
          className="btn btn-link w-100 text-decoration-none text-dark d-flex justify-content-between align-items-center p-0 mb-3 border-0"
          onClick={() => toggleSection('price')}
        >
          <span className="font-weight-bold text-uppercase fs-7 letter-spacing-1">PRICE RANGE</span>
          {sections.price ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        
        {sections.price && (
          <form onSubmit={handlePriceApply} className="filter-content ps-1">
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                className="form-control rounded-0 fs-7 py-2"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-muted fs-7">to</span>
              <input
                type="number"
                placeholder="Max"
                className="form-control rounded-0 fs-7 py-2"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-dark rounded-0 w-100 py-2 text-uppercase text-xs font-weight-bold">
              Apply Price
            </button>
          </form>
        )}
      </div>

      {/* Rating Section */}
      <div className="filter-section mb-4 border-top pt-4">
        <button 
          className="btn btn-link w-100 text-decoration-none text-dark d-flex justify-content-between align-items-center p-0 mb-3 border-0"
          onClick={() => toggleSection('rating')}
        >
          <span className="font-weight-bold text-uppercase fs-7 letter-spacing-1">RATING</span>
          {sections.rating ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        
        {sections.rating && (
          <div className="filter-content ps-1">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input rounded-0 filter-checkbox"
                  id={`rating-check-${stars}`}
                  checked={filters.rating === stars}
                  onChange={() => onFilterChange({ rating: filters.rating === stars ? null : stars })}
                />
                <label className="form-check-label fs-7 cursor-pointer d-flex align-items-center gap-1" htmlFor={`rating-check-${stars}`}>
                  <span className="d-flex text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < stars ? <FaStar key={i} /> : <FaRegStar key={i} />
                    ))}
                  </span>
                  {stars === 5 ? '' : '& Up'}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
