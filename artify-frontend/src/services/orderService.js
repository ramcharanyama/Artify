import api from './api';
import { dummyOrders, dummyCarts } from '../data/dummyData';

export const placeOrder = async (orderRequest) => {
  try {
    const response = await api.post('/orders', orderRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy placeOrder simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    // Simulating moving items from user's cart to order
    const cartIdx = dummyCarts.findIndex(c => c.userId === user.id);
    if (cartIdx === -1 || dummyCarts[cartIdx].items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    const cart = dummyCarts[cartIdx];
    const orderItems = cart.items.map((item, idx) => ({
      id: idx + 1,
      orderId: dummyOrders.length + 1,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      product: item.product,
    }));
    
    const newOrder = {
      id: dummyOrders.length + 1,
      userId: user.id,
      totalAmount: cart.totalAmount,
      status: 'PENDING',
      shippingAddress: orderRequest.shippingAddress,
      createdAt: new Date().toISOString(),
      items: orderItems,
    };
    
    dummyOrders.push(newOrder);
    
    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    
    return {
      success: true,
      message: 'Order placed successfully (Simulated)',
      data: newOrder,
    };
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy getOrders simulation', error);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('Not authenticated');
    
    const userOrders = dummyOrders.filter(o => o.userId === user.id);
    return userOrders;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy getOrderById simulation for id ${id}`, error);
    const order = dummyOrders.find(o => o.id === Number(id));
    if (order) {
      return {
        success: true,
        message: 'Order retrieved successfully (Simulated)',
        data: order,
      };
    }
    throw new Error('Order not found');
  }
};

export const cancelOrder = async (id) => {
  try {
    const response = await api.put(`/orders/${id}/cancel`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy cancelOrder simulation for id ${id}`, error);
    const orderIdx = dummyOrders.findIndex(o => o.id === Number(id));
    if (orderIdx !== -1) {
      const order = dummyOrders[orderIdx];
      if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
        order.status = 'CANCELLED';
        return {
          success: true,
          message: 'Order cancelled successfully (Simulated)',
          data: order,
        };
      }
      throw new Error('Order cannot be cancelled in its current state');
    }
    throw new Error('Order not found');
  }
};

export const trackOrder = async (id) => {
  try {
    const response = await api.get(`/orders/${id}/track`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy trackOrder simulation for id ${id}`, error);
    const order = dummyOrders.find(o => o.id === Number(id));
    if (order) {
      return {
        success: true,
        message: 'Order tracking info retrieved (Simulated)',
        data: order,
      };
    }
    throw new Error('Order not found');
  }
};
