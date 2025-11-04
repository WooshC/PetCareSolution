// components/cuidador/SolicitudesActivasSection.jsx
import React, { useState, useEffect } from 'react';
import { solicitudService, caregiverService } from '../../services/api';

const SolicitudesActivasSection = ({ onSolicitudesCountChange }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await solicitudService.getMisSolicitudesActivas(token);
      setSolicitudes(data);
      onSolicitudesCountChange(data.length);
    } catch (error) {
      console.error('Error loading active solicitudes:', error);
      setError('Error al cargar las solicitudes activas');
    } finally {
      setLoading(false);
    }
  };

  const loadCuidadorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await caregiverService.getProfile(token);
      if (response.success) {
        setCuidador(response.data);
      }
    } catch (error) {
      console.error('Error loading cuidador profile:', error);
    }
  };

  useEffect(() => {
    loadSolicitudes();
    loadCuidadorProfile();
  }, []);

  const handleIniciarServicio = async (solicitudId) => {
    try {
      const token = localStorage.getItem('token');
      await solicitudService.iniciarServicio(solicitudId, token);
      await loadSolicitudes();
    } catch (error) {
      console.error('Error starting service:', error);
      setError('Error al iniciar el servicio');
    }
  };

  const handleFinalizarServicio = async (solicitudId) => {
    try {
      const token = localStorage.getItem('token');
      await solicitudService.finalizarServicio(solicitudId, token);
      await loadSolicitudes();
    } catch (error) {
      console.error('Error finishing service:', error);
      setError('Error al finalizar el servicio');
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
      case 'Aceptada':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aceptada</span>;
      case 'En Progreso':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>En Progreso</span>;
      case 'Fuera de Tiempo':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Fuera de Tiempo</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{estado}</span>;
    }
  };

  const getCardBorderClass = (estado) => {
    switch (estado) {
      case 'Aceptada':
        return 'border-green-400 border-2';
      case 'En Progreso':
        return 'border-blue-400 border-2';
      case 'Fuera de Tiempo':
        return 'border-yellow-400 border-2';
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
    <div className="solicitudes-activas-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna izquierda - Perfil del cuidador */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold text-gray-800">{cuidador?.nombreUsuario || 'Cuidador'}</h3>
            <p className="text-gray-600 text-sm">{cuidador?.emailUsuario}</p>
            
            {cuidador?.calificacionPromedio > 0 && (
              <div className="my-4">
                {renderStarRating(cuidador.calificacionPromedio)}
                <p className="text-gray-600 text-sm mt-1">
                  {cuidador.calificacionPromedio.toFixed(1)} / 5.0
                </p>
              </div>
            )}

            {cuidador?.tarifaPorHora && (
              <div className="my-4">
                <span className="text-green-600 font-bold text-lg">
                  ${cuidador.tarifaPorHora}/hora
                </span>
              </div>
            )}

            <div className="mt-4">
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
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-gray-600 text-sm">Pendientes</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{solicitudes.length}</div>
              <div className="text-gray-600 text-sm">Activas</div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Lista de solicitudes activas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🎯</span>
              Servicios Activos ({solicitudes.length})
            </h2>

            {solicitudes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏸️</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No hay servicios activos
                </h3>
                <p className="text-gray-500">
                  Los servicios que aceptes aparecerán aquí.
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
                            {solicitud.estado === 'Aceptada' && (
                              <button
                                onClick={() => handleIniciarServicio(solicitud.solicitudID)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                              >
                                <span className="mr-2">▶️</span>
                                Iniciar Servicio
                              </button>
                            )}
                            {solicitud.estado === 'En Progreso' && (
                              <button
                                onClick={() => handleFinalizarServicio(solicitud.solicitudID)}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                              >
                                <span className="mr-2">✅</span>
                                Finalizar Servicio
                              </button>
                            )}
                            {solicitud.estado === 'Fuera de Tiempo' && (
                              <button
                                onClick={() => handleFinalizarServicio(solicitud.solicitudID)}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                              >
                                <span className="mr-2">⚠️</span>
                                Finalizar (Fuera de Tiempo)
                              </button>
                            )}
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

export default SolicitudesActivasSection;