import api from './api';

export const placeOrder = async (orderRequest) => {
  try {
    const response = await api.post('/orders', orderRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.put(`/orders/${id}/cancel`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const trackOrder = async (id) => {
  try {
    const response = await api.get(`/orders/${id}/track`);
    return response;
  } catch (error) {
    throw error;
  }
};
