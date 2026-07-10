import api from './api';
import { dummyCategories } from '../data/dummyData';

export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy categories list', error);
    return dummyCategories;
  }
};

export const createCategory = async (categoryRequest) => {
  try {
    const response = await api.post('/categories', categoryRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy createCategory simulation', error);
    const newCategory = {
      id: dummyCategories.length + 1,
      name: categoryRequest.name,
      description: categoryRequest.description,
      imageUrl: categoryRequest.imageUrl || '/images/cat-placeholder.jpg',
    };
    dummyCategories.push(newCategory);
    return {
      success: true,
      message: 'Category created successfully (Simulated)',
      data: newCategory,
    };
  }
};

export const updateCategory = async (id, categoryRequest) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryRequest);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy updateCategory simulation for id ${id}`, error);
    const idx = dummyCategories.findIndex(c => c.id === Number(id));
    if (idx !== -1) {
      const updatedCategory = {
        ...dummyCategories[idx],
        ...categoryRequest,
      };
      dummyCategories[idx] = updatedCategory;
      return {
        success: true,
        message: 'Category updated successfully (Simulated)',
        data: updatedCategory,
      };
    }
    throw new Error('Category not found');
  }
};
