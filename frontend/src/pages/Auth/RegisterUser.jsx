// src/pages/Auth/RegisterUser.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { register, login } from '../../api/auth';

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
    <div className="register-user">
      <h2>Registro de Usuario ({rol})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo:
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
