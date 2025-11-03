import axios from 'axios';

const CLIENT_API_URL = import.meta.env.VITE_CLIENT_API_URL || 'http://localhost:5045/api/cliente';

console.log('🔧 CLIENT_API_URL:', CLIENT_API_URL);

const clientApi = axios.create({
  baseURL: CLIENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientService = {
  createProfile: async (profileData, token) => {
    try {
      console.log('📝 Creando perfil de cliente:', profileData);
      
      // ✅ ENDPOINT CORRECTO: POST a la raíz del controlador
      const response = await clientApi.post('/', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Perfil de cliente creado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error creando perfil de cliente:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      if (error.response?.status === 400 || error.response?.status === 409) {
        const errorMsg = error.response.data?.message || error.response.data?.error || '';
        if (errorMsg.includes('ya existe') || errorMsg.includes('already exists')) {
          console.log('ℹ️ Perfil de cliente ya existente, continuando...');
          return { success: true, message: 'Perfil ya existente' };
        }
      }
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error creando perfil de cliente');
    }
  },

  getProfile: async (token) => {
    try {
      const response = await clientApi.get('/mi-perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error obteniendo perfil de cliente');
    }
  },

  updateProfile: async (profileData, token) => {
    try {
      const response = await clientApi.put('/mi-perfil', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error actualizando perfil de cliente');
    }
  }
};

export default clientService;