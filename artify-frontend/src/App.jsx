import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import ArtistDashboard from './pages/ArtistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Customer Only Protected Routes */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <OrderHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/customer" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Artist Only Protected Routes */}
            <Route 
              path="/dashboard/artist" 
              element={
                <ProtectedRoute allowedRoles={['ARTIST']}>
                  <ArtistDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Protected Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Authenticated Only Profile Route */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ARTIST', 'ADMIN']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        
        {/* Toast alerts feedback */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
