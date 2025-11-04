// authAPI.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phoneNumber: userData.telefonoEmergencia || userData.phoneNumber,
        role: userData.role,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Error en el registro');
      }
      throw new Error(error.message || 'Error en el registro');
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Credenciales inválidas');
      }
      throw new Error(error.message || 'Error en el login');
    }
  },

  getCurrentUser: async (token) => {
    try {
      const response = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error obteniendo usuario actual');
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/reset-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error solicitando reset de contraseña');
    }
  },
};

export default authService;
