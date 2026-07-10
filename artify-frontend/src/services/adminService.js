import api from './api';
import { dummyUsers, dummyProducts, dummyOrders, dummyAdminSummary } from '../data/dummyData';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy users list for admin', error);
    return dummyUsers;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy updateUserRole simulation for id ${id} to role ${role}`, error);
    const idx = dummyUsers.findIndex(u => u.id === Number(id));
    if (idx !== -1) {
      dummyUsers[idx].role = role;
      return {
        success: true,
        message: 'User role updated successfully (Simulated)',
        data: dummyUsers[idx],
      };
    }
    throw new Error('User not found');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy deleteUser simulation for id ${id}`, error);
    const idx = dummyUsers.findIndex(u => u.id === Number(id));
    if (idx !== -1) {
      dummyUsers.splice(idx, 1);
      return {
        success: true,
        message: 'User deleted successfully (Simulated)',
        data: null,
      };
    }
    throw new Error('User not found');
  }
};

export const getAllAdminProducts = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/admin/products', { params: { page, size } });
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy products list for admin', error);
    const totalElements = dummyProducts.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = dummyProducts.slice(start, end);
    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    };
  }
};

export const deleteAdminProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy admin delete product simulation for id ${id}`, error);
    const idx = dummyProducts.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      dummyProducts.splice(idx, 1);
      return {
        success: true,
        message: 'Product deleted successfully (Simulated)',
        data: null,
      };
    }
    throw new Error('Product not found');
  }
};

export const getReportSummary = async () => {
  try {
    const response = await api.get('/admin/reports/summary');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy admin summary reports', error);
    // Dynamically calculate summary based on current dummy data state
    const currentSummary = {
      totalUsers: dummyUsers.length,
      totalProducts: dummyProducts.length,
      totalOrders: dummyOrders.length,
      totalRevenue: dummyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      totalArtists: dummyUsers.filter(u => u.role === 'ARTIST').length,
      pendingOrders: dummyOrders.filter(o => o.status === 'PENDING').length,
    };
    return {
      success: true,
      message: 'Report summary retrieved successfully (Simulated)',
      data: currentSummary,
    };
  }
};
