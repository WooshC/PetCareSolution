// components/cliente/SolicitudCard.jsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const SolicitudCard = ({ solicitud, onAsignarCuidador, onCancelarSolicitud, onCalificar, actionLoading }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Asignada': 'bg-blue-100 text-blue-800 border-blue-200',
      'Aceptada': 'bg-green-100 text-green-800 border-green-200',
      'En Progreso': 'bg-purple-100 text-purple-800 border-purple-200',
      'Finalizada': 'bg-gray-100 text-gray-800 border-gray-200',
      'Cancelada': 'bg-red-100 text-red-800 border-red-200',
      'Rechazada': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancel = () => {
    return ['Pendiente', 'Asignada', 'Aceptada'].includes(solicitud.estado);
  };

  const canAssign = () => {
    return solicitud.estado === 'Pendiente';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header con estado y tipo de servicio */}
      <div className={`border-b ${getEstadoBadge(solicitud.estado)} px-4 py-3`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
              {solicitud.tipoServicio}
            </span>
            <span className="text-sm font-medium">{solicitud.estado}</span>
          </div>
          <div className="text-xs text-gray-600">
            ID: #{solicitud.solicitudID}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Información del servicio */}
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="font-medium text-sm">Ubicación:</span>
                </div>
                <p className="text-gray-600 text-sm">{solicitud.ubicacion}</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium text-sm">Duración:</span>
                </div>
                <p className="text-gray-600 text-sm">{solicitud.duracionHoras} horas</p>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium text-sm">Fecha y hora:</span>
              </div>
              <p className="text-gray-600 text-sm">{formatDate(solicitud.fechaHoraInicio)}</p>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <span className="mr-2 text-yellow-500">📝</span>
                <span className="font-medium text-sm">Descripción:</span>
              </div>
              <p className="text-gray-600 text-sm">{solicitud.descripcion}</p>
            </div>

            {/* Información del cuidador asignado */}
            {solicitud.nombreCuidador && (
              <div className="bg-blue-50 rounded-lg p-3 mt-2">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-sm text-blue-800">Cuidador asignado:</span>
                </div>
                <p className="text-blue-700 text-sm">{solicitud.nombreCuidador}</p>
                {solicitud.emailCuidador && (
                  <p className="text-blue-600 text-xs mt-1">{solicitud.emailCuidador}</p>
                )}
              </div>
            )}
          </div>

          {/* Botones y acciones */}
          <div className="space-y-3">
            <button
              onClick={toggleExpanded}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Ver detalles
                </>
              )}
            </button>

            {/* Botones de acción según el estado */}
            <div className="space-y-2">
              {canAssign() && (
                <button
                  onClick={() => onAsignarCuidador(solicitud.solicitudID)}
                  disabled={actionLoading === solicitud.solicitudID}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  {actionLoading === solicitud.solicitudID ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Elegir Cuidador
                    </>
                  )}
                </button>
              )}

              {canCancel() && (
                <button
                  onClick={() => onCancelarSolicitud(solicitud.solicitudID)}
                  disabled={actionLoading === solicitud.solicitudID}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  {actionLoading === solicitud.solicitudID ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">❌</span>
                      Cancelar
                    </>
                  )}
                </button>
              )}

              {solicitud.estado === 'Finalizada' && (
                <button
                  onClick={() => onCalificar(solicitud)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">⭐</span>
                  Calificar Servicio
                </button>
              )}
            </div>

            {/* Información adicional expandida */}
            {expanded && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {solicitud.emailCliente || 'Email no disponible'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {solicitud.telefonoCliente || 'Teléfono no disponible'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <div>Creado: {formatDate(solicitud.fechaCreacion)}</div>
                  {solicitud.fechaActualizacion && (
                    <div>Actualizado: {formatDate(solicitud.fechaActualizacion)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudCard;