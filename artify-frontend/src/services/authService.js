import api from './api';

export const register = async (registerRequest) => {
  try {
    const response = await api.post('/auth/register', registerRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (loginRequest) => {
  try {
    const response = await api.post('/auth/login', loginRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileUpdateRequest) => {
  try {
    const response = await api.put('/auth/profile', profileUpdateRequest);
    return response;
  } catch (error) {
    throw error;
  }
};
