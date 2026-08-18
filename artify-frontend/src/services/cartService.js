import api from './api';

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (cartItemRequest) => {
  try {
    const response = await api.post('/cart/items', cartItemRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (itemId, cartItemRequest) => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, cartItemRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response;
  } catch (error) {
    throw error;
  }
};
