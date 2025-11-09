// components/cliente/SolicitudesSection.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PerfilUsuario from '../common/PerfilUsuario';
import CrearSolicitudModal from './CrearSolicitudModal';
import SolicitudCard from './SolicitudCard';
import CuidadoresModal from './CuidadoresModal';
import { useClienteSolicitudes } from '../../hooks/useClienteSolicitudes';

const SolicitudesSection = ({ onSolicitudesCountChange }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCuidadoresModal, setShowCuidadoresModal] = useState(false);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

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

  const cliente = {
    // Datos vacíos - PerfilUsuario usará los datos reales del localStorage
  };

  // Actualizar contador cuando cambien las solicitudes
  React.useEffect(() => {
    if (onSolicitudesCountChange) {
      onSolicitudesCountChange(totalPendientes);
    }
  }, [totalPendientes, onSolicitudesCountChange]);

  const handleCreateSolicitud = async (solicitudData) => {
    const result = await createSolicitud(solicitudData);
    if (result.success) {
      setShowCreateModal(false);
      alert('Solicitud creada exitosamente');
    } else {
      alert(`Error: ${result.message}`);
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
        alert('Cuidador asignado exitosamente');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Error al asignar el cuidador');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelarSolicitud = async (solicitudId) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    setActionLoading(solicitudId);
    try {
      const result = await cancelarSolicitud(solicitudId);
      if (result.success) {
        alert('Solicitud cancelada exitosamente');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Error al cancelar la solicitud');
    } finally {
      setActionLoading(null);
    }
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
        
        {/* Columna izquierda - Perfil del cliente */}
        <div className="lg:col-span-1">
          <PerfilUsuario 
            usuario={cliente}
            tipo="cliente"
            showStats={false}
          />

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Resumen</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="font-medium">{solicitudes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">Pendientes:</span>
                <span className="font-medium">{totalPendientes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Aceptadas:</span>
                <span className="font-medium">{totalAceptadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600">En Progreso:</span>
                <span className="font-medium">{totalEnProgreso}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Finalizadas:</span>
                <span className="font-medium">{totalFinalizadas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Contenido de solicitudes */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Mis Solicitudes</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {solicitudes.length > 0 
                    ? `${solicitudes.length} solicitud(es) encontrada(s)`
                    : 'Gestiona tus solicitudes de cuidado para mascotas'
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Solicitud
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {solicitudes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay solicitudes
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Comienza creando tu primera solicitud de cuidado para mascotas. 
                  Podrás hacer seguimiento del estado de cada una y gestionar nuevas solicitudes.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Crear Mi Primera Solicitud
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudes.map((solicitud) => (
                  <SolicitudCard
                    key={solicitud.solicitudID}
                    solicitud={solicitud}
                    onAsignarCuidador={handleAsignarCuidador}
                    onCancelarSolicitud={handleCancelarSolicitud}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}

            {/* Sección de próximos pasos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo funciona el proceso?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h5 className="font-medium text-blue-700">Crea tu solicitud</h5>
                  <p className="text-blue-600 text-sm">Describe el servicio, fecha, ubicación y mascota</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h5 className="font-medium text-blue-700">Elige un cuidador</h5>
                  <p className="text-blue-600 text-sm">Selecciona de la lista de cuidadores disponibles</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h5 className="font-medium text-blue-700">Espera confirmación</h5>
                  <p className="text-blue-600 text-sm">El cuidador aceptará o rechazará tu solicitud</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear solicitud */}
      <CrearSolicitudModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSolicitud={handleCreateSolicitud}
        loading={loading}
      />

      {/* Modal para elegir cuidador */}
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
    </div>
  );
};

export default SolicitudesSection;