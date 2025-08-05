// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log('🟢 login →', data);

      if (!res.ok || !data.token) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      // Guardamos solo el token — user será cargado después con verifyToken
      login(data.token);

      // Redirigimos a /dashboard donde se renderiza según el rol
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message);
    }
  };


  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Correo" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Entrar</button>
        <p style={{ marginTop: '1rem' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: 'blue', textDecoration: 'underline' }}>
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
