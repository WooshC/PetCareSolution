import axios from 'axios';

const CAREGIVER_API_URL = import.meta.env.VITE_CAREGIVER_API_URL

console.log('🔧 CAREGIVER_API_URL:', CAREGIVER_API_URL);

const caregiverApi = axios.create({
  baseURL: CAREGIVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const caregiverService = {
  createProfile: async (profileData, token) => {
    try {
      console.log('📝 Creando perfil de cuidador:', profileData);
      
      // ✅ ENDPOINT CORRECTO: /api/cuidador (sin /profile)
      const response = await caregiverApi.post('/', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Perfil de cuidador creado:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error creando perfil de cuidador:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      
      // Si el error es que el perfil ya existe, no es crítico
      if (error.response?.status === 400 || error.response?.status === 409) {
        const errorMsg = error.response.data?.message || error.response.data?.error || '';
        if (errorMsg.includes('ya existe') || errorMsg.includes('already exists')) {
          console.log('ℹ️ Perfil de cuidador ya existente, continuando...');
          return { success: true, message: 'Perfil ya existente' };
        }
      }
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Error creando perfil de cuidador');
    }
  },

  getProfile: async (token) => {
    try {
      const response = await caregiverApi.get('/mi-perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error obteniendo perfil de cuidador');
    }
  },

  updateProfile: async (profileData, token) => {
    try {
      const response = await caregiverApi.put('/mi-perfil', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error actualizando perfil de cuidador');
    }
  }
};

export default caregiverService;