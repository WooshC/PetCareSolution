import React, { useState } from 'react';
import { registrarCuidador } from '../../api/cuidador';

const RegistroForm = () => {
  const [form, setForm] = useState({
    documentoIdentidad: '',
    telefonoEmergencia: '',
    biografia: '',
    experiencia: '',
    horarioAtencion: '',
    tarifaPorHora: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        tarifaPorHora: parseFloat(form.tarifaPorHora) || null
      };

      await registrarCuidador(payload);
      setMensaje('Registro exitoso. Espera la verificación.');
    } catch (error) {
      setMensaje(error.message || 'Error al registrar cuidador.');
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Documento de identidad *</label>
        <input
          type="text"
          name="documentoIdentidad"
          className="form-control"
          value={form.documentoIdentidad}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono de emergencia *</label>
        <input
          type="text"
          name="telefonoEmergencia"
          className="form-control"
          value={form.telefonoEmergencia}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Biografía</label>
        <textarea
          name="biografia"
          className="form-control"
          value={form.biografia}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Experiencia</label>
        <textarea
          name="experiencia"
          className="form-control"
          value={form.experiencia}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Horario de atención</label>
        <input
          type="text"
          name="horarioAtencion"
          className="form-control"
          value={form.horarioAtencion}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Tarifa por hora</label>
        <input
          type="number"
          name="tarifaPorHora"
          className="form-control"
          step="0.01"
          value={form.tarifaPorHora}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">Registrarme</button>

      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
    </form>
  );
};

export default RegistroForm;
