import api from './api';

export const createReview = async (reviewRequest) => {
  try {
    const response = await api.post('/reviews', reviewRequest);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReviewsByProduct = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
