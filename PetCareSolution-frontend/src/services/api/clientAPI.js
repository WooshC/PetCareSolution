import axios from 'axios';

const CLIENT_API_URL = import.meta.env.VITE_CLIENT_API_URL;

const clientApi = axios.create({
  baseURL: CLIENT_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const clientService = {
  createProfile: async (profileData, token) => {
    const response = await clientApi.post('/', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getProfile: async (token) => {
    const response = await clientApi.get('/mi-perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (profileData, token) => {
    const response = await clientApi.put('/mi-perfil', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default clientService;
