import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth'; // auth-service

// Registro de nuevo usuario (rol: Cuidador)
export const registrarUsuario = async ({ nombre, email, password }) => {
  const response = await axios.post(`${API_URL}/register`, {
    Name: nombre,
    Email: email,
    Password: password,
    Role: 'Cuidador'
  });

  return response.data;
};

// Login de usuario cuidador
export const loginUsuario = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });

  return response.data.token; // asumimos que devuelve { token: "..." }
};
