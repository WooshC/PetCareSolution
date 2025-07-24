// src/api/chat.js
import axios from 'axios';

const API_URL = 'http://localhost:8002/api/chat'; // Ajusta según puerto de chat-service

export const obtenerMensajes = async (solicitudId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/mensajes/${solicitudId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const enviarMensaje = async (solicitudId, texto) => {
  const token = localStorage.getItem('token');
  await axios.post(`${API_URL}/mensajes`, {
    solicitudId,
    texto,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
