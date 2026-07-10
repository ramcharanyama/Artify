import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import ProductFilter from '../components/product/ProductFilter';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import { SORT_OPTIONS } from '../utils/constants';

export const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const size = 12; // Catalog default size

  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || null,
    minPrice: searchParams.get('minPrice') || null,
    maxPrice: searchParams.get('maxPrice') || null,
    rating: searchParams.get('rating') || null,
    search: searchParams.get('search') || '',
  });

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Sync state filters with URL query parameters
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || null,
      minPrice: searchParams.get('minPrice') || null,
      maxPrice: searchParams.get('maxPrice') || null,
      rating: searchParams.get('rating') || null,
      search: searchParams.get('search') || '',
    });
    setPage(0); // Reset page on query parameter changes
  }, [searchParams]);

  // Load categories list once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Catalog category fetch error', err);
      }
    };
    fetchCats();
  }, []);

  const fetchArtworks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDir,
        category: filters.category,
        search: filters.search || null,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      };

      // Call API
      const response = await productService.getAllProducts(params);
      
      // Handle both raw backend DTO shapes and simulated wrapper shapes
      if (response) {
        const prodContent = response.content || response.data?.content || response.data || [];
        setProducts(prodContent);
        setTotalPages(response.totalPages ?? 1);
        setTotalElements(response.totalElements ?? prodContent.length);
      }
    } catch (err) {
      console.error('Failed to fetch catalog artworks', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, sortBy, sortDir, filters]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Sync to URL
    const query = {};
    if (updated.category) query.category = updated.category;
    if (updated.search) query.search = updated.search;
    if (updated.minPrice) query.minPrice = updated.minPrice;
    if (updated.maxPrice) query.maxPrice = updated.maxPrice;
    if (updated.rating) query.rating = updated.rating;
    
    setSearchParams(query);
  };

  const handleSortChange = (e) => {
    const [field, dir] = e.target.value.split(',');
    setSortBy(field);
    setSortDir(dir);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ajio-catalog-page bg-light-gray py-4">
      <div className="container py-3">
        {/* Top header search status */}
        <div className="bg-white border p-4 mb-4 rounded-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div>
            <h1 className="h4 text-uppercase font-weight-black text-dark mb-1 letter-spacing-1">
              {filters.search ? `SEARCH RESULTS FOR "${filters.search.toUpperCase()}"` : 'EXPLORE ART GALLERY'}
            </h1>
            <span className="text-muted fs-7">
              Showing {products.length} of {totalElements} artworks
            </span>
          </div>

          {/* Sort dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label className="text-uppercase text-xs font-weight-bold text-dark mb-0 letter-spacing-1 flex-shrink-0">
              Sort By:
            </label>
            <select 
              className="form-select rounded-0 py-2 border fs-7" 
              style={{ minWidth: '200px' }}
              value={`${sortBy},${sortDir}`}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sidebar + Main Grid */}
        <div className="row g-4">
          <div className="col-lg-3">
            <ProductFilter
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-lg-9">
            <ProductGrid products={products} isLoading={isLoading} />
            
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
