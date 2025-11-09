import React from 'react';

const SolicitudesSection = ({ onSolicitudesCountChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Solicitudes</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Solicitudes de Cuidado
        </h3>
        <p className="text-gray-500 mb-6">
          Gestiona tus solicitudes de cuidado para mascotas.
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Nueva Solicitud
        </button>
      </div>
    </div>
  );
};

export default SolicitudesSection;