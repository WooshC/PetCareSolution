// services/api/authAPI.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  login: async (credentials) => {
    try {
      console.log('📤 Enviando credenciales:', credentials);
      
      const response = await api.post('/login', {
        Email: credentials.email,    // PascalCase para .NET
        Password: credentials.password
      });

      console.log('✅ Respuesta completa del backend:', response.data);

      // 🔥 CORRECCIÓN: Adaptar la respuesta del backend
      const backendData = response.data;
      
      // Si el backend devuelve la estructura con 'success', adaptarla
      if (backendData.success && backendData.token) {
        return {
          success: true,
          token: backendData.token,
          user: {
            id: backendData.user?.id || backendData.data?.id,
            name: backendData.user?.name || backendData.data?.name || credentials.email.split('@')[0],
            email: credentials.email,
            role: backendData.user?.role || backendData.data?.roles?.[0] || 'Usuario'
          },
          message: backendData.message
        };
      }

      // Si el backend devuelve datos directamente
      return {
        success: true,
        token: backendData.token,
        user: {
          id: backendData.id,
          name: backendData.name || credentials.email.split('@')[0],
          email: credentials.email,
          role: backendData.roles?.[0] || 'Usuario'
        }
      };

    } catch (error) {
      console.error('❌ Error en login:', error.response?.data);
      
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Credenciales inválidas');
      }
      throw new Error(error.message || 'Error en el login');
    }
  },

  // También actualiza el register para consistencia
  register: async (userData) => {
    try {
      console.log('📤 Enviando registro:', userData);
      
      const response = await api.post('/register', {
        Email: userData.email,
        Password: userData.password,
        Name: userData.name,
        PhoneNumber: userData.phoneNumber,
        Role: userData.role
      });

      console.log('✅ Respuesta del registro:', response.data);

      const backendData = response.data;
      
      return {
        success: backendData.success,
        token: backendData.token,
        user: {
          id: backendData.user?.id,
          name: backendData.user?.name || userData.name,
          email: userData.email,
          role: backendData.user?.role || userData.role
        },
        message: backendData.message,
        error: backendData.error
      };

    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data);
      if (error.response?.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Error en el registro');
      }
      throw new Error(error.message || 'Error en el registro');
    }
  },

  getCurrentUser: async (token) => {
    try {
      const response = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('✅ Datos del usuario actual:', response.data);
      
      return {
        success: true,
        user: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.roles?.[0] || 'Usuario'
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Error obteniendo usuario actual');
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/reset-password', { 
        Email: email 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error solicitando reset de contraseña');
    }
  },
};

export default authService;