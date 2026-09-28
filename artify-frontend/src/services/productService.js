import api from './api';

export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productRequest) => {
  try {
    const response = await api.post('/products', productRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productRequest) => {
  try {
    const response = await api.put(`/products/${id}`, productRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async (q, page = 0, size = 10) => {
  try {
    const response = await api.get('/products/search', { params: { q, page, size } });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductsByArtist = async (artistId) => {
  try {
    const response = await api.get(`/products/artist/${artistId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMyProducts = async () => {
  try {
    const response = await api.get('/products/mine');
    return response;
  } catch (error) {
    throw error;
  }
};
