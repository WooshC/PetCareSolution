// components/layout/CuidadorHeader.jsx
import React, { useState, useEffect } from 'react';

const CuidadorHeader = ({
  currentSection,
  onSectionChange,
  onLogout,
  cuidadorName = 'Cuidador',
  solicitudesAsignadasCount = 0,  
  solicitudesActivasCount = 0,      
  refreshTrigger = 0 
}) => {
  const [contadores, setContadores] = useState({
    asignadas: solicitudesAsignadasCount,
    activas: solicitudesActivasCount
  });


  useEffect(() => {
    console.log('Actualizando contadores en header:', {
        asignadas: solicitudesAsignadasCount,
        activas: solicitudesActivasCount
    });
    
    setContadores({
        asignadas: solicitudesAsignadasCount,
        activas: solicitudesActivasCount
    });
}, [solicitudesAsignadasCount, solicitudesActivasCount, refreshTrigger]);

  const sections = [
    { 
      key: 'perfil', 
      label: 'Mi Perfil', 
      icon: '👤',
      description: 'Gestiona tu perfil'
    },
    { 
      key: 'solicitudes', 
      label: 'Asignadas', // Nombre actualizado
      icon: '🔔', 
      badge: contadores.asignadas, 
      description: 'Solicitudes asignadas pendientes de respuesta'
    },
    { 
      key: 'solicitudes-activas', 
      label: 'Servicios Activos', // Nombre actualizado
      icon: '✅', 
      badge: contadores.activas, 
      description: 'Servicios aceptados y en progreso'
    },
    { 
      key: 'historial', 
      label: 'Historial', 
      icon: '📋',
      description: 'Historial completo de servicios'
    }
  ];

  // Función para obtener el tooltip según el contador (sin cambios)
  const getBadgeTooltip = (section) => {
    if (!section.badge) return null;
    
    switch(section.key) {
      case 'solicitudes':
        return `${section.badge} solicitud${section.badge !== 1 ? 'es' : ''} asignada${section.badge !== 1 ? 's' : ''}`;
      case 'solicitudes-activas':
        return `${section.badge} servicio${section.badge !== 1 ? 's' : ''} activo${section.badge !== 1 ? 's' : ''} (Aceptados + En Progreso)`;
      default:
        return `${section.badge} notificaciones`;
    }
  };

  return (
    <nav className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 shadow-2xl relative overflow-hidden">
      {/* Efecto de profundidad con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-900/20"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-blue-200 rounded-full top-3/4 left-3/4 animate-pulse delay-1000"></div>
        <div className="absolute w-1 h-1 bg-blue-100 rounded-full top-1/2 left-2/3 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primera fila: Logo y usuario */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                PetCare Ecuador
              </h1>
              <span className="text-blue-200 text-xs">Panel del Cuidador</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Contadores rápidos */}
            <div className="hidden md:flex items-center space-x-3">
              {(contadores.asignadas > 0 || contadores.activas > 0) && (
                <>
                  {contadores.asignadas > 0 && (
                    <div 
                      className="flex items-center space-x-1 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-400/30"
                      title={`${contadores.asignadas} solicitud${contadores.asignadas !== 1 ? 'es' : ''} asignada${contadores.asignadas !== 1 ? 's' : ''}`}
                    >
                      <span className="text-blue-300 text-xs">🔔</span>
                      <span className="text-blue-200 text-xs font-semibold">{contadores.asignadas}</span>
                    </div>
                  )}
                  {contadores.activas > 0 && (
                    <div 
                      className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30"
                      title={`${contadores.activas} servicio${contadores.activas !== 1 ? 's' : ''} activo${contadores.activas !== 1 ? 's' : ''}`}
                    >
                      <span className="text-green-300 text-xs">✅</span>
                      <span className="text-green-200 text-xs font-semibold">{contadores.activas}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="text-right">
              <span className="text-blue-100 text-sm block">Bienvenido</span>
              <span className="text-white font-semibold truncate max-w-32">{cuidadorName}</span>
            </div>
            
            <div className="w-px h-6 bg-blue-400/30"></div>
            
            <button
              onClick={onLogout}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>🚪</span>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>

        {/* Segunda fila: Navegación (sin cambios) */}
        <div className="border-t border-blue-500/30">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={`group relative flex items-center py-3 px-4 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg mx-1 min-w-max ${
                  currentSection === section.key
                    ? 'text-white bg-blue-600/40 shadow-inner'
                    : 'text-blue-100 hover:text-white hover:bg-blue-600/20'
                }`}
                title={section.description}
              >
                {/* Indicador activo */}
                {currentSection === section.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg"></div>
                )}
                
                <span className="relative z-10 flex items-center space-x-2">
                  <span className={`text-base transition-transform duration-200 ${
                    currentSection === section.key ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {section.icon}
                  </span>
                  <span className="font-medium">{section.label}</span>
                  {section.badge > 0 && (
                    <span 
                      className={`relative bg-gradient-to-r ${
                        section.key === 'solicitudes' 
                          ? 'from-blue-500 to-blue-600 animate-pulse' // Azul para asignadas
                          : 'from-green-500 to-green-600' // Verde para activas
                      } text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg min-w-[1.25rem]`}
                      title={getBadgeTooltip(section)}
                    >
                      {section.badge}
                      {/* Efecto de pulso para solicitudes asignadas */}
                      {section.key === 'solicitudes' && section.badge > 0 && (
                        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
                      )}
                    </span>
                  )}
                </span>

                {/* Efecto de borde inferior para activo */}
                {currentSection === section.key && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-cyan-400 rounded-full"></div>
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