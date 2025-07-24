// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth'; // ajusta si tu auth-service usa otro puerto

export const loginUsuario = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // Debería devolver token + rol + datos del usuario
};