import React, { useState, useEffect } from 'react';
import { cuidadorSolicitudService } from '../../services/api/cuidadorSolicitudAPI';
import { useCuidador } from '../../hooks/useCuidador';
import PerfilUsuario from '../common/PerfilUsuario';
import ActionModal from '../common/ActionModal'; 

const SolicitudesActivasSection = ({ onSolicitudesCountChange }) => {
    const [solicitudes, setSolicitudes] = useState([]);
    const { cuidador, loading: loadingCuidador } = useCuidador();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    
    // Nuevo estado para el Modal
    const [modal, setModal] = useState({
        show: false,
        type: 'info', // 'success', 'error', 'info'
        title: '',
        message: '',
        onConfirm: null, // Función que se ejecuta al confirmar
        confirmText: 'Aceptar'
    });

    const loadSolicitudes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cuidadorSolicitudService.getMisSolicitudesActivas();
            setSolicitudes(data);
            if (onSolicitudesCountChange) {
                onSolicitudesCountChange(data.length);
            }
        } catch (error) {
            console.error('Error loading active solicitudes:', error);
            setError(error.message || 'Error al cargar las solicitudes activas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSolicitudes();
    }, []);

    const handleIniciarServicio = async (solicitudId, nombreCliente) => {
        try {
            setActionLoading(solicitudId);
            const result = await cuidadorSolicitudService.iniciarServicio(solicitudId);
            if (result.success) {
                // Mostrar Modal de éxito
                setModal({
                    show: true,
                    type: 'success',
                    title: '¡Servicio Iniciado! 🚀',
                    message: `Has comenzado el servicio con ${nombreCliente}. Recuerda registrar las actividades.`,
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
                    title: 'Error al Iniciar',
                    message: `Error: ${result.message}`,
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Cerrar'
                });
            }
        } catch (error) {
            console.error('Error starting service:', error);
            setModal({
                show: true,
                type: 'error',
                title: 'Error de Conexión',
                message: 'Error al iniciar el servicio. Inténtalo de nuevo.',
                onConfirm: () => setModal({ ...modal, show: false }),
                confirmText: 'Cerrar'
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleFinalizarServicio = async (solicitudId, nombreCliente) => {
        try {
            setActionLoading(solicitudId);
            const result = await cuidadorSolicitudService.finalizarServicio(solicitudId);
            if (result.success) {
                // Mostrar Modal de éxito
                setModal({
                    show: true,
                    type: 'success',
                    title: '¡Servicio Finalizado! ✅',
                    message: `El servicio con ${nombreCliente} ha concluido satisfactoriamente. Se generará la factura.`,
                    onConfirm: () => {
                        setModal({ ...modal, show: false });
                        loadSolicitudes(); // Recargar solicitudes
                    },
                    confirmText: 'Ver Resumen'
                });
            } else {
                // Mostrar Modal de error
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Error al Finalizar',
                    message: `Error: ${result.message}`,
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Cerrar'
                });
            }
        } catch (error) {
            console.error('Error finishing service:', error);
            setModal({
                show: true,
                type: 'error',
                title: 'Error de Conexión',
                message: 'Error al finalizar el servicio. Inténtalo de nuevo.',
                onConfirm: () => setModal({ ...modal, show: false }),
                confirmText: 'Cerrar'
            });
        } finally {
            setActionLoading(null);
        }
    };
    
    // Función para manejar la aceptación si se requiere (aunque en este componente solo hay Iniciar/Finalizar)
    /* const handleAceptarServicio = async (solicitudId) => {
        // Lógica de aceptación si estuviera aquí
        // Después de la API:
        setModal({
            show: true,
            type: 'info',
            title: 'Solicitud Aceptada',
            message: 'Has aceptado la solicitud. Recuerda iniciar el servicio a tiempo.',
            onConfirm: () => setModal({ ...modal, show: false }),
        });
    }
    */

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

        switch (estado) {
            case 'Aceptada':
                return <span className={`${baseClasses} bg-green-100 text-green-800`}>✅ Aceptada</span>;
            case 'En Progreso':
                return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>🚀 En Progreso</span>;
            case 'Fuera de Tiempo':
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>⏰ Fuera de Tiempo</span>;
            default:
                return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{estado}</span>;
        }
    };

    const getCardBorderClass = (estado) => {
        switch (estado) {
            case 'Aceptada':
                return 'border-green-500 border-3';
            case 'En Progreso':
                return 'border-blue-500 border-3';
            case 'Fuera de Tiempo':
                return 'border-gray-400 border-3';
            default:
                return 'border-gray-300 border-2';
        }
    };

    const toggleExpanded = (solicitudId) => {
        setExpandedCard(expandedCard === solicitudId ? null : solicitudId);
    };

    if (loading || loadingCuidador) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
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
        <>
            <div className="solicitudes-activas-section">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Columna izquierda - Perfil del cuidador usando PerfilUsuario */}
                    <div className="lg:col-span-1">
                        <PerfilUsuario 
                            usuario={cuidador}
                            tipo="cuidador"
                            showStats={true}
                            stats={{
                                activas: solicitudes.length,
                                enProgreso: solicitudes.filter(s => s.estado === 'En Progreso').length,
                                fueraDeTiempo: solicitudes.filter(s => s.estado === 'Fuera de Tiempo').length
                            }}
                        />
                    </div>

                    {/* Columna derecha - Lista de solicitudes activas */}
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
                                                            {solicitud.estado === 'Aceptada' && (
                                                                <button
                                                                    // Pasamos el nombre del cliente para el mensaje del modal
                                                                    onClick={() => handleIniciarServicio(solicitud.solicitudID, solicitud.nombreCliente)}
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
                                                                            <span className="mr-2">▶️</span>
                                                                            Iniciar Servicio
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                            {(solicitud.estado === 'En Progreso' || solicitud.estado === 'Fuera de Tiempo') && (
                                                                <button
                                                                    // Pasamos el nombre del cliente para el mensaje del modal
                                                                    onClick={() => handleFinalizarServicio(solicitud.solicitudID, solicitud.nombreCliente)}
                                                                    disabled={actionLoading === solicitud.solicitudID}
                                                                    className={`w-full ${
                                                                        solicitud.estado === 'En Progreso' 
                                                                            ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300' 
                                                                            : 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300'
                                                                        } text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center`}
                                                                >
                                                                    {actionLoading === solicitud.solicitudID ? (
                                                                        <>
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                            Procesando...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="mr-2">
                                                                                {solicitud.estado === 'En Progreso' ? '✅' : '⚠️'}
                                                                            </span>
                                                                            {solicitud.estado === 'En Progreso' 
                                                                                ? 'Finalizar Servicio' 
                                                                                : 'Finalizar (Fuera de Tiempo)'}
                                                                        </>
                                                                    )}
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

            {/* Renderizar el componente Modal al final del JSX */}
            <ActionModal
                show={modal.show}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, show: false })}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
            />
        </>
    );
};

export default SolicitudesActivasSection;