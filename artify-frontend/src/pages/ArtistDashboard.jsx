import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import StatsCard from '../components/dashboard/StatsCard';
import { FaPalette, FaGlobe, FaTag, FaStar, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

export const ArtistDashboard = () => {
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listing creation/editing state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState('1');
  const [status, setStatus] = useState('ACTIVE');

  const loadArtistData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [prodRes, catsRes] = await Promise.all([
        productService.getProductsByArtist(user.id),
        categoryService.getAllCategories(),
      ]);
      setProducts(prodRes || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error('Failed to load artist dashboard details', err);
      toast.error('Failed to retrieve portfolio details');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadArtistData();
  }, [loadArtistData]);

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setCategoryId(categories[0]?.id || '');
    setStock('1');
    setStatus('ACTIVE');
    setShowForm(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setImageUrl(prod.imageUrl);
    setCategoryId(prod.categoryId.toString());
    setStock(prod.stock.toString());
    setStatus(prod.status);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !price || !categoryId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      title,
      description,
      price: Number(price),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
      categoryId: Number(categoryId),
      stock: Number(stock),
      status,
    };

    try {
      let res;
      if (editingProduct) {
        res = await productService.updateProduct(editingProduct.id, payload);
      } else {
        res = await productService.createProduct(payload);
      }

      if (res.success) {
        toast.success(editingProduct ? 'Artwork listing updated!' : 'Artwork listed successfully!');
        setShowForm(false);
        setEditingProduct(null);
        loadArtistData(); // Refresh list
      } else {
        toast.error(res.message || 'Action failed');
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const res = await productService.deleteProduct(id);
        if (res.success) {
          toast.success('Listing deleted.');
          loadArtistData();
        } else {
          toast.error(res.message || 'Delete failed');
        }
      } catch (err) {
        toast.error(err.message || 'Delete operation failed');
      }
    }
  };

  // Metrics calculation
  const totalListings = products.length;
  const activeListings = products.filter(p => p.status === 'ACTIVE').length;
  const totalSalesCount = products.filter(p => p.status === 'SOLD').length;
  const simulatedSalesEarnings = products
    .filter(p => p.status === 'SOLD')
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="ajio-dashboard bg-light-gray py-4">
      <div className="container py-3">
        
        {/* Welcome greeting */}
        <div className="bg-white border p-4 mb-4 rounded-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="h4 text-uppercase font-weight-black text-dark mb-1 letter-spacing-1">
              ARTIST WORKSPACE: {user?.name?.toUpperCase()}
            </h1>
            <span className="text-muted fs-7">Exhibit, update, and manage your portfolio of original creations.</span>
          </div>
          
          {!showForm && (
            <button 
              onClick={handleOpenCreateForm}
              className="btn btn-ajio-red rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs letter-spacing-1 d-flex align-items-center gap-2"
            >
              <FaPlus size={10} /> Add New Artwork
            </button>
          )}
        </div>

        {/* Form area: Create / Edit Product */}
        {showForm && (
          <div className="bg-white border p-4 mb-4 rounded-0">
            <h2 className="fs-6 font-weight-bold text-uppercase pb-2 border-bottom mb-4 letter-spacing-1">
              {editingProduct ? 'EDIT ARTWORK LISTING' : 'LIST NEW ARTWORK'}
            </h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3 mb-4">
                {/* Title */}
                <div className="col-md-6 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Artwork Title *</label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    placeholder="e.g. Monsoon Dreams"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Medium/Category *</label>
                  <select
                    className="form-select rounded-0"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="col-md-4 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Stock */}
                <div className="col-md-4 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control rounded-0"
                    placeholder="1"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-md-4 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Listing Status</label>
                  <select
                    className="form-select rounded-0"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="col-12 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Artwork Image URL</label>
                  <input
                    type="text"
                    className="form-control rounded-0"
                    placeholder="https://example.com/artwork-image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="col-12 form-group">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Description / Artistic Narrative</label>
                  <textarea
                    rows="4"
                    className="form-control rounded-0"
                    placeholder="Write details of mediums, paint styles used and narratives..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="text-end d-flex justify-content-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setShowForm(false); setEditingProduct(null); }}
                  className="btn btn-outline-dark rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-ajio-red rounded-0 px-4 py-2 text-uppercase font-weight-bold text-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats KPIs row */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaPalette}
              label="Total Listed"
              value={totalListings}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaGlobe}
              label="Active Gallery"
              value={activeListings}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaTag}
              label="Artworks Sold"
              value={totalSalesCount}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaStar}
              label="Avg Star Rating"
              value="4.5"
            />
          </div>
        </div>

        {/* My Artworks Table */}
        <div className="bg-white border p-4 rounded-0 mb-4">
          <h2 className="fs-6 font-weight-bold text-uppercase pb-3 border-bottom mb-4 letter-spacing-1">
            MY PORTFOLIO LISTINGS
          </h2>
          
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading gallery...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              You haven't listed any artworks yet. Click "Add New Artwork" to get started.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-xs">
                <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
                  <tr>
                    <th className="py-3 ps-4">Image</th>
                    <th className="py-3">Title</th>
                    <th className="py-3">Price</th>
                    <th className="py-3 text-center">Stock</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-center pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="ps-4 py-2">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.title} 
                          style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                          className="border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x400?text=Art';
                          }}
                        />
                      </td>
                      <td className="py-2 font-weight-bold">{prod.title}</td>
                      <td className="py-2 text-ajio-red font-weight-bold">{formatCurrency(prod.price)}</td>
                      <td className="py-2 text-center">{prod.stock}</td>
                      <td className="py-2 text-center">
                        <span className={`badge rounded-0 bg-dark-gray text-uppercase px-2 py-1`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-2 text-center pe-4">
                        <div className="d-flex justify-content-center gap-2">
                          <button 
                            onClick={() => handleOpenEditForm(prod)}
                            className="btn btn-sm btn-outline-dark rounded-0 p-1 px-2 d-flex align-items-center gap-1"
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="btn btn-sm btn-outline-danger rounded-0 p-1 px-2 d-flex align-items-center gap-1"
                          >
                            <FaTrash size={10} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ArtistDashboard;
