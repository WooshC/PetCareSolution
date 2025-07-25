import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, loginUsuario } from '../../api/auth';

const RegisterUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      await registrarUsuario(form); // Registro exitoso
      const token = await loginUsuario(form); // Login automático

      localStorage.setItem('token', token);
      setMensaje('Usuario creado y autenticado correctamente');

      navigate('/cuidador/registro'); // Redirige al formulario de perfil
    } catch (error) {
      setMensaje(error.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Usuario Cuidador</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label>Nombre</label>
          <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Contraseña</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Crear Cuenta</button>
      </form>
      {mensaje && <div className="alert alert-info mt-4">{mensaje}</div>}
    </div>
  );
};

export default RegisterUser;
