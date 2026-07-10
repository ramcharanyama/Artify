import api from './api';
import { dummyReviews } from '../data/dummyData';

export const createReview = async (reviewRequest) => {
  try {
    const response = await api.post('/reviews', reviewRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy createReview simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    // Check if user already reviewed this product
    const existing = dummyReviews.find(r => r.userId === user.id && r.productId === Number(reviewRequest.productId));
    if (existing) throw new Error('You have already reviewed this product');

    const newReview = {
      id: dummyReviews.length + 1,
      userId: user.id,
      productId: Number(reviewRequest.productId),
      rating: Number(reviewRequest.rating),
      comment: reviewRequest.comment,
      createdAt: new Date().toISOString(),
      userName: user.name || 'Anonymous',
    };
    
    dummyReviews.push(newReview);
    return {
      success: true,
      message: 'Review created successfully (Simulated)',
      data: newReview,
    };
  }
};

export const getReviewsByProduct = async (productId) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy getReviewsByProduct for product ${productId}`, error);
    const reviews = dummyReviews.filter(r => r.productId === Number(productId));
    return reviews;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy deleteReview for id ${id}`, error);
    const idx = dummyReviews.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      dummyReviews.splice(idx, 1);
      return {
        success: true,
        message: 'Review deleted successfully (Simulated)',
        data: null,
      };
    }
    throw new Error('Review not found');
  }
};
