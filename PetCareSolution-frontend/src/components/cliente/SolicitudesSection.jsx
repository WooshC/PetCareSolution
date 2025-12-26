// components/cliente/SolicitudesSection.jsx
import React, { useState } from 'react';
// Importamos los nuevos subcomponentes
import SolicitudesStats from './SolicitudesStats';
import SolicitudesHeader from './SolicitudesHeader';
import SolicitudesList from './SolicitudesList';

import CrearSolicitudModal from './CrearSolicitudModal';
import CuidadoresModal from './CuidadoresModal';
import CalificarModal from './CalificarModal';
import ActionModal from '../common/ActionModal';
import { useClienteSolicitudes } from '../../hooks/useClienteSolicitudes';

const SolicitudesSection = ({ onSolicitudesCountChange }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCuidadoresModal, setShowCuidadoresModal] = useState(false);
    const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [showCalificarModal, setShowCalificarModal] = useState(false);
    const [selectedSolicitudForRating, setSelectedSolicitudForRating] = useState(null);

    // Estado para el ActionModal
    const [modal, setModal] = useState({
        show: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
        confirmText: 'Aceptar',
        showCancelButton: false,
        cancelText: 'Cerrar'
    });

    const {
        solicitudes,
        loading,
        error,
        createSolicitud,
        asignarCuidador,
        cancelarSolicitud,
        totalPendientes,
        totalAceptadas,
        totalEnProgreso,
        totalFinalizadas
    } = useClienteSolicitudes();

    // Actualizar contador cuando cambien las solicitudes
    React.useEffect(() => {
        if (onSolicitudesCountChange) {
            onSolicitudesCountChange(totalPendientes);
        }
    }, [totalPendientes, onSolicitudesCountChange]);

    const handleCreateSolicitud = async (solicitudData) => {
        try {
            const result = await createSolicitud(solicitudData);
            if (result.success) {
                setShowCreateModal(false);
                // Mostrar Modal de éxito
                setModal({
                    show: true,
                    type: 'success',
                    title: '¡Solicitud Creada! ✅',
                    message: 'Tu solicitud ha sido creada exitosamente. Ahora puedes asignar un cuidador.',
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Entendido',
                    showCancelButton: false
                });
            } else {
                // Mostrar Modal de error
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Error al Crear',
                    message: `Error: ${result.message}`,
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Cerrar',
                    showCancelButton: false
                });
            }
        } catch (error) {
            console.error('Error creating solicitud:', error);
            setModal({
                show: true,
                type: 'error',
                title: 'Error de Conexión',
                message: 'Error al crear la solicitud. Inténtalo de nuevo.',
                onConfirm: () => setModal({ ...modal, show: false }),
                confirmText: 'Cerrar',
                showCancelButton: false
            });
        }
    };

    const handleAsignarCuidador = (solicitudId) => {
        setSelectedSolicitudId(solicitudId);
        setShowCuidadoresModal(true);
    };

    const handleConfirmarAsignacion = async (cuidadorId) => {
        setActionLoading(selectedSolicitudId);
        try {
            const result = await asignarCuidador(selectedSolicitudId, cuidadorId);
            if (result.success) {
                setShowCuidadoresModal(false);
                setSelectedSolicitudId(null);
                // Mostrar Modal de éxito
                setModal({
                    show: true,
                    type: 'success',
                    title: '¡Cuidador Asignado! 👥',
                    message: 'El cuidador ha sido asignado exitosamente. Espera su confirmación.',
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Entendido',
                    showCancelButton: false
                });
            } else {
                // Mostrar Modal de error
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Error al Asignar',
                    message: `Error: ${result.message}`,
                    onConfirm: () => setModal({ ...modal, show: false }),
                    confirmText: 'Cerrar',
                    showCancelButton: false
                });
            }
        } catch (error) {
            console.error('Error assigning cuidador:', error);
            setModal({
                show: true,
                type: 'error',
                title: 'Error de Conexión',
                message: 'Error al asignar el cuidador. Inténtalo de nuevo.',
                onConfirm: () => setModal({ ...modal, show: false }),
                confirmText: 'Cerrar',
                showCancelButton: false
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancelarSolicitud = async (solicitudId) => {
        // Mostrar Modal de confirmación
        setModal({
            show: true,
            type: 'confirm', // Se asume que ActionModal maneja el tipo 'confirm' o se usa 'info' con botones dobles
            title: '¿Estás seguro?',
            message: '¿Estás seguro de que deseas cancelar esta solicitud? Esta acción no se puede deshacer.',
            onConfirm: async () => {
                setModal({ ...modal, show: false }); // Cerrar modal de confirmación
                try {
                    setActionLoading(solicitudId);
                    const result = await cancelarSolicitud(solicitudId);
                    if (result.success) {
                        // Mostrar Modal de éxito
                        setModal({
                            show: true,
                            type: 'success',
                            title: 'Solicitud Cancelada',
                            message: 'La solicitud ha sido cancelada exitosamente.',
                            onConfirm: () => setModal({ ...modal, show: false }),
                            confirmText: 'Entendido',
                            showCancelButton: false
                        });
                    } else {
                        // Mostrar Modal de error
                        setModal({
                            show: true,
                            type: 'error',
                            title: 'Error al Cancelar',
                            message: `Error: ${result.message}`,
                            onConfirm: () => setModal({ ...modal, show: false }),
                            confirmText: 'Cerrar',
                            showCancelButton: false
                        });
                    }
                } catch (error) {
                    console.error('Error canceling solicitud:', error);
                    setModal({
                        show: true,
                        type: 'error',
                        title: 'Error de Conexión',
                        message: 'Error al cancelar la solicitud. Inténtalo de nuevo.',
                        onConfirm: () => setModal({ ...modal, show: false }),
                        confirmText: 'Cerrar',
                        showCancelButton: false
                    });
                } finally {
                    setActionLoading(null);
                }
            },
            confirmText: 'Sí, Cancelar',
            showCancelButton: true,
            cancelText: 'Mantener'
        });
    };

    const handleCalificar = (solicitud) => {
        setSelectedSolicitudForRating(solicitud);
        setShowCalificarModal(true);
    };

    const handleCalificarSuccess = () => {
        setModal({
            show: true,
            type: 'success',
            title: '¡Gracias por calificar!',
            message: 'Tu calificación ha sido registrada exitosamente.',
            onConfirm: () => setModal({ ...modal, show: false }),
            confirmText: 'Cerrar',
            showCancelButton: false
        });
    };

    if (loading && solicitudes.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando solicitudes...</span>
            </div>
        );
    }

    return (
        <div className="solicitudes-section">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Columna izquierda - Stats */}
                <SolicitudesStats
                    totalSolicitudes={solicitudes.length}
                    totalPendientes={totalPendientes}
                    totalAceptadas={totalAceptadas}
                    totalEnProgreso={totalEnProgreso}
                    totalFinalizadas={totalFinalizadas}
                />

                {/* Columna derecha - Contenido de solicitudes */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">

                        {/* Header */}
                        <SolicitudesHeader
                            totalSolicitudes={solicitudes.length}
                            onOpenCreateModal={() => setShowCreateModal(true)}
                        />

                        {/* Lista de Solicitudes */}
                        <SolicitudesList
                            solicitudes={solicitudes}
                            error={error}
                            onAsignarCuidador={handleAsignarCuidador}
                            onCancelarSolicitud={handleCancelarSolicitud}
                            onCalificar={handleCalificar}
                            actionLoading={actionLoading}
                            onOpenCreateModal={() => setShowCreateModal(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Modales */}
            <CrearSolicitudModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateSolicitud={handleCreateSolicitud}
                loading={loading}
            />

            <CuidadoresModal
                isOpen={showCuidadoresModal}
                onClose={() => {
                    setShowCuidadoresModal(false);
                    setSelectedSolicitudId(null);
                }}
                onAsignarCuidador={handleConfirmarAsignacion}
                solicitudId={selectedSolicitudId}
                loading={actionLoading === selectedSolicitudId}
            />

            {showCalificarModal && selectedSolicitudForRating && (
                <CalificarModal
                    solicitud={selectedSolicitudForRating}
                    onClose={() => {
                        setShowCalificarModal(false);
                        setSelectedSolicitudForRating(null);
                    }}
                    onSuccess={handleCalificarSuccess}
                />
            )}

            {/* ActionModal para todas las acciones */}
            <ActionModal
                show={modal.show}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, show: false })}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                showCancelButton={modal.showCancelButton}
            />
        </div>
    );
};

export default SolicitudesSection;