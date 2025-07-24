// src/components/common/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
    } catch (error) {
      setMensaje(error.message || 'Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Iniciar sesión</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};

export default LoginForm;
