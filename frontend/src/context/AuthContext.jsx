// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const API_URL = import.meta.env.VITE_AUTH_URL;

  // Validar token y obtener datos del usuario
  const verifyToken = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      console.log('🟢 verifyToken →', res.data);
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (err) {
      logout();
    }
  };
  useEffect(() => {
    if (token) verifyToken();
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);        // Esto activa verifyToken()
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn, login, logout, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
