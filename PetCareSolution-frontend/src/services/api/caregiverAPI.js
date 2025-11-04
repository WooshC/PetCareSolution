// services/api/caregiverAPI.js
import axios from 'axios';

const CAREGIVER_API_URL = import.meta.env.VITE_CAREGIVER_API_URL;

const caregiverApi = axios.create({
  baseURL: CAREGIVER_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const caregiverService = {
  createProfile: async (profileData, token) => {
    try {
      const response = await caregiverApi.post('/', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creando perfil de cuidador:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Error creando perfil de cuidador');
    }
  },

  getProfile: async (token) => {
    try {
      console.log('🔍 Solicitando perfil de cuidador...');
      const response = await caregiverApi.get('/mi-perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('✅ Respuesta completa del backend:', response.data);
      
      // 🔥 CORRECCIÓN: El backend devuelve los datos directamente, no envuelto en {success, data}
      const profileData = response.data;
      
      // Si el backend devuelve un objeto con propiedades de cuidador, es válido
      if (profileData && (profileData.cuidadorID || profileData.usuarioID)) {
        console.log('✅ Perfil de cuidador encontrado:', profileData);
        return {
          success: true,
          data: profileData
        };
      } else {
        console.warn('⚠️ Respuesta del backend no tiene estructura esperada:', profileData);
        return {
          success: false,
          error: 'Perfil no encontrado'
        };
      }
      
    } catch (error) {
      console.error('❌ Error obteniendo perfil de cuidador:', error.response?.data || error.message);
      
      // Si es error 404 (No encontrado), no es un error crítico
      if (error.response?.status === 404) {
        console.log('ℹ️ El usuario no tiene perfil de cuidador aún');
        return {
          success: false,
          error: 'No tienes un perfil de cuidador. Crea uno para comenzar.'
        };
      }
      
      throw new Error(error.response?.data?.error || 'Error obteniendo perfil de cuidador');
    }
  },

  updateProfile: async (profileData, token) => {
    try {
      const response = await caregiverApi.put('/mi-perfil', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil de cuidador:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Error actualizando perfil de cuidador');
    }
  },
};

export default caregiverService;