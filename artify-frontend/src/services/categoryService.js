import api from './api';

export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (categoryRequest) => {
  try {
    const response = await api.post('/categories', categoryRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, categoryRequest) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryRequest);
    return response;
  } catch (error) {
    throw error;
  }
};
