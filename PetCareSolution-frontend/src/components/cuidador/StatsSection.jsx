// components/StatsSection.jsx
import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: '0', label: 'Servicios', color: 'text-blue-600' },
    { value: '0', label: 'Clientes', color: 'text-green-600' },
    { value: '0', label: 'Horas', color: 'text-purple-600' },
    { value: '0', label: 'Reseñas', color: 'text-yellow-600' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;