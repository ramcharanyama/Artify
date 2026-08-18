import api from './api';

export const getAllProducts = async (params = {}) => {
  try {
    const raw = await api.get('/products', { params });
    // Normalize payload: `api` response interceptor may return `response.data` directly.
    const payload = raw && raw.data ? raw.data : raw;
    console.log('productService.getAllProducts raw response:', raw);
    return payload;
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
