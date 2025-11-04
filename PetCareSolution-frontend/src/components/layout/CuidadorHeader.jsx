// components/layout/CuidadorHeader.jsx
import React from 'react';

const CuidadorHeader = ({
  currentSection,
  onSectionChange,
  onLogout,
  cuidadorName = 'Cuidador',
  solicitudesCount = 0,
  solicitudesActivasCount = 0
}) => {
  const sections = [
    { key: 'perfil', label: 'Mi Perfil', icon: '👤' },
    { key: 'solicitudes', label: 'Solicitudes', icon: '🔔', badge: solicitudesCount },
    { key: 'solicitudes-activas', label: 'Activas', icon: '✅', badge: solicitudesActivasCount },
    { key: 'historial', label: 'Historial', icon: '📋' }
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primera fila: Logo y usuario */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">PetCare Ecuador - Cuidador</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-blue-100">Hola, {cuidadorName}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Segunda fila: Navegación */}
        <div className="border-t border-blue-400">
          <div className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  currentSection === section.key
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-blue-200'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
                {section.badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {section.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CuidadorHeader;