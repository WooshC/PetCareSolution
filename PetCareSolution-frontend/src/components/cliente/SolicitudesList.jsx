// components/cliente/SolicitudesList.jsx
import React from 'react';
import SolicitudCard from './SolicitudCard';

const SolicitudesList = ({
    solicitudes,
    error,
    onAsignarCuidador,
    onCancelarSolicitud,
    actionLoading,
    onOpenCreateModal,
    onCalificar
}) => {

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
            </div>
        );
    }

    if (solicitudes.length === 0) {
        return (
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
                    onClick={onOpenCreateModal}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                    Crear Mi Primera Solicitud
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {solicitudes.map((solicitud) => (
                <SolicitudCard
                    key={solicitud.solicitudID}
                    solicitud={solicitud}
                    onAsignarCuidador={onAsignarCuidador}
                    onCancelarSolicitud={onCancelarSolicitud}
                    onCalificar={onCalificar}
                    actionLoading={actionLoading}
                />
            ))}

            {/* Sección de próximos pasos - Se mantiene aquí por contexto de la lista */}
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
    );
};

export default SolicitudesList;