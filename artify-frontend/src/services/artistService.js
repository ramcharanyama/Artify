import api from './api';

export const getAllArtists = async () => {
  try {
    const response = await api.get('/artists');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getArtistById = async (id) => {
  try {
    const response = await api.get(`/artists/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyArtist = async (id) => {
  try {
    const response = await api.put(`/artists/${id}/verify`);
    return response;
  } catch (error) {
    throw error;
  }
};
