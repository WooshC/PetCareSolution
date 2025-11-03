import axios from 'axios';

const CAREGIVER_API_URL = import.meta.env.VITE_CAREGIVER_API_URL;

const caregiverApi = axios.create({
  baseURL: CAREGIVER_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const caregiverService = {
  createProfile: async (profileData, token) => {
    const response = await caregiverApi.post('/', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getProfile: async (token) => {
    const response = await caregiverApi.get('/mi-perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateProfile: async (profileData, token) => {
    const response = await caregiverApi.put('/mi-perfil', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default caregiverService;
