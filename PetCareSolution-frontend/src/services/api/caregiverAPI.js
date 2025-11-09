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
      throw new Error(error.response?.data?.error || 'Error creando perfil de cuidador');
    }
  },

  getProfile: async (token) => {
    try {
      const response = await caregiverApi.get('/mi-perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data;

      if (profileData && (profileData.cuidadorID || profileData.usuarioID)) {
        return {
          success: true,
          data: profileData
        };
      } else {
        return {
          success: false,
          error: 'Perfil no encontrado'
        };
      }
    } catch (error) {
      if (error.response?.status === 404) {
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

      return {
        success: true,
        data: response.data,
        message: 'Perfil actualizado correctamente'
      };

    } catch (error) {
      const errorMessage = error.response?.data?.error ||
                           error.response?.data?.message ||
                           'Error al actualizar el perfil';

      throw new Error(errorMessage);
    }
  },
};

export default caregiverService;