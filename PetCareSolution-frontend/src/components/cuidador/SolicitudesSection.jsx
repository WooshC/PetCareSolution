// src/components/cuidador/SolicitudesSection.jsx
import React, { useState, useEffect } from 'react';

// Datos temporales - comenta las importaciones de servicios
const solicitudService = {
  getMisSolicitudesPendientes: async () => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        solicitudID: 1,
        tipoServicio: 'Paseo de Mascotas',
        descripcion: 'Necesito que paseen a mi perro Golden Retriever de 2 años por 1 hora. Es muy juguetón y necesita ejercicio diario.',
        fechaHoraInicio: new Date(Date.now() + 86400000).toISOString(),
        duracionHoras: 1,
        ubicacion: 'Quito, Ecuador - Parque La Carolina',
        estado: 'Pendiente',
        fechaCreacion: new Date().toISOString(),
        nombreCliente: 'María González',
        emailCliente: 'maria@example.com',
        telefonoCliente: '+593 987654321'
      },
      {
        solicitudID: 2,
        tipoServicio: 'Cuidado Diario',
        descripcion: 'Busco cuidado para mi gato siamés mientras estoy de viaje 3 días. Necesita alimentación 2 veces al día y limpieza de arenero.',
        fechaHoraInicio: new Date(Date.now() + 172800000).toISOString(),
        duracionHoras: 3,
        ubicacion: 'Guayaquil, Ecuador - Urdesa Central',
        estado: 'Pendiente',
        fechaCreacion: new Date().toISOString(),
        nombreCliente: 'Carlos Rodríguez',
        emailCliente: 'carlos@example.com',
        telefonoCliente: '+593 987654322'
      }
    ];
  },
  aceptarSolicitud: async (id) => {
    console.log('Aceptando solicitud:', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  rechazarSolicitud: async (id) => {
    console.log('Rechazando solicitud:', id);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const caregiverService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: {
        nombreUsuario: 'Juan Pérez',
        emailUsuario: 'juan@example.com',
        documentoIdentidad: '1234567890',
        telefonoEmergencia: '+593 987654321',
        documentoVerificado: true,
        fechaCreacion: new Date().toISOString(),
        biografia: 'Cuidador profesional con 5 años de experiencia en el cuidado de mascotas. Amo los animales y me especializo en razas grandes.',
        experiencia: 'Más de 5 años cuidando perros y gatos. Certificado en primeros auxilios veterinarios. He trabajado con más de 50 mascotas diferentes.',
        horarioAtencion: 'Lunes a Viernes: 8:00 - 18:00, Sábados: 9:00 - 14:00',
        tarifaPorHora: 15,
        calificacionPromedio: 4.8
      }
    };
  }
};

const SolicitudesSection = ({ cuidador, onSolicitudesCountChange }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      // const token = localStorage.getItem('token');
      // const data = await solicitudService.getMisSolicitudesPendientes(token);
      const data = await solicitudService.getMisSolicitudesPendientes();
      setSolicitudes(data);
      onSolicitudesCountChange(data.length);
    } catch (error) {
      console.error('Error loading solicitudes:', error);
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const handleAceptarSolicitud = async (solicitudId) => {
    try {
      // const token = localStorage.getItem('token');
      // await solicitudService.aceptarSolicitud(solicitudId, token);
      await solicitudService.aceptarSolicitud(solicitudId);
      await loadSolicitudes();
    } catch (error) {
      console.error('Error accepting solicitud:', error);
      setError('Error al aceptar la solicitud');
    }
  };

  const handleRechazarSolicitud = async (solicitudId) => {
    try {
      const token = localStorage.getItem('token');
      await solicitudService.rechazarSolicitud(solicitudId, token);
      await loadSolicitudes();
    } catch (error) {
      console.error('Error rejecting solicitud:', error);
      setError('Error al rechazar la solicitud');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (estado) {
      case 'Pendiente':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pendiente</span>;
      case 'Aceptada':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aceptada</span>;
      case 'En Progreso':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>En Progreso</span>;
      case 'Finalizada':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Finalizada</span>;
      case 'Rechazada':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazada</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{estado}</span>;
    }
  };

  const getCardBorderClass = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'border-yellow-400 border-2';
      case 'Aceptada':
        return 'border-green-400 border-2';
      case 'En Progreso':
        return 'border-blue-400 border-2';
      default:
        return 'border-gray-300 border';
    }
  };

  const toggleExpanded = (solicitudId) => {
    setExpandedCard(expandedCard === solicitudId ? null : solicitudId);
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-600 mr-2">⚠️</span>
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitudes-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna izquierda - Perfil del cuidador CORREGIDO */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            
            {/* ✅ USAR DATOS REALES DEL CUIDADOR */}
            <h3 className="font-semibold text-gray-800">
              {cuidador?.nombreUsuario || 'Cuidador'}
            </h3>
            
            {/* ✅ Obtener email del usuario del localStorage */}
            <p className="text-gray-600 text-sm">
              {JSON.parse(localStorage.getItem('user') || '{}').email || 'No disponible'}
            </p>
            
            {/* ✅ Usar calificación real del cuidador */}
            {cuidador?.calificacionPromedio > 0 && (
              <div className="my-4">
                {renderStarRating(cuidador.calificacionPromedio)}
                <p className="text-gray-600 text-sm mt-1">
                  {cuidador.calificacionPromedio.toFixed(1)} / 5.0
                </p>
              </div>
            )}

            {/* ✅ Usar tarifa real del cuidador */}
            {cuidador?.tarifaPorHora && (
              <div className="my-4">
                <span className="text-green-600 font-bold text-lg">
                  ${cuidador.tarifaPorHora}/hora
                </span>
              </div>
            )}

            <div className="mt-4">
              {/* ✅ Usar estado de verificación real del cuidador */}
              {cuidador?.documentoVerificado ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Verificado
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⏳ Pendiente
                </span>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{solicitudes.length}</div>
              <div className="text-gray-600 text-sm">Pendientes</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600 text-sm">Activas</div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Lista de solicitudes (sin cambios) */}
        <div className="lg:col-span-3">
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
                              {solicitud.nombreCliente}
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
                                <span className="text-gray-600">{solicitud.emailCliente}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="mr-2">📞</span>
                                <span className="text-gray-600">{solicitud.telefonoCliente}</span>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <button
                              onClick={() => handleAceptarSolicitud(solicitud.solicitudID)}
                              className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                            >
                              <span className="mr-2">✅</span>
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleRechazarSolicitud(solicitud.solicitudID)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                            >
                              <span className="mr-2">❌</span>
                              Rechazar
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