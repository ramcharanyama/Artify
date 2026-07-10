import api from './api';
import { dummyProducts } from '../data/dummyData';

export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy products list', error);
    
    // Simulate query parameters on dummy data
    let filtered = [...dummyProducts];
    const { category, search, minPrice, maxPrice, sortBy, sortDir = 'desc', page = 0, size = 12 } = params;
    
    if (category) {
      filtered = filtered.filter(p => p.categoryId === Number(category));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (minPrice != null) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice != null) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }
    
    // Sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let fieldA = a[sortBy];
        let fieldB = b[sortBy];
        if (typeof fieldA === 'string') {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
        if (fieldA < fieldB) return sortDir === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

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

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy product detail for id ${id}`, error);
    const product = dummyProducts.find(p => p.id === Number(id));
    if (product) {
      return {
        success: true,
        message: 'Product retrieved successfully (Simulated)',
        data: product,
      };
    }
    throw new Error('Product not found');
  }
};

export const createProduct = async (productRequest) => {
  try {
    const response = await api.post('/products', productRequest);
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy createProduct simulation', error);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const newProduct = {
      id: dummyProducts.length + 1,
      artistId: user.id || 2,
      artistName: user.name || 'Ravi Kumar',
      categoryId: Number(productRequest.categoryId),
      categoryName: 'Paintings', // Fallback name
      title: productRequest.title,
      description: productRequest.description,
      price: Number(productRequest.price),
      imageUrl: productRequest.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
      stock: Number(productRequest.stock),
      status: productRequest.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    dummyProducts.push(newProduct);
    return {
      success: true,
      message: 'Product created successfully (Simulated)',
      data: newProduct,
    };
  }
};

export const updateProduct = async (id, productRequest) => {
  try {
    const response = await api.put(`/products/${id}`, productRequest);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy updateProduct simulation for id ${id}`, error);
    const idx = dummyProducts.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      const updatedProduct = {
        ...dummyProducts[idx],
        ...productRequest,
        price: Number(productRequest.price),
        stock: Number(productRequest.stock),
        categoryId: Number(productRequest.categoryId),
      };
      dummyProducts[idx] = updatedProduct;
      return {
        success: true,
        message: 'Product updated successfully (Simulated)',
        data: updatedProduct,
      };
    }
    throw new Error('Product not found');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy deleteProduct simulation for id ${id}`, error);
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

export const searchProducts = async (q, page = 0, size = 10) => {
  try {
    const response = await api.get('/products/search', { params: { q, page, size } });
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy searchProducts simulation', error);
    const query = q.toLowerCase();
    const filtered = dummyProducts.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

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

export const getProductsByArtist = async (artistId) => {
  try {
    const response = await api.get(`/products/artist/${artistId}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy getProductsByArtist for artistId ${artistId}`, error);
    // Find all products by artist user. Note: dummy data products store artistId as 2 or 3 which corresponds to userId 2 or 3.
    // If the caller sends artist user's id directly, we should support it.
    const artistProducts = dummyProducts.filter(p => p.artistId === Number(artistId) || p.id === Number(artistId));
    return artistProducts;
  }
};
