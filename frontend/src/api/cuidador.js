// src/api/cuidador.js
import axios from 'axios';

const API_URL = 'http://localhost:5008/api/cuidador'; // 🔴 NO uses /cuidadores ni /registro

export const registrarCuidador = async (data) => {
  try {
    const token = localStorage.getItem('token'); // ✅ JWT del usuario logueado

    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al registrar cuidador' };
  }
};

export const obtenerSolicitudesCuidador = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:8004/api/cuidadores/solicitudes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const aceptarSolicitud = async (idSolicitud) => {
  const token = localStorage.getItem('token');
  await axios.post(`http://localhost:8004/api/cuidadores/solicitudes/${idSolicitud}/aceptar`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const rechazarSolicitud = async (idSolicitud) => {
  const token = localStorage.getItem('token');
  await axios.post(`http://localhost:8004/api/cuidadores/solicitudes/${idSolicitud}/rechazar`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const enviarValoracion = async (solicitudId, rating, comentario) => {
  const token = localStorage.getItem('token');
  await axios.post(`http://localhost:8004/api/cuidadores/solicitudes/${solicitudId}/valoracion`, {
    rating,
    comentario,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};