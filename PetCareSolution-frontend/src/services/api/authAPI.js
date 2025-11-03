// authAPI.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL, // ya incluye /api/auth
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phoneNumber: userData.telefonoEmergencia || userData.phoneNumber,
      role: userData.role,
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

export default authService;
