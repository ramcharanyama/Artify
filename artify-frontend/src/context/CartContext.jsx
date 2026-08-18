import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const fetchCart = useCallback(async () => {
    // Only fetch cart for authenticated CUSTOMER users
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      // Expect service to either return the data or throw on error
      if (response && response.data) {
        setCart(response.data);
      } else if (response && response.items) {
        // Some services may return the cart object directly
        setCart(response);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching cart in context', error);
      setError(error.message || 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }
    setIsLoading(true);
    try {
      const response = await cartService.addToCart({ productId, quantity });
      if (response && response.data) {
        setCart(response.data);
        setError(null);
        return { success: true };
      }
      return { success: false, message: response?.message || 'Failed to add item' };
    } catch (error) {
      console.error('Error adding to cart', error);
      setError(error.message || 'Failed to add item');
      return { success: false, message: error.message || 'Failed to add item' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQty = async (itemId, quantity) => {
    if (!isAuthenticated) return { success: false };
    setIsLoading(true);
    try {
      const response = await cartService.updateCartItem(itemId, { quantity });
      if (response && response.data) {
        setCart(response.data);
        setError(null);
        return { success: true };
      }
      return { success: false, message: response?.message || 'Failed to update quantity' };
    } catch (error) {
      console.error('Error updating cart quantity', error);
      setError(error.message || 'Failed to update quantity');
      return { success: false, message: error.message || 'Failed to update quantity' };
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) return { success: false };
    setIsLoading(true);
    try {
      const response = await cartService.removeFromCart(itemId);
      if (response && response.data) {
        setCart(response.data);
        setError(null);
        return { success: true };
      }
      return { success: false, message: response?.message || 'Failed to remove item' };
    } catch (error) {
      console.error('Error removing cart item', error);
      setError(error.message || 'Failed to remove item');
      return { success: false, message: error.message || 'Failed to remove item' };
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await cartService.clearCart();
      if (response && response.success) {
        setCart({ items: [], totalAmount: 0 });
        setError(null);
      }
    } catch (error) {
      console.error('Error clearing cart', error);
      setError(error.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = cart.items ? cart.items.reduce((count, item) => count + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateCartItem: updateItemQty,
        removeFromCart: removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
