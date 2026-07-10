import api from './api';
import { dummyCarts, dummyProducts } from '../data/dummyData';

// Helper to get or create a simulated cart for a user
const getSimulatedCart = (userId) => {
  let cart = dummyCarts.find(c => c.userId === Number(userId));
  if (!cart) {
    cart = {
      id: dummyCarts.length + 1,
      userId: Number(userId),
      items: [],
      totalAmount: 0,
    };
    dummyCarts.push(cart);
  }
  return cart;
};

// Helper to recalculate total amount
const recalculateTotal = (cart) => {
  cart.totalAmount = cart.items.reduce((total, item) => {
    return total + (item.product ? item.product.price * item.quantity : 0);
  }, 0);
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy getCart simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const cart = getSimulatedCart(user.id);
    return {
      success: true,
      message: 'Cart retrieved successfully (Simulated)',
      data: cart,
    };
  }
};

export const addToCart = async (cartItemRequest) => {
  try {
    const response = await api.post('/cart/items', cartItemRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy addToCart simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const cart = getSimulatedCart(user.id);
    const product = dummyProducts.find(p => p.id === Number(cartItemRequest.productId));
    if (!product) throw new Error('Product not found');
    
    const existingItem = cart.items.find(item => item.productId === Number(cartItemRequest.productId));
    if (existingItem) {
      existingItem.quantity += Number(cartItemRequest.quantity);
    } else {
      cart.items.push({
        id: Math.max(0, ...cart.items.map(i => i.id)) + 1,
        cartId: cart.id,
        productId: product.id,
        quantity: Number(cartItemRequest.quantity),
        product: product,
      });
    }
    
    recalculateTotal(cart);
    return {
      success: true,
      message: 'Item added to cart successfully (Simulated)',
      data: cart,
    };
  }
};

export const updateCartItem = async (itemId, cartItemRequest) => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, cartItemRequest);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy updateCartItem simulation for item ${itemId}`, error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const cart = getSimulatedCart(user.id);
    const item = cart.items.find(i => i.id === Number(itemId));
    if (item) {
      item.quantity = Number(cartItemRequest.quantity);
      recalculateTotal(cart);
      return {
        success: true,
        message: 'Cart item updated successfully (Simulated)',
        data: cart,
      };
    }
    throw new Error('Cart item not found');
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy removeFromCart simulation for item ${itemId}`, error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const cart = getSimulatedCart(user.id);
    const idx = cart.items.findIndex(i => i.id === Number(itemId));
    if (idx !== -1) {
      cart.items.splice(idx, 1);
      recalculateTotal(cart);
      return {
        success: true,
        message: 'Item removed from cart successfully (Simulated)',
        data: cart,
      };
    }
    throw new Error('Cart item not found');
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy clearCart simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const cart = getSimulatedCart(user.id);
    cart.items = [];
    cart.totalAmount = 0;
    return {
      success: true,
      message: 'Cart cleared successfully (Simulated)',
      data: null,
    };
  }
};
