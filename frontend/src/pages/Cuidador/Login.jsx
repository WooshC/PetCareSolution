// src/pages/Cuidador/Login.jsx
import React from 'react';
import LoginForm from '../../components/common/LoginForm';
import { loginUsuario } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const data = await loginUsuario(email, password);
    
    // Guardamos sesión
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // Redirigimos según el rol
    if (data.usuario.rol === 'cuidador') {
      navigate('/cuidador/dashboard');
    } else {
      navigate('/cliente/dashboard');
    }
  };

  return (
    <div>
      <h2>Login Cuidador</h2>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Login;
