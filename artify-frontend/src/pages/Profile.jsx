import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validateRequired, validatePhone } from '../utils/validators';
import { toast } from 'react-toastify';
import { getInitials } from '../utils/formatters';

export const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Artist specific profiles
  const [bio, setBio] = useState(user?.bio || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameCheck = validateRequired(name, 'Full Name');
    const phoneCheck = phone ? validatePhone(phone) : { isValid: true };

    const newErrors = {};
    if (!nameCheck.isValid) newErrors.name = nameCheck.message;
    if (!phoneCheck.isValid) newErrors.phone = phoneCheck.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const updateRequest = {
      name,
      phone,
      address,
      avatarUrl,
    };

    if (user?.role === 'ARTIST') {
      updateRequest.bio = bio;
      updateRequest.portfolioUrl = portfolioUrl;
    }

    const res = await updateProfile(updateRequest);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Profile updated successfully.');
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ajio-profile-page bg-light-gray py-5">
      <div className="container py-3 max-w-800 mx-auto">
        <div className="bg-white border p-5 rounded-0 shadow-sm">
          
          {/* Header */}
          <div className="d-flex align-items-center mb-5 pb-4 border-bottom">
            <div className="profile-avatar-circle rounded-circle bg-dark-gray text-white d-flex align-items-center justify-content-center font-weight-black fs-4 me-4" style={{ width: '80px', height: '80px' }}>
              {getInitials(name)}
            </div>
            <div>
              <h1 className="h4 text-uppercase font-weight-black text-dark mb-1 letter-spacing-1">{user?.name}</h1>
              <span className="badge bg-ajio-red rounded-0 text-uppercase fs-8 px-2 py-1 font-weight-bold">{user?.role} ACCOUNT</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <h2 className="fs-6 font-weight-bold text-uppercase pb-2 border-bottom mb-4 letter-spacing-1">
              ACCOUNT INFORMATION
            </h2>

            <div className="row g-3 mb-5">
              {/* Name */}
              <div className="col-md-6 form-group">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Full Name</label>
                <input
                  type="text"
                  className={`form-control rounded-0 py-2 ${errors.name ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="invalid-feedback fs-8">{errors.name}</div>}
              </div>

              {/* Email (Readonly) */}
              <div className="col-md-6 form-group">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control rounded-0 py-2 bg-light-gray"
                  value={user?.email}
                  readOnly
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 form-group">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Phone Number</label>
                <input
                  type="tel"
                  className={`form-control rounded-0 py-2 ${errors.phone ? 'is-invalid' : ''}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <div className="invalid-feedback fs-8">{errors.phone}</div>}
              </div>

              {/* Avatar Url */}
              <div className="col-md-6 form-group">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Avatar Image URL</label>
                <input
                  type="text"
                  className="form-control rounded-0 py-2"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Address */}
              <div className="col-12 form-group">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Default Shipping Address</label>
                <textarea
                  rows="3"
                  className="form-control rounded-0"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter shipping address"
                />
              </div>
            </div>

            {/* Artist Profile Fields */}
            {user?.role === 'ARTIST' && (
              <>
                <h2 className="fs-6 font-weight-bold text-uppercase pb-2 border-bottom mb-4 letter-spacing-1">
                  ARTIST PORTFOLIO DETAILS
                </h2>

                <div className="row g-3 mb-4">
                  {/* Portfolio URL */}
                  <div className="col-12 form-group">
                    <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Portfolio URL</label>
                    <input
                      type="url"
                      className="form-control rounded-0 py-2"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://myportfolio.com"
                    />
                  </div>

                  {/* Bio */}
                  <div className="col-12 form-group">
                    <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Artist Biography</label>
                    <textarea
                      rows="4"
                      className="form-control rounded-0"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write details of your artistic mediums and history..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit button */}
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-ajio-red rounded-0 px-4 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;
