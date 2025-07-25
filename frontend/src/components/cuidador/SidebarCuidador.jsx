// src/components/cuidador/SidebarCuidador.jsx
import React from 'react';

const SidebarCuidador = () => {
  const cuidador = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div style={{ width: '25%', padding: '1rem', background: '#f5f5f5' }}>
      <h3>{cuidador.nombre}</h3>
      <p>Tarifa/hora: ${cuidador.tarifaHora}</p>
      <p>Cuenta bancaria: {cuidador.cuentaBancaria}</p>
      <p>Estado: {cuidador.estado}</p>
    </div>
  );
};

export default SidebarCuidador;
