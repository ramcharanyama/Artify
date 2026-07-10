import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart in context', error);
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
      if (response.success && response.data) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to add item' };
    } catch (error) {
      console.error('Error adding to cart', error);
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
      if (response.success && response.data) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to update quantity' };
    } catch (error) {
      console.error('Error updating cart quantity', error);
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
      if (response.success && response.data) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to remove item' };
    } catch (error) {
      console.error('Error removing cart item', error);
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
      if (response.success) {
        setCart({ items: [], totalAmount: 0 });
      }
    } catch (error) {
      console.error('Error clearing cart', error);
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
