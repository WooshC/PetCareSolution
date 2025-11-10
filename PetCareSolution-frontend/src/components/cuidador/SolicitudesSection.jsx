// src/components/cuidador/SolicitudesSection.jsx
import React, { useState } from 'react';
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useCuidador } from '../../hooks/useCuidador';
import PerfilUsuario from '../common/PerfilUsuario';
import ActionModal from '../common/ActionModal';

const SolicitudesSection = ({ onSolicitudesCountChange }) => {
  const {
    solicitudes,
    loading,
    error,
    aceptarSolicitud,
    rechazarSolicitud,
    loadSolicitudes,
    totalPendientes
  } = useSolicitudes();

  const { cuidador } = useCuidador();

  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Nuevo estado para el Modal
  const [modal, setModal] = useState({
    show: false,
    type: 'info', // 'success', 'error', 'info', 'confirm'
    title: '',
    message: '',
    onConfirm: null, // Función que se ejecuta al confirmar
    confirmText: 'Aceptar',
    showCancelButton: false
  });

  // Actualizar el contador cuando cambien las solicitudes
  React.useEffect(() => {
    if (onSolicitudesCountChange) {
      onSolicitudesCountChange(totalPendientes);
    }
  }, [totalPendientes, onSolicitudesCountChange]);

  const handleAceptarSolicitud = async (solicitudId) => {
    try {
      setActionLoading(solicitudId);
      const result = await aceptarSolicitud(solicitudId);
      if (result.success) {
        // Mostrar Modal de éxito
        setModal({
          show: true,
          type: 'success',
          title: '¡Solicitud Aceptada! ✅',
          message: result.message || 'Has aceptado la solicitud exitosamente. Recuerda iniciar el servicio a tiempo.',
          onConfirm: () => {
            setModal({ ...modal, show: false });
            loadSolicitudes(); // Recargar solicitudes
          },
          confirmText: 'Entendido'
        });
      } else {
        // Mostrar Modal de error
        setModal({
          show: true,
          type: 'error',
          title: 'Error al Aceptar',
          message: `Error: ${result.message}`,
          onConfirm: () => setModal({ ...modal, show: false }),
          confirmText: 'Cerrar'
        });
      }
    } catch (error) {
      console.error('Error accepting solicitud:', error);
      setModal({
        show: true,
        type: 'error',
        title: 'Error de Conexión',
        message: 'Error al aceptar la solicitud. Inténtalo de nuevo.',
        onConfirm: () => setModal({ ...modal, show: false }),
        confirmText: 'Cerrar'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRechazarSolicitud = async (solicitudId) => {
    // Mostrar Modal de confirmación en lugar de window.confirm
    setModal({
      show: true,
      type: 'confirm',
      title: '¿Estás seguro?',
      message: '¿Estás seguro de que quieres rechazar esta solicitud? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setModal({ ...modal, show: false });
        try {
          setActionLoading(solicitudId);
          const result = await rechazarSolicitud(solicitudId);
          if (result.success) {
            // Mostrar Modal de éxito
            setModal({
              show: true,
              type: 'success',
              title: 'Solicitud Rechazada',
              message: result.message || 'La solicitud ha sido rechazada exitosamente.',
              onConfirm: () => {
                setModal({ ...modal, show: false });
                loadSolicitudes(); // Recargar solicitudes
              },
              confirmText: 'Entendido'
            });
          } else {
            // Mostrar Modal de error
            setModal({
              show: true,
              type: 'error',
              title: 'Error al Rechazar',
              message: `Error: ${result.message}`,
              onConfirm: () => setModal({ ...modal, show: false }),
              confirmText: 'Cerrar'
            });
          }
        } catch (error) {
          console.error('Error rejecting solicitud:', error);
          setModal({
            show: true,
            type: 'error',
            title: 'Error de Conexión',
            message: 'Error al rechazar la solicitud. Inténtalo de nuevo.',
            onConfirm: () => setModal({ ...modal, show: false }),
            confirmText: 'Cerrar'
          });
        } finally {
          setActionLoading(null);
        }
      },
      confirmText: 'Sí, Rechazar',
      showCancelButton: true,
      cancelText: 'Cancelar'
    });
  };


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const getEstadoBadge = (estado) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    const estadoLower = estado?.toLowerCase();
    
    switch (estadoLower) {
      case 'pendiente':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>⏳ Pendiente</span>;
      case 'asignada':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>📋 Asignada</span>;
      case 'aceptada':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>✅ Aceptada</span>;
      case 'en progreso':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>🚀 En Progreso</span>;
      case 'finalizada':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>🏁 Finalizada</span>;
      case 'rechazada':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>❌ Rechazada</span>;
      case 'cancelada':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>🚫 Cancelada</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{estado}</span>;
    }
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

  const toggleExpanded = (solicitudId) => {
    setExpandedCard(expandedCard === solicitudId ? null : solicitudId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
      </div>
    );
  }

  if (error && solicitudes.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={loadSolicitudes}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitudes-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna izquierda - Perfil del cuidador (USANDO EL NUEVO COMPONENTE) */}
        <div className="lg:col-span-1">
          <PerfilUsuario 
            usuario={cuidador}
            tipo="cuidador"
            showStats={true}
            stats={{
              pendientes: solicitudes.length,
              aceptadas: solicitudes.filter(s => s.estado?.toLowerCase() === 'aceptada').length
            }}
          />
        </div>

        {/* Columna derecha - Lista de solicitudes (sin cambios) */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <span className="text-yellow-800">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">⏰</span>
              Solicitudes Pendientes ({solicitudes.length})
            </h2>

            {solicitudes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No hay solicitudes pendientes
                </h3>
                <p className="text-gray-500">
                  Cuando recibas nuevas solicitudes, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((solicitud) => (
                  <div 
                    key={solicitud.solicitudID} 
                    className={`bg-white rounded-lg border-2 shadow-sm ${getCardBorderClass(solicitud.estado)}`}
                  >
                    {/* Header de la tarjeta */}
                    <div className="border-b border-gray-200 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="mr-2">👤</span>
                            <h4 className="font-semibold text-gray-800">
                              {solicitud.nombreCliente || 'Cliente'}
                            </h4>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📅</span>
                            {formatDate(solicitud.fechaHoraInicio)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {solicitud.tipoServicio}
                          </span>
                          {getEstadoBadge(solicitud.estado)}
                        </div>
                      </div>
                    </div>

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
                            onClick={() => toggleExpanded(solicitud.solicitudID)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                          >
                            <span className="mr-2">👁️</span>
                            {expandedCard === solicitud.solicitudID ? 'Ocultar' : 'Ver más'}
                          </button>

                          {expandedCard === solicitud.solicitudID && (
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
                              onClick={() => handleAceptarSolicitud(solicitud.solicitudID)}
                              disabled={actionLoading === solicitud.solicitudID}
                              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                            >
                              {actionLoading === solicitud.solicitudID ? (
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
                              onClick={() => handleRechazarSolicitud(solicitud.solicitudID)}
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
                                  Rechazar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudesSection;