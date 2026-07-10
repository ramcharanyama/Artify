import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          
          // Optionally fetch fresh profile info from backend to verify token validity
          const profileRes = await authService.getProfile();
          if (profileRes.success && profileRes.data) {
            setUser(profileRes.data);
            localStorage.setItem('user', JSON.stringify(profileRes.data));
          }
        } catch (error) {
          console.warn('Failed to verify session, logging out', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        const { token: jwtToken, user: userData } = response.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error('Login error in AuthContext', error);
      return { success: false, message: error.message || 'Invalid email or password' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(registerData);
      if (response.success && response.data) {
        // If registering automatically logs the user in
        const { token: jwtToken, user: userData } = response.data;
        if (jwtToken && userData) {
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('user', JSON.stringify(userData));
          setToken(jwtToken);
          setUser(userData);
          setIsAuthenticated(true);
        }
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error in AuthContext', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success && response.data) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Update profile error in AuthContext', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
