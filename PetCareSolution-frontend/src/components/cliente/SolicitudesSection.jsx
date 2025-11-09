// components/cliente/SolicitudesSection.jsx
import React from 'react';
import PerfilUsuario from '../common/PerfilUsuario';

const SolicitudesSection = ({ onSolicitudesCountChange }) => {
  // No usar datos de prueba - el componente PerfilUsuario ya obtiene los datos del localStorage
  const cliente = {
    // Datos vacíos - PerfilUsuario usará los datos reales del localStorage
  };

  return (
    <div className="solicitudes-section">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Columna izquierda - Perfil del cliente */}
        <div className="lg:col-span-1">
          <PerfilUsuario 
            usuario={cliente}
            tipo="cliente"
            showStats={false} // Quitamos las estadísticas
          />
        </div>

        {/* Columna derecha - Contenido de solicitudes */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mis Solicitudes</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <span className="mr-2">+</span>
                Nueva Solicitud
              </button>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Solicitudes de Cuidado
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Aquí podrás ver el historial de todas tus solicitudes de cuidado para mascotas. 
                Podrás hacer seguimiento del estado de cada una y gestionar nuevas solicitudes.
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Crear Mi Primera Solicitud
              </button>
            </div>

            {/* Sección de próximos pasos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">¿Cómo funciona?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h5 className="font-medium text-blue-700">Crea una solicitud</h5>
                  <p className="text-blue-600 text-sm">Describe el servicio que necesitas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h5 className="font-medium text-blue-700">Espera propuestas</h5>
                  <p className="text-blue-600 text-sm">Los cuidadores te contactarán</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h5 className="font-medium text-blue-700">Elige al cuidador</h5>
                  <p className="text-blue-600 text-sm">Selecciona el que mejor se adapte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudesSection;