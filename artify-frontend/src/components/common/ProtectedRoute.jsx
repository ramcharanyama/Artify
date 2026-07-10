import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the state to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // User is logged in but doesn't have the required role
    console.warn(`Access denied. User role: ${user?.role}, Required: ${allowedRoles}`);
    
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user?.role === 'ARTIST') {
      return <Navigate to="/dashboard/artist" replace />;
    } else {
      return <Navigate to="/dashboard/customer" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
