// authAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5043/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (userData) => {
    try {
      console.log('Enviando datos de registro:', userData);
      
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error completo del Auth Service:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error en el registro');
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en el login');
    }
  },
};

export default authService;