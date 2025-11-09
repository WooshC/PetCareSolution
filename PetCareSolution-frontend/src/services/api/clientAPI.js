import axios from 'axios';

const CLIENT_API_URL = import.meta.env.VITE_CLIENT_API_URL;

const clientApi = axios.create({
  baseURL: CLIENT_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const clientService = {
  async createProfile(profileData, token) {
    try {
      const response = await clientApi.post('/', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creando perfil de cliente:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear el perfil' 
      };
    }
  },

  async getProfile(token) {
    try {
      const response = await clientApi.get('/mi-perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo perfil de cliente:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al cargar el perfil' 
      };
    }
  },

  async updateProfile(profileData, token) {
    try {
      const response = await clientApi.put('/mi-perfil', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error actualizando perfil de cliente:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar el perfil' 
      };
    }
  },

  async deleteProfile(token) {
    try {
      const response = await clientApi.delete('/mi-perfil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error eliminando perfil de cliente:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar el perfil' 
      };
    }
  },

  async getAllClients(token) {
    try {
      const response = await clientApi.get('/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo lista de clientes:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al cargar los clientes' 
      };
    }
  },

  async getClientById(clientId, token) {
    try {
      const response = await clientApi.get(`/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error obteniendo cliente por ID:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al cargar el cliente' 
      };
    }
  },

  async verifyDocument(clientId, token) {
    try {
      const response = await clientApi.post(`/${clientId}/verificar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error verificando documento:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al verificar el documento' 
      };
    }
  }
};

export default clientService;