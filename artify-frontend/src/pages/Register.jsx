import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateRequired, validatePhone } from '../utils/validators';
import { toast } from 'react-toastify';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect away
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    const nameCheck = validateRequired(name, 'Full name');
    const emailCheck = validateEmail(email);
    const passCheck = validatePassword(password);
    const phoneCheck = phone ? validatePhone(phone) : { isValid: true };
    
    const newErrors = {};
    if (!nameCheck.isValid) newErrors.name = nameCheck.message;
    if (!emailCheck.isValid) newErrors.email = emailCheck.message;
    if (!passCheck.isValid) newErrors.password = passCheck.message;
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!phoneCheck.isValid) newErrors.phone = phoneCheck.message;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    const result = await register({
      name,
      email,
      password,
      phone,
      role,
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-stretch p-0 bg-white">
      <div className="row g-0 w-100">
        
        {/* Left column - decorative promo graphic */}
        <div className="col-md-5 d-none d-md-flex flex-column justify-content-between p-5 text-white bg-dark-gray position-relative overflow-hidden" 
             style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="z-1">
            <Link to="/" className="ajio-logo text-white text-decoration-none">ARTIFY<span className="logo-dot">.</span></Link>
          </div>
          <div className="my-auto z-1" style={{ maxWidth: '350px' }}>
            <h2 className="text-uppercase font-weight-black mb-3 letter-spacing-1" style={{ fontSize: '2.5rem' }}>BECOME A CREATOR</h2>
            <p className="fs-7 text-white-50">Join our community of independent painters, illustrators, sculptors and photographers. Start showcasing and selling your artwork directly to collectors nationwide.</p>
          </div>
          <div className="z-1 fs-8 text-white-50">
            &copy; {new Date().getFullYear()} ARTIFY. All rights reserved.
          </div>
        </div>

        {/* Right column - Register Form */}
        <div className="col-md-7 d-flex align-items-center justify-content-center p-4 p-md-5 overflow-auto">
          <div className="w-100 py-4" style={{ maxWidth: '480px' }}>
            <h1 className="text-uppercase font-weight-black text-dark mb-2 letter-spacing-1 h3">CREATE ACCOUNT</h1>
            <p className="text-muted fs-7 mb-4">Register as a customer to buy art, or an artist to sell art.</p>

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Role selection radio buttons */}
              <div className="mb-4">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-2 block letter-spacing-1">Join As</label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input role-radio"
                      type="radio"
                      name="role"
                      id="roleCustomer"
                      value="CUSTOMER"
                      checked={role === 'CUSTOMER'}
                      onChange={() => setRole('CUSTOMER')}
                    />
                    <label className="form-check-label fs-7 cursor-pointer" htmlFor="roleCustomer">
                      Customer (Buyer)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input role-radio"
                      type="radio"
                      name="role"
                      id="roleArtist"
                      value="ARTIST"
                      checked={role === 'ARTIST'}
                      onChange={() => setRole('ARTIST')}
                    />
                    <label className="form-check-label fs-7 cursor-pointer" htmlFor="roleArtist">
                      Artist (Seller)
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group mb-3">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Full Name</label>
                <input
                  type="text"
                  className={`form-control rounded-0 py-2 ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="invalid-feedback fs-8">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Email Address</label>
                <input
                  type="email"
                  className={`form-control rounded-0 py-2 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback fs-8">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="form-group mb-3">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className={`form-control rounded-0 py-2 ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <div className="invalid-feedback fs-8">{errors.phone}</div>}
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Password</label>
                <input
                  type="password"
                  className={`form-control rounded-0 py-2 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="invalid-feedback fs-8">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="form-group mb-4">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control rounded-0 py-2 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="invalid-feedback fs-8">{errors.confirmPassword}</div>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-ajio-red rounded-0 w-100 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7 mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              {/* Login Redirect */}
              <p className="text-center text-muted fs-7 mb-0">
                Already have an account? <Link to="/login" className="text-ajio-red font-weight-bold text-decoration-none hover-underline">Sign In</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
