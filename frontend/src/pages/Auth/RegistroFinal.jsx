// src/pages/Auth/RegistroFinal.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/auth.css'; // <- Importa el nuevo CSS

const RegistroFinal = () => {
  const { rol } = useParams(); // "cliente" o "cuidador"
  const [form, setForm] = useState({
    documentoIdentidad: '',
    telefonoEmergencia: '',
    biografia: '',
    experiencia: '',
    horarioAtencion: '',
    tarifaPorHora: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const API_URL =
        rol === 'cliente'
          ? import.meta.env.VITE_API_CLIENTE
          : import.meta.env.VITE_API_CUIDADOR;

      const endpoint = rol === 'cliente' ? 'Cliente' : 'Cuidador';
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Error en la solicitud');
      }

      setSuccess(
        'Perfil guardado correctamente. Espera la validación del administrador.'
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h1 className="auth-title">Registro Final ({rol})</h1>
        <p className="auth-subtitle">
          Completa la información de tu perfil para continuar
        </p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="documentoIdentidad"
            placeholder="Documento de Identidad"
            value={form.documentoIdentidad}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="text"
            name="telefonoEmergencia"
            placeholder="Teléfono de Emergencia"
            value={form.telefonoEmergencia}
            onChange={handleChange}
            required
          />

          <textarea
            className="auth-input"
            name="biografia"
            placeholder="Biografía"
            value={form.biografia}
            onChange={handleChange}
            required
            rows={3}
          />

          <textarea
            className="auth-input"
            name="experiencia"
            placeholder="Experiencia"
            value={form.experiencia}
            onChange={handleChange}
            required
            rows={3}
          />

          <input
            className="auth-input"
            type="text"
            name="horarioAtencion"
            placeholder="Horario de Atención"
            value={form.horarioAtencion}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="number"
            name="tarifaPorHora"
            placeholder="Tarifa por Hora"
            value={form.tarifaPorHora}
            onChange={handleChange}
            required
            min="0"
          />

          <button type="submit" className="auth-btn" style={{ marginTop: '1rem' }}>
            Guardar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroFinal;
