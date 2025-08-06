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
      console.log('Payload enviado:', options.body);
      const response = await fetch(url, config);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    },
    [token]
  );

  return fetchWithToken;
};

export default useFetch;
