// src/pages/Cuidador/CuidadorPerfilForm.jsx
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

const CuidadorPerfilForm = ({ onSuccess }) => {
  const fetchWithToken = useFetch();
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

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/api/Cuidador`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccess('Perfil guardado exitosamente.');
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Completa tu perfil como cuidador</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <input
        name="documentoIdentidad"
        placeholder="Documento de Identidad"
        value={form.documentoIdentidad}
        onChange={handleChange}
        required
      />
      <input
        name="telefonoEmergencia"
        placeholder="Teléfono de Emergencia"
        value={form.telefonoEmergencia}
        onChange={handleChange}
        required
      />
      <textarea
        name="biografia"
        placeholder="Biografía"
        value={form.biografia}
        onChange={handleChange}
      />
      <textarea
        name="experiencia"
        placeholder="Experiencia"
        value={form.experiencia}
        onChange={handleChange}
      />
      <input
        name="horarioAtencion"
        placeholder="Horario de atención (ej. 08:00 - 18:00)"
        value={form.horarioAtencion}
        onChange={handleChange}
      />
      <input
        name="tarifaPorHora"
        type="number"
        placeholder="Tarifa por hora"
        value={form.tarifaPorHora}
        onChange={handleChange}
        required
      />

      <button type="submit">Guardar Perfil</button>
    </form>
  );
};

export default CuidadorPerfilForm;
