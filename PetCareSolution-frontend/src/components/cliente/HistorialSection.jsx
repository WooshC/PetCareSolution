import React from 'react';
import { useClienteSolicitudes } from '../../hooks/useClienteSolicitudes';
import SolicitudCard from './SolicitudCard';

const HistorialSection = () => {
  const { solicitudes, loading, error } = useClienteSolicitudes();

  const historialSolicitudes = solicitudes.filter(s =>
    s.estado === 'Finalizada' || s.estado === 'Cancelada'
  );

  if (loading && solicitudes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Cargando historial...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Historial de Servicios
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Revisa tus servicios pasados y cancelados
          </p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl font-bold text-sm">
          {historialSolicitudes.length} Registros
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      ) : historialSolicitudes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-7xl mb-6">📊</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Sin actividad previa
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Aún no tienes servicios finalizados o cancelados en tu historial.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {historialSolicitudes.map((solicitud) => (
            <div key={solicitud.solicitudID} className="transform transition-all duration-300 hover:scale-[1.01]">
              <SolicitudCard
                solicitud={solicitud}
                actionLoading={false}
              // En historial no solemos permitir cancelar o calificar de nuevo (esto depende de la lógica de SolicitudCard)
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-100">
        <h4 className="text-lg font-bold text-green-800 flex items-center mb-2">
          <span className="mr-2">💡</span> Nota informativa
        </h4>
        <p className="text-green-700 text-sm leading-relaxed">
          Las solicitudes finalizadas aparecen aquí para tu referencia. Si el servicio fue excelente, ¡no olvides calificarlo si aún no lo has hecho!
        </p>
      </div>
    </div>
  );
};

export default HistorialSection;