// src/components/cuidador/RegistroForm.jsx
import React, { useState } from 'react';
import { registrarCuidador } from '../../api/cuidador';

const RegistroForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    tarifaHora: '',
    cuentaBancaria: ''
  });

  const [cedula, setCedula] = useState(null);
  const [serviciosBasicos, setServiciosBasicos] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cedula || !serviciosBasicos) {
      setMensaje('Debes subir los documentos requeridos');
      return;
    }

    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    formData.append('cedula', cedula);
    formData.append('serviciosBasicos', serviciosBasicos);

    try {
      await registrarCuidador(formData);
      setMensaje('Registro exitoso. Espera la validación.');
    } catch (error) {
      setMensaje(error.message || 'Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" type="text" placeholder="Nombre completo" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required minLength={8} />
      <input name="tarifaHora" type="number" placeholder="Tarifa por hora" onChange={handleChange} required />
      <input name="cuentaBancaria" type="text" placeholder="Cuenta Banco Pichincha" onChange={handleChange} required />

      <label>Cédula de identidad (JPG/PNG/PDF):</label>
      <input type="file" accept=".jpg,.png,.jpeg,.pdf" onChange={(e) => setCedula(e.target.files[0])} required />

      <label>Factura de servicios básicos (JPG/PNG/PDF):</label>
      <input type="file" accept=".jpg,.png,.jpeg,.pdf" onChange={(e) => setServiciosBasicos(e.target.files[0])} required />

      <button type="submit">Registrarme</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};

export default RegistroForm;
