// src/components/cuidador/SolicitudesSection.jsx
import React, { useState, useMemo, useEffect } from 'react'; // 🚨 Agregar useEffect
import { useSolicitudes } from '../../hooks/useSolicitudes';
import { useCuidador } from '../../hooks/useCuidador';
import PerfilUsuario from '../common/PerfilUsuario';
import ActionModal from '../common/ActionModal';
import SolicitudCard from './solicitudes/SolicitudCard';
import { cuidadorSolicitudService } from '../../services/api/cuidadorSolicitudAPI'; // 🚨 Agregar import

const SolicitudesSection = ({ 
  onSolicitudesCountChange, 
  onActionSuccess, // 🚨 Recibir esta prop desde CuidadorMain
  authUser, 
  cuidador 
}) => {
  const {
    solicitudes,
    loading,
    error,
    aceptarSolicitud,
    rechazarSolicitud,
    loadSolicitudes,
    totalPendientes
  } = useSolicitudes();

  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0); // 🚨 Estado local

  const solicitudesAsignadas = useMemo(() => {
    return solicitudes.filter(s => s.estado?.toLowerCase() === 'asignada');
  }, [solicitudes]);
  
  // Estado para el Modal
  const [modal, setModal] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Aceptar',
    showCancelButton: false,
    cancelText: 'Cancelar'
  });

  // Función para cerrar el modal
  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  // 🚨 CORRECCIÓN: useEffect para actualizar contadores
  useEffect(() => {
    const updateCounters = async () => {
      try {
        // Cargar todas las solicitudes para contar correctamente
        const todasSolicitudes = await cuidadorSolicitudService.getMisSolicitudes();
        
        // Contar solicitudes asignadas (Pendiente)
        const asignadasCount = todasSolicitudes.filter(s => 
          s.estado === 'Pendiente' || s.estado?.toLowerCase() === 'asignada'
        ).length;
        
        // 🚀 ACTUALIZAR CONTADOR EN HEADER
        if (onSolicitudesCountChange) {
          onSolicitudesCountChange(asignadasCount);
        }
        
        console.log('Contador de asignadas actualizado:', asignadasCount);
      } catch (error) {
        console.error('Error actualizando contadores:', error);
        // En caso de error, usar el count del hook
        if (onSolicitudesCountChange) {
          onSolicitudesCountChange(solicitudesAsignadas.length);
        }
      }
    };

    updateCounters();
  }, [solicitudesAsignadas.length, onSolicitudesCountChange, localRefreshTrigger]);

  // 🚨 CORRECCIÓN: Función mejorada para aceptar solicitud
  const handleAceptarSolicitud = async (solicitudId) => {
    try {
      setActionLoading(solicitudId);
      const result = await aceptarSolicitud(solicitudId);
      
      if (result.success) {
        setModal({
          show: true, 
          type: 'success', 
          title: '¡Solicitud Aceptada! ✅',
          message: result.message || 'Has aceptado la solicitud exitosamente. Recuerda iniciar el servicio a tiempo.',
          onConfirm: () => { 
            closeModal(); 
            loadSolicitudes();
            setLocalRefreshTrigger(prev => prev + 1); // 🚨 Forzar actualización
            if (onActionSuccess) onActionSuccess(); // 🚨 Notificar al padre
          }, 
          confirmText: 'Entendido', 
          showCancelButton: false
        });
      } else {
        setModal({
          show: true, 
          type: 'error', 
          title: 'Error al Aceptar',
          message: `Error: ${result.message || 'No se pudo aceptar la solicitud'}`,
          onConfirm: closeModal, 
          confirmText: 'Cerrar', 
          showCancelButton: false
        });
      }
    } catch (error) {
      console.error('Error accepting solicitud:', error);
      setModal({
        show: true, 
        type: 'error', 
        title: 'Error de Conexión',
        message: 'Error al aceptar la solicitud. Inténtalo de nuevo.',
        onConfirm: closeModal, 
        confirmText: 'Cerrar', 
        showCancelButton: false
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 🚨 CORRECCIÓN: Función mejorada para rechazar solicitud
  const handleRechazarSolicitud = async (solicitudId) => {
    setModal({
      show: true, 
      type: 'confirm', 
      title: '¿Estás seguro?',
      message: '¿Estás seguro de que quieres rechazar esta solicitud? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          setActionLoading(solicitudId);
          const result = await rechazarSolicitud(solicitudId);
          
          if (result.success) {
            setModal({
              show: true, 
              type: 'success', 
              title: 'Solicitud Rechazada',
              message: result.message || 'La solicitud ha sido rechazada exitosamente.',
              onConfirm: () => { 
                closeModal(); 
                loadSolicitudes();
                setLocalRefreshTrigger(prev => prev + 1); // 🚨 Forzar actualización
                if (onActionSuccess) onActionSuccess(); // 🚨 Notificar al padre
              }, 
              confirmText: 'Entendido', 
              showCancelButton: false
            });
          } else {
            setModal({
              show: true, 
              type: 'error', 
              title: 'Error al Rechazar',
              message: `Error: ${result.message || 'No se pudo rechazar la solicitud'}`,
              onConfirm: closeModal, 
              confirmText: 'Cerrar', 
              showCancelButton: false
            });
          }
        } catch (error) {
          console.error('Error rejecting solicitud:', error);
          setModal({
            show: true, 
            type: 'error', 
            title: 'Error de Conexión',
            message: 'Error al rechazar la solicitud. Inténtalo de nuevo.',
            onConfirm: closeModal, 
            confirmText: 'Cerrar', 
            showCancelButton: false
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

  // Función de formato
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

  // Manejo de estados de carga y error inicial
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
        
        {/* Columna izquierda - Perfil del cuidador */}
        <div className="lg:col-span-1">
          <PerfilUsuario 
            usuario={cuidador}
            tipo="cuidador"
            showStats={true}
            stats={{
              asignadas: solicitudesAsignadas.length,
              aceptadas: solicitudes.filter(s => s.estado?.toLowerCase() === 'aceptada').length
            }}
          />
        </div>

        {/* Columna derecha - Lista de solicitudes ASIGNADAS */}
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
              <span className="mr-2">📋</span>
              Solicitudes Asignadas ({solicitudesAsignadas.length})
            </h2>

            {solicitudesAsignadas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No tienes solicitudes asignadas actualmente
                </h3>
                <p className="text-gray-500">
                  Las solicitudes que aceptaste o te fueron pre-asignadas aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudesAsignadas.map((solicitud) => (
                  <SolicitudCard
                    key={solicitud.solicitudID}
                    solicitud={solicitud}
                    expandedCard={expandedCard}
                    actionLoading={actionLoading}
                    toggleExpanded={setExpandedCard}
                    handleAceptar={handleAceptarSolicitud}
                    handleRechazar={handleRechazarSolicitud}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        showCancelButton={modal.showCancelButton}
      />
    </div>
  );
};

export default SolicitudesSection;