import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
      // 🔹 Determinar URL y endpoint según rol
      const API_URL = rol === 'cliente'
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

      setSuccess('Perfil guardado correctamente. Espera la validación del administrador.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Registro como {rol}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Documento de Identidad:
          <input
            type="text"
            name="documentoIdentidad"
            value={form.documentoIdentidad}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono de Emergencia:
          <input
            type="text"
            name="telefonoEmergencia"
            value={form.telefonoEmergencia}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Biografía:
          <textarea
            name="biografia"
            value={form.biografia}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Experiencia:
          <textarea
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Horario de Atención:
          <input
            type="text"
            name="horarioAtencion"
            value={form.horarioAtencion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Tarifa por hora:
          <input
            type="number"
            name="tarifaPorHora"
            value={form.tarifaPorHora}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <button type="submit">Guardar perfil</button>
      </form>
    </div>
  );
};

export default RegistroFinal;
