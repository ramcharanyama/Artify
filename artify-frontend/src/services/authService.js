import api from './api';
import { dummyUsers } from '../data/dummyData';

export const register = async (registerRequest) => {
  try {
    const response = await api.post('/auth/register', registerRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy register simulation', error);
    // Simulating response
    const newUser = {
      id: dummyUsers.length + 1,
      email: registerRequest.email,
      name: registerRequest.name,
      phone: registerRequest.phone || '',
      address: registerRequest.address || '',
      avatarUrl: null,
      role: registerRequest.role || 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    dummyUsers.push(newUser);
    return {
      success: true,
      message: 'Registration successful (Simulated)',
      data: {
        token: 'simulated-jwt-token-' + newUser.id,
        tokenType: 'Bearer',
        user: newUser,
      },
    };
  }
};

export const login = async (loginRequest) => {
  try {
    const response = await api.post('/auth/login', loginRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy login simulation', error);
    const user = dummyUsers.find(
      (u) => u.email.toLowerCase() === loginRequest.email.toLowerCase()
    );
    if (user) {
      return {
        success: true,
        message: 'Login successful (Simulated)',
        data: {
          token: 'simulated-jwt-token-' + user.id,
          tokenType: 'Bearer',
          user: user,
        },
      };
    }
    throw new Error('Invalid email or password');
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy getProfile simulation', error);
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      const user = dummyUsers.find((u) => u.id === savedUser.id) || savedUser;
      return {
        success: true,
        message: 'Profile retrieved (Simulated)',
        data: user,
      };
    }
    throw new Error('Not authenticated');
  }
};

export const updateProfile = async (profileUpdateRequest) => {
  try {
    const response = await api.put('/auth/profile', profileUpdateRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy updateProfile simulation', error);
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) throw new Error('Not authenticated');
    
    const userIdx = dummyUsers.findIndex((u) => u.id === savedUser.id);
    const updatedUser = {
      ...savedUser,
      ...profileUpdateRequest,
    };
    if (userIdx !== -1) {
      dummyUsers[userIdx] = updatedUser;
    }
    return {
      success: true,
      message: 'Profile updated (Simulated)',
      data: updatedUser,
    };
  }
};
