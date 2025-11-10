// src/components/cuidador/solicitudes/SolicitudActivaCard.jsx
import React from 'react';
import SolicitudCardHeader from './SolicitudCardHeader';

const SolicitudActivaCard = ({
  solicitud,
  expandedCard,
  actionLoading,
  toggleExpanded,
  handleIniciar,
  handleFinalizar,
  formatDate
}) => {
  
  const getCardBorderClass = (estado) => {
    const estadoLower = estado?.toLowerCase();
    
    switch (estadoLower) {
      case 'aceptada':
        return 'border-green-400 border-2';
      case 'en progreso':
        return 'border-purple-400 border-2';
      case 'fuera de tiempo':
        return 'border-orange-400 border-2';
      default:
        return 'border-gray-300 border';
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const estadoLower = estado?.toLowerCase();
    
    switch (estadoLower) {
      case 'aceptada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'en progreso':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'fuera de tiempo':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isExpanded = expandedCard === solicitud.solicitudID;
  const isActionLoading = actionLoading === solicitud.solicitudID;

  // Determinar qué botones mostrar según el estado
  const puedeIniciar = solicitud.estado?.toLowerCase() === 'aceptada';
  const puedeFinalizar = solicitud.estado?.toLowerCase() === 'en progreso';

  return (
    <div 
      className={`bg-white rounded-lg border-2 shadow-sm transition-shadow ${getCardBorderClass(solicitud.estado)}`}
    >
      <SolicitudCardHeader solicitud={solicitud} formatDate={formatDate} />

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Información del servicio */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <span className="mr-2 text-red-500">📍</span>
                  <span className="font-medium text-sm">Ubicación:</span>
                </div>
                <p className="text-gray-600 text-sm">{solicitud.ubicacion}</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <span className="mr-2 text-blue-500">⏱️</span>
                  <span className="font-medium text-sm">Duración:</span>
                </div>
                <p className="text-gray-600 text-sm">{solicitud.duracionHoras} horas</p>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="mr-2 text-green-500">🏷️</span>
                <span className="font-medium text-sm">Servicio:</span>
              </div>
              <p className="text-gray-600 text-sm">{solicitud.tipoServicio}</p>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="mr-2 text-yellow-500">📝</span>
                <span className="font-medium text-sm">Descripción:</span>
              </div>
              <p className="text-gray-600 text-sm">{solicitud.descripcion}</p>
            </div>

            {/* Estado actual del servicio */}
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              <span className="font-medium text-sm mr-2">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoBadgeClass(solicitud.estado)}`}>
                {solicitud.estado}
              </span>
            </div>
          </div>

          {/* Botones y acciones específicas para servicios activos */}
          <div className="space-y-3">
            <button
              onClick={() => toggleExpanded(solicitud.solicitudID)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
            >
              <span className="mr-2">👁️</span>
              {isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
            </button>

            {isExpanded && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="mr-2">📧</span>
                  <span className="text-gray-600">{solicitud.emailCliente || 'No disponible'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="mr-2">📞</span>
                  <span className="text-gray-600">{solicitud.telefonoCliente || 'No disponible'}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Creado: {formatDate(solicitud.fechaCreacion)}
                </div>
                {solicitud.fechaAceptacion && (
                  <div className="text-xs text-gray-500">
                    Aceptado: {formatDate(solicitud.fechaAceptacion)}
                  </div>
                )}
                {solicitud.fechaInicio && (
                  <div className="text-xs text-gray-500">
                    Iniciado: {formatDate(solicitud.fechaInicio)}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {/* Botón Iniciar Servicio - solo para estado "Aceptada" */}
              {puedeIniciar && (
                <button
                  onClick={() => handleIniciar(solicitud.solicitudID)}
                  disabled={isActionLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  {isActionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🚀</span>
                      Iniciar Servicio
                    </>
                  )}
                </button>
              )}

              {/* Botón Finalizar Servicio - solo para estado "En Progreso" */}
              {puedeFinalizar && (
                <button
                  onClick={() => handleFinalizar(solicitud.solicitudID)}
                  disabled={isActionLoading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  {isActionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✅</span>
                      Finalizar Servicio
                    </>
                  )}
                </button>
              )}

              {/* Mensaje informativo cuando no hay acciones disponibles */}
              {!puedeIniciar && !puedeFinalizar && (
                <div className="text-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <span className="mr-1">ℹ️</span>
                  {solicitud.estado?.toLowerCase() === 'fuera de tiempo' 
                    ? 'Servicio fuera de tiempo'
                    : 'Esperando siguiente acción'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudActivaCard;