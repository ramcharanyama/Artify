import api from './api';

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllAdminProducts = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/admin/products', { params: { page, size } });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReportSummary = async () => {
  try {
    const response = await api.get('/admin/reports/summary');
    return response;
  } catch (error) {
    throw error;
  }
};
