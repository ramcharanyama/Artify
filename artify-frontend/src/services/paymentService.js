import api from './api';

export const processPayment = async (paymentRequest) => {
  try {
    const response = await api.post('/payments/process', paymentRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPaymentByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/payments/${orderId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
