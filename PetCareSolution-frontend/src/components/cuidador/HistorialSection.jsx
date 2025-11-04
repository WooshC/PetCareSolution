// src/components/cuidador/HistorialSection.jsx
import React from 'react';

const HistorialSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Historial de Servicios
      </h2>
      
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Historial de servicios
        </h3>
        <p className="text-gray-500">
          Aquí podrás ver el historial completo de todos tus servicios realizados.
        </p>
      </div>
    </div>
  );
};

export default HistorialSection;