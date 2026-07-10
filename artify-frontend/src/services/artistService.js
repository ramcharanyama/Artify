import api from './api';
import { dummyArtists, dummyUsers } from '../data/dummyData';

export const getAllArtists = async () => {
  try {
    const response = await api.get('/artists');
    return response;
  } catch (error) {
    console.warn('Backend unavailable, falling back to dummy artists list', error);
    // Format dummy artists to include user details
    return dummyArtists.map(artist => ({
      ...artist,
      user: dummyUsers.find(u => u.id === artist.userId) || null
    }));
  }
};

export const getArtistById = async (id) => {
  try {
    const response = await api.get(`/artists/${id}`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy getArtistById simulation for id ${id}`, error);
    const artist = dummyArtists.find(a => a.id === Number(id));
    if (artist) {
      return {
        success: true,
        message: 'Artist retrieved successfully (Simulated)',
        data: {
          ...artist,
          user: dummyUsers.find(u => u.id === artist.userId) || null
        },
      };
    }
    throw new Error('Artist not found');
  }
};

export const verifyArtist = async (id) => {
  try {
    const response = await api.put(`/artists/${id}/verify`);
    return response;
  } catch (error) {
    console.warn(`Backend unavailable, falling back to dummy verifyArtist simulation for artist ${id}`, error);
    const idx = dummyArtists.findIndex(a => a.id === Number(id));
    if (idx !== -1) {
      dummyArtists[idx].isVerified = true;
      return {
        success: true,
        message: 'Artist verified successfully (Simulated)',
        data: {
          ...dummyArtists[idx],
          user: dummyUsers.find(u => u.id === dummyArtists[idx].userId) || null
        },
      };
    }
    throw new Error('Artist not found');
  }
};
