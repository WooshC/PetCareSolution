// src/pages/Auth/RegisterUser.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { register, login } from '../../api/auth';
import '../../styles/auth.css'; // <- Importa el nuevo CSS

const RegisterUser = () => {
  const { rol } = useParams(); // cliente | cuidador
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔹 Formatear rol para backend (Cliente / Cuidador)
      const roleFormatted = rol.charAt(0).toUpperCase() + rol.slice(1);

      // 1️⃣ Registrar usuario en Auth Service
      await register(form.correo, form.password, roleFormatted, form.nombre);

      // 2️⃣ Hacer login automático
      const loginResponse = await login(form.correo, form.password);

      // 3️⃣ Guardar token en localStorage
      localStorage.setItem('token', loginResponse.token);

      // 4️⃣ Redirigir al registro final
      navigate(`/registro-final/${rol}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Registro de Usuario ({rol})</h1>
        <p className="auth-subtitle">Completa los datos para tu cuenta</p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="auth-links" style={{ marginTop: '1rem' }}>
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
