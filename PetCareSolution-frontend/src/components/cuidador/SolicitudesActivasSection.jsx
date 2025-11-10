// src/components/cuidador/SolicitudesActivasSection.jsx
import React, { useState, useEffect } from 'react'; 
import { useCuidador } from '../../hooks/useCuidador';
import PerfilUsuario from '../common/PerfilUsuario';
import ActionModal from '../common/ActionModal';
import SolicitudActivaCard from './solicitudes/SolicitudActivaCard'; // 🚨 Cambiar import
import { cuidadorSolicitudService } from '../../services/api/cuidadorSolicitudAPI'; 

const SolicitudesActivasSection = ({ 
  onSolicitudesCountChange, 
  onActionSuccess,
  authUser, 
  cuidador 
}) => {
  const [solicitudesActivas, setSolicitudesActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

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

  useEffect(() => {
    const loadSolicitudesActivas = async () => {
      try {
        setLoading(true);
        const data = await cuidadorSolicitudService.getMisSolicitudesActivas();
        
        setSolicitudesActivas(data);
   
        if (onSolicitudesCountChange) {
          onSolicitudesCountChange(data.length);
        }
        
        console.log('Solicitudes activas cargadas:', data.length);
      } catch (error) {
        console.error('Error cargando solicitudes activas:', error);
        setError(error.message);
        if (onSolicitudesCountChange) {
          onSolicitudesCountChange(0);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSolicitudesActivas();
  }, [onSolicitudesCountChange, localRefreshTrigger]); 

  const reloadSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await cuidadorSolicitudService.getMisSolicitudesActivas();
      setSolicitudesActivas(data);
      
      if (onSolicitudesCountChange) {
        onSolicitudesCountChange(data.length);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error recargando solicitudes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar acciones de servicios activos
  const handleIniciarServicio = async (solicitudId) => {
    try {
      setActionLoading(solicitudId);
      const result = await cuidadorSolicitudService.iniciarServicio(solicitudId);
      
      if (result.success) {
        setModal({
          show: true, 
          type: 'success', 
          title: '¡Servicio Iniciado! 🚀',
          message: result.message || 'El servicio ha sido iniciado exitosamente.',
          onConfirm: () => { 
            closeModal(); 
            reloadSolicitudes();
            setLocalRefreshTrigger(prev => prev + 1);
            if (onActionSuccess) onActionSuccess();
          }, 
          confirmText: 'Entendido', 
          showCancelButton: false
        });
      } else {
        setModal({
          show: true, 
          type: 'error', 
          title: 'Error al Iniciar',
          message: `Error: ${result.message || 'No se pudo iniciar el servicio'}`,
          onConfirm: closeModal, 
          confirmText: 'Cerrar', 
          showCancelButton: false
        });
      }
    } catch (error) {
      console.error('Error iniciando servicio:', error);
      setModal({
        show: true, 
        type: 'error', 
        title: 'Error de Conexión',
        message: 'Error al iniciar el servicio. Inténtalo de nuevo.',
        onConfirm: closeModal, 
        confirmText: 'Cerrar', 
        showCancelButton: false
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinalizarServicio = async (solicitudId) => {
    setModal({
      show: true, 
      type: 'confirm', 
      title: '¿Finalizar Servicio?',
      message: '¿Estás seguro de que quieres finalizar este servicio? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          setActionLoading(solicitudId);
          const result = await cuidadorSolicitudService.finalizarServicio(solicitudId);
          
          if (result.success) {
            setModal({
              show: true, 
              type: 'success', 
              title: '¡Servicio Finalizado! ✅',
              message: result.message || 'El servicio ha sido finalizado exitosamente.',
              onConfirm: () => { 
                closeModal(); 
                reloadSolicitudes();
                setLocalRefreshTrigger(prev => prev + 1);
                if (onActionSuccess) onActionSuccess();
              }, 
              confirmText: 'Entendido', 
              showCancelButton: false
            });
          } else {
            setModal({
              show: true, 
              type: 'error', 
              title: 'Error al Finalizar',
              message: `Error: ${result.message || 'No se pudo finalizar el servicio'}`,
              onConfirm: closeModal, 
              confirmText: 'Cerrar', 
              showCancelButton: false
            });
          }
        } catch (error) {
          console.error('Error finalizando servicio:', error);
          setModal({
            show: true, 
            type: 'error', 
            title: 'Error de Conexión',
            message: 'Error al finalizar el servicio. Inténtalo de nuevo.',
            onConfirm: closeModal, 
            confirmText: 'Cerrar', 
            showCancelButton: false
          });
        } finally {
          setActionLoading(null);
        }
      },
      confirmText: 'Sí, Finalizar', 
      showCancelButton: true, 
      cancelText: 'Cancelar'
    });
  };

  // Función de formato de fecha
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

  // Manejo de estados de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando servicios activos...</span>
      </div>
    );
  }

  if (error && solicitudesActivas.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={reloadSolicitudes}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitudes-activas-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Columna izquierda - Perfil del cuidador */}
        <div className="lg:col-span-1">
          <PerfilUsuario 
            usuario={cuidador}
            tipo="cuidador"
            showStats={true}
            stats={{
              activas: solicitudesActivas.length,
              completadas: 0
            }}
          />
        </div>

        {/* Columna derecha - Lista de servicios activos */}
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
              <span className="mr-2">✅</span>
              Servicios Activos ({solicitudesActivas.length})
            </h2>

            {solicitudesActivas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No tienes servicios activos
                </h3>
                <p className="text-gray-500">
                  Los servicios que aceptes aparecerán aquí para que puedas gestionarlos.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudesActivas.map((solicitud) => (
                  <SolicitudActivaCard // 🚨 Usar el nuevo componente
                    key={solicitud.solicitudID}
                    solicitud={solicitud}
                    expandedCard={expandedCard}
                    actionLoading={actionLoading}
                    toggleExpanded={setExpandedCard}
                    handleIniciar={handleIniciarServicio}
                    handleFinalizar={handleFinalizarServicio}
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

export default SolicitudesActivasSection;