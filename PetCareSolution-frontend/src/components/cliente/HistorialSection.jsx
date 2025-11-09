import React from 'react';

const HistorialSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Servicios</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Historial Completo
        </h3>
        <p className="text-gray-500">
          Revisa el historial de todos los servicios contratados.
        </p>
      </div>
    </div>
  );
};

export default HistorialSection;