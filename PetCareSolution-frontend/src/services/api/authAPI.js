// services/api/authAPI.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Helper para logging seguro
const safeLog = (message, data = null) => {
  if (import.meta.env.MODE === 'development') {
    console.log(message, data ? JSON.parse(JSON.stringify(data)) : '');
  }
};

export const authService = {
  login: async (credentials) => {
  try {
    safeLog('📤 Enviando solicitud de login');

    const response = await api.post('/login', {
      Email: credentials.email,
      Password: credentials.password,
    });

    safeLog('✅ Respuesta del backend en login:', {
      success: response.data?.success,
      message: response.data?.message,
      userKeys: response.data?.user ? Object.keys(response.data.user) : [],
    });

    const backendData = response.data;

    if (backendData.success && backendData.token) {
      // Normalizar el rol
      const rawRole = backendData.user?.roles?.[0] || 'Usuario';
      const normalizedRole = rawRole.toLowerCase();
      
      const userData = {
        id: backendData.user?.id,
        name: backendData.user?.name || credentials.email.split('@')[0],
        email: credentials.email,
        phoneNumber: backendData.user?.phoneNumber || '',
        role: normalizedRole, // Usar el rol normalizado
        rawRole: rawRole, // Guardar también el rol original para debugging
      };

      // Guardar en localStorage de forma segura
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', backendData.token);

      console.log('👤 Usuario guardado:', userData);

      return {
        success: true,
        token: backendData.token,
        user: userData,
        message: backendData.message,
      };
    }

    throw new Error('Respuesta del servidor inválida');
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error en el login');
  }
},

  getCompleteUserData: async (token) => {
    try {
      safeLog('🔄 Solicitando datos completos del usuario (/auth/me)');
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || '',
        role: response.data.roles?.[0] || 'Usuario',
      };

      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Error obteniendo datos completos:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.error || 'Error obteniendo datos del usuario');
    }
  },

  register: async (userData) => {
    try {
      safeLog('📤 Enviando solicitud de registro');

      const response = await api.post('/register', {
        Email: userData.email,
        Password: userData.password,
        Name: userData.name,
        PhoneNumber: userData.phoneNumber,
        Role: userData.role,
      });

      const backendData = response.data;

      safeLog('✅ Respuesta del backend en registro:', {
        success: backendData.success,
        message: backendData.message,
      });

      const registeredUser = {
        id: backendData.user?.id,
        name: backendData.user?.name || userData.name,
        email: userData.email,
        phoneNumber: backendData.user?.phoneNumber || userData.phoneNumber,
        role: backendData.user?.role || userData.role,
      };

      if (backendData.token) {
        localStorage.setItem('user', JSON.stringify(registeredUser));
        localStorage.setItem('token', backendData.token);
      }

      return {
        success: backendData.success,
        token: backendData.token,
        user: registeredUser,
        message: backendData.message,
        error: backendData.error,
      };
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.error || 'Error en el registro');
    }
  },

getCurrentUser: async (token) => {
  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawRole = response.data.roles?.[0] || 'Usuario';
    const normalizedRole = rawRole.toLowerCase();

    const userData = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      phoneNumber: response.data.phoneNumber || '',
      role: normalizedRole,
      rawRole: rawRole,
    };

    localStorage.setItem('user', JSON.stringify(userData));

    return { success: true, user: userData };
  } catch (error) {
    console.error('❌ Error obteniendo usuario actual:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.error || 'Error obteniendo usuario actual');
  }
},

  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/reset-password', { Email: email });
      return response.data;
    } catch (error) {
      console.error('❌ Error solicitando reset de contraseña:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.error || 'Error solicitando reset de contraseña');
    }
  },
};

export default authService;
