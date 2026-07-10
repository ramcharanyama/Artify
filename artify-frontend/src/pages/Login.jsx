import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validateRequired } from '../utils/validators';
import { toast } from 'react-toastify';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    // Form validation
    const emailCheck = validateEmail(email);
    const passCheck = validateRequired(password, 'Password');
    
    const newErrors = {};
    if (!emailCheck.isValid) newErrors.email = emailCheck.message;
    if (!passCheck.isValid) newErrors.password = passCheck.message;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    const result = await login(email, password);
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Logged in successfully!');
      // Navigate to where they came from, or dashboard based on role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        const role = result.user?.role;
        if (role === 'ADMIN') {
          navigate('/dashboard/admin');
        } else if (role === 'ARTIST') {
          navigate('/dashboard/artist');
        } else {
          navigate('/dashboard/customer');
        }
      }
    } else {
      toast.error(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-stretch p-0 bg-white">
      <div className="row g-0 w-100">
        
        {/* Left column - decorative promo graphic */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white bg-dark-gray position-relative overflow-hidden" 
             style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1549490349-8643362247b5?w=800)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="z-1">
            <Link to="/" className="ajio-logo text-white text-decoration-none">ARTIFY<span className="logo-dot">.</span></Link>
          </div>
          <div className="my-auto z-1" style={{ maxWidth: '400px' }}>
            <h2 className="text-uppercase font-weight-black mb-3 letter-spacing-1" style={{ fontSize: '2.5rem' }}>COLLECT ART FROM THE SOURCE</h2>
            <p className="fs-7 text-white-50">Support independent creators across India. Buy verified, original, high-quality artworks directly from their studios.</p>
          </div>
          <div className="z-1 fs-8 text-white-50">
            &copy; {new Date().getFullYear()} ARTIFY. All rights reserved.
          </div>
        </div>

        {/* Right column - Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-4 p-md-5">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            <h1 className="text-uppercase font-weight-black text-dark mb-2 letter-spacing-1 h3">SIGN IN</h1>
            <p className="text-muted fs-7 mb-4">Please log in to continue shopping or managing your portfolio.</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-group mb-3">
                <label className="text-uppercase text-xs font-weight-bold text-dark mb-1 letter-spacing-1">Email Address</label>
                <input
                  type="email"
                  className={`form-control rounded-0 py-3 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback fs-8">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="form-group mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="text-uppercase text-xs font-weight-bold text-dark mb-0 letter-spacing-1">Password</label>
                  <a href="#forgot" className="text-muted text-xs text-decoration-none hover-ajio-red">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  className={`form-control rounded-0 py-3 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="invalid-feedback fs-8">{errors.password}</div>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-ajio-red rounded-0 w-100 py-3 text-uppercase font-weight-bold letter-spacing-1 fs-7 mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Register Redirect */}
              <p className="text-center text-muted fs-7 mb-0">
                New to Artify? <Link to="/register" className="text-ajio-red font-weight-bold text-decoration-none hover-underline">Create Account</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
