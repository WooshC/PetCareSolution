import { useCallback } from 'react';
import useAuth from './useAuth';

const useFetch = () => {
  const { token } = useAuth();

  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      };

      // Verificamos si la URL ya tiene el esquema completo (http://localhost:5010)
      let apiUrl = url;

      if (!url.startsWith('http')) {
        apiUrl = `${import.meta.env.VITE_API_REQUEST}${url.replace(/^\/+/, '')}`;
      }

      console.log('URL de la solicitud:', apiUrl);  // Para debuggear y verificar la URL generada

      const response = await fetch(apiUrl, config);

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const text = await response.text();
      // Si la respuesta está vacía, devuelve un arreglo vacío
      const data = text ? JSON.parse(text) : [];

      return data;
    },
    [token]
  );

  return fetchWithToken;
};

export default useFetch;
