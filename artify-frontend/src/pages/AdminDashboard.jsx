import React, { useState, useEffect, useCallback } from 'react';
import * as adminService from '../services/adminService';
import * as artistService from '../services/artistService';
import * as categoryService from '../services/categoryService';
import StatsCard from '../components/dashboard/StatsCard';
import { FaUsers, FaBox, FaShoppingBag, FaRupeeSign, FaCheck, FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [summary, setSummary] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category State Form
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sumRes, usersRes, prodRes, artistsRes, catsRes] = await Promise.all([
        adminService.getReportSummary(),
        adminService.getAllUsers(),
        adminService.getAllAdminProducts(0, 50),
        artistService.getAllArtists(),
        categoryService.getAllCategories(),
      ]);

      if (sumRes.success) setSummary(sumRes.data || {});
      setUsers(usersRes || []);
      
      const prodContent = prodRes?.content || prodRes?.data?.content || prodRes?.data || prodRes || [];
      setProducts(prodContent);
      setArtists(artistsRes || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error('Failed to load admin workspace data', err);
      toast.error('Failed to load admin statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(`User role updated to ${newRole}`);
        loadData();
      } else {
        toast.error(res.message || 'Failed to update role');
      }
    } catch (err) {
      toast.error(err.message || 'Role change failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
      try {
        const res = await adminService.deleteUser(userId);
        if (res.success) {
          toast.success('User deleted successfully.');
          loadData();
        } else {
          toast.error(res.message || 'Delete failed');
        }
      } catch (err) {
        toast.error(err.message || 'Delete error');
      }
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Are you sure you want to delete this artwork listing?')) {
      try {
        const res = await adminService.deleteAdminProduct(prodId);
        if (res.success) {
          toast.success('Listing deleted.');
          loadData();
        } else {
          toast.error(res.message || 'Delete failed');
        }
      } catch (err) {
        toast.error(err.message || 'Delete error');
      }
    }
  };

  const handleVerifyArtist = async (artistId) => {
    try {
      const res = await artistService.verifyArtist(artistId);
      if (res.success) {
        toast.success('Artist profile verified successfully!');
        loadData();
      } else {
        toast.error(res.message || 'Verification failed');
      }
    } catch (err) {
      toast.error(err.message || 'Verification error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error('Category name is required.');
      return;
    }

    try {
      const res = await categoryService.createCategory({
        name: catName,
        description: catDesc,
        imageUrl: catImg,
      });

      if (res.success) {
        toast.success('New category created!');
        setCatName('');
        setCatDesc('');
        setCatImg('');
        setShowCatForm(false);
        loadData();
      } else {
        toast.error(res.message || 'Failed to create category');
      }
    } catch (err) {
      toast.error(err.message || 'Category creation error');
    }
  };

  return (
    <div className="ajio-dashboard bg-light-gray py-4">
      <div className="container py-3">
        
        {/* Welcome greeting */}
        <div className="bg-white border p-4 mb-4 rounded-0">
          <h1 className="h4 text-uppercase font-weight-black text-dark mb-1 letter-spacing-1">
            PORTAL ADMINISTRATION CONSOLE
          </h1>
          <span className="text-muted fs-7">Control user directories, verify artist portfolios, create categories, and inspect platform reports.</span>
        </div>

        {/* Stats KPIs row */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaUsers}
              label="Total Accounts"
              value={summary.totalUsers || 0}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaBox}
              label="Listed Artworks"
              value={summary.totalProducts || 0}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaShoppingBag}
              label="Total Transactions"
              value={summary.totalOrders || 0}
            />
          </div>
          <div className="col-md-3 col-6">
            <StatsCard
              icon={FaRupeeSign}
              label="Gross Value (GMV)"
              value={formatCurrency(summary.totalRevenue || 0)}
            />
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="bg-white border mb-4 rounded-0">
          <div className="d-flex border-bottom fs-8 font-weight-bold text-uppercase letter-spacing-1">
            {['users', 'products', 'artists', 'categories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn border-0 rounded-0 py-3 px-4 text-dark ${
                  activeTab === tab 
                    ? 'border-bottom border-ajio-red border-3 text-ajio-red font-weight-black' 
                    : 'bg-transparent text-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading console data...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle text-xs">
                      <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
                        <tr>
                          <th className="py-3 ps-4">ID</th>
                          <th className="py-3">Name</th>
                          <th className="py-3">Email</th>
                          <th className="py-3">Role</th>
                          <th className="py-3 text-center pe-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td className="ps-4 py-3">#{u.id}</td>
                            <td className="py-3 font-weight-bold">{u.name}</td>
                            <td className="py-3 text-muted">{u.email}</td>
                            <td className="py-3">
                              <select
                                className="form-select form-select-sm rounded-0 w-auto text-xs"
                                value={u.role}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                              >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="ARTIST">ARTIST</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                            <td className="py-3 text-center pe-4">
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                className="btn btn-sm btn-outline-danger rounded-0 px-2 py-1"
                              >
                                <FaTrash size={10} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle text-xs">
                      <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
                        <tr>
                          <th className="py-3 ps-4">Thumbnail</th>
                          <th className="py-3">Title</th>
                          <th className="py-3">Artist</th>
                          <th className="py-3">Price</th>
                          <th className="py-3 text-center">Status</th>
                          <th className="py-3 text-center pe-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id}>
                            <td className="ps-4 py-2">
                              <img 
                                src={p.imageUrl} 
                                alt={p.title} 
                                style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                                className="border"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/600x400?text=Art';
                                }}
                              />
                            </td>
                            <td className="py-2 font-weight-bold">{p.title}</td>
                            <td className="py-2 text-muted">{p.artistName}</td>
                            <td className="py-2 text-ajio-red font-weight-bold">{formatCurrency(p.price)}</td>
                            <td className="py-2 text-center">
                              <span className="badge rounded-0 bg-dark-gray text-uppercase px-2 py-1 fs-8">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-2 text-center pe-4">
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="btn btn-sm btn-outline-danger rounded-0 px-2 py-1"
                              >
                                <FaTrash size={10} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Artists Verification Tab */}
                {activeTab === 'artists' && (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle text-xs">
                      <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
                        <tr>
                          <th className="py-3 ps-4">Artist Name</th>
                          <th className="py-3">Bio Description</th>
                          <th className="py-3">Portfolio</th>
                          <th className="py-3 text-center">Verification</th>
                          <th className="py-3 text-center pe-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artists.map(a => (
                          <tr key={a.id}>
                            <td className="ps-4 py-3 font-weight-bold">{a.user?.name || `Artist #${a.id}`}</td>
                            <td className="py-3 text-muted text-truncate" style={{ maxWidth: '280px' }}>{a.bio || 'No bio'}</td>
                            <td className="py-3">
                              {a.portfolioUrl ? (
                                <a href={a.portfolioUrl} target="_blank" rel="noreferrer" className="text-ajio-red text-decoration-none">
                                  Link
                                </a>
                              ) : 'None'}
                            </td>
                            <td className="py-3 text-center">
                              <span className={`badge rounded-0 py-1 px-2 ${a.isVerified ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {a.isVerified ? 'VERIFIED' : 'PENDING'}
                              </span>
                            </td>
                            <td className="py-3 text-center pe-4">
                              {!a.isVerified && (
                                <button 
                                  onClick={() => handleVerifyArtist(a.id)}
                                  className="btn btn-sm btn-outline-success rounded-0 px-2 py-1 d-inline-flex align-items-center gap-1"
                                >
                                  <FaCheck size={8} /> Verify Portfolio
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div>
                    {/* Add Category Form Trigger */}
                    {!showCatForm ? (
                      <button 
                        onClick={() => setShowCatForm(true)}
                        className="btn btn-dark btn-sm rounded-0 px-3 py-2 text-uppercase font-weight-bold mb-4"
                      >
                        <FaPlus size={10} className="me-2" /> Add Category
                      </button>
                    ) : (
                      <form onSubmit={handleCreateCategory} className="border p-4 mb-4 bg-light-gray">
                        <h3 className="fs-7 font-weight-bold text-uppercase mb-3">CREATE NEW MEDIUM</h3>
                        <div className="row g-3 mb-3">
                          <div className="col-md-6">
                            <label className="text-uppercase text-xs font-weight-bold mb-1">Name</label>
                            <input 
                              type="text" 
                              className="form-control rounded-0"
                              value={catName}
                              onChange={(e) => setCatName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="text-uppercase text-xs font-weight-bold mb-1">Image URL</label>
                            <input 
                              type="text" 
                              className="form-control rounded-0"
                              value={catImg}
                              onChange={(e) => setCatImg(e.target.value)}
                            />
                          </div>
                          <div className="col-12">
                            <label className="text-uppercase text-xs font-weight-bold mb-1">Description</label>
                            <textarea 
                              rows="2" 
                              className="form-control rounded-0"
                              value={catDesc}
                              onChange={(e) => setCatDesc(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            type="button" 
                            className="btn btn-outline-dark rounded-0 btn-sm text-uppercase font-weight-bold px-3"
                            onClick={() => setShowCatForm(false)}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-ajio-red rounded-0 btn-sm text-uppercase font-weight-bold px-3 d-flex align-items-center gap-1"
                          >
                            <FaSave size={10} /> Create Medium
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Categories Table List */}
                    <div className="table-responsive">
                      <table className="table align-middle text-xs">
                        <thead className="table-dark-gray text-white text-uppercase fs-8 letter-spacing-1">
                          <tr>
                            <th className="py-3 ps-4">Image</th>
                            <th className="py-3">Name</th>
                            <th className="py-3">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(c => (
                            <tr key={c.id}>
                              <td className="ps-4 py-2">
                                <img 
                                  src={c.imageUrl} 
                                  alt={c.name} 
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="border rounded-circle"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/120?text=Medium';
                                  }}
                                />
                              </td>
                              <td className="py-2 font-weight-bold">{c.name}</td>
                              <td className="py-2 text-muted">{c.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
