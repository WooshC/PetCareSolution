import React from 'react';

const ClienteHeader = ({
  currentSection,
  onSectionChange,
  onLogout,
  clienteName = 'Cliente',
  solicitudesCount = 0
}) => {
  const sections = [
    { key: 'perfil', label: 'Mi Perfil', icon: '👤' },
    { key: 'solicitudes', label: 'Solicitudes', icon: '📋', badge: solicitudesCount },
    { key: 'historial', label: 'Historial', icon: '📊' }
  ];

  return (
    <nav className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 shadow-2xl relative overflow-hidden">
      {/* Efecto de profundidad con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-900/20"></div>

      {/* Partículas decorativas */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-green-200 rounded-full top-3/4 left-3/4 animate-pulse delay-1000"></div>
        <div className="absolute w-1 h-1 bg-green-100 rounded-full top-1/2 left-2/3 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primera fila: Logo y usuario */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent">
              PetCare Ecuador
            </h1>
            <span className="text-green-200 text-sm font-medium px-2 py-1 bg-green-600/30 rounded-full">
              Cliente
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-green-100 text-sm block">Bienvenido</span>
              <span className="text-white font-semibold">{clienteName}</span>
            </div>
            <div className="w-px h-6 bg-green-400/30"></div>
            <button
              onClick={onLogout}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </span>
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>

        {/* Segunda fila: Navegación */}
        <div className="border-t border-green-500/30">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`group relative flex items-center py-3 px-4 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg mx-1 ${currentSection === section.key
                  ? 'text-white bg-green-600/40 shadow-inner'
                  : 'text-green-100 hover:text-white hover:bg-green-600/20'
                  }`}
              >
                {/* Indicador activo */}
                {currentSection === section.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg"></div>
                )}

                <span className="relative z-10 flex items-center space-x-2">
                  <span className={`text-base transition-transform duration-200 ${currentSection === section.key ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                    {section.icon}
                  </span>
                  <span className="font-medium">{section.label}</span>
                  {section.badge > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {section.badge}
                    </span>
                  )}
                </span>

                {/* Efecto de borde inferior para activo */}
                {currentSection === section.key && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClienteHeader;