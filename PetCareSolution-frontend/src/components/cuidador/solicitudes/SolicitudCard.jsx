// src/components/cuidador/solicitudes/SolicitudCard.jsx
import React, { useState } from 'react';
import SolicitudCardHeader from './SolicitudCardHeader';

const SolicitudCard = ({
  solicitud,
  actionLoading,
  handleAceptar,
  handleRechazar,
  formatDate
}) => {
  
  // 🚨 SOLUCIÓN SIMPLE: Solo estado local como en el componente del cliente
  const [expanded, setExpanded] = useState(false);
  const isActionLoading = actionLoading === solicitud.solicitudID;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getCardBorderClass = (estado) => {
    const estadoLower = estado?.toLowerCase();
    
    switch (estadoLower) {
      case 'pendiente':
        return 'border-yellow-400 border-2';
      case 'asignada':
        return 'border-blue-400 border-2';
      case 'aceptada':
        return 'border-green-400 border-2';
      case 'en progreso':
        return 'border-purple-400 border-2';
      default:
        return 'border-gray-300 border';
    }
  };

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
          </div>

          {/* Botones y acciones */}
          <div className="space-y-3">
            <button
              onClick={toggleExpanded}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
            >
              {expanded ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Ocultar detalles
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Ver detalles
                </>
              )}
            </button>

            {expanded && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="mr-2">📧</span>
                  <span className="text-gray-600">{solicitud.emailCliente || 'No disponible'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="mr-2">📞</span>
                  <span className="text-gray-600">{solicitud.telefonoCliente || 'No disponible'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Creado: {formatDate(solicitud.fechaCreacion)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => handleAceptar(solicitud.solicitudID)}
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
                    Aceptar
                  </>
                )}
              </button>
              <button
                onClick={() => handleRechazar(solicitud.solicitudID)}
                disabled={isActionLoading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
              >
                {isActionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">❌</span>
                    Rechazar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudCard;