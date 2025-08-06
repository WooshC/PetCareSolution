// src/pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/auth.css'; // <- Importa el nuevo CSS

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

      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar Sesión</h1>
        <p className="auth-subtitle">Bienvenido a PetCare</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Entrar
          </button>

          <div className="auth-links">
            <Link to="/registro">Crear cuenta</Link> |{' '}
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
