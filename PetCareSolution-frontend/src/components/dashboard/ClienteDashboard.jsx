// components/dashboard/ClienteDashboard.jsx
import React, { useState, useEffect } from 'react';
import UserProfileCard from './UserProfileCard';
import { clientService } from '../../services/api/clientAPI';

const ClienteDashboard = ({ onLogout, onEditProfile }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClienteProfile = async () => {
      try {
        const response = await clientService.getProfile(token);
        if (response.success) {
          setCliente(response.data);
        }
      } catch (error) {
        console.error('Error cargando perfil de cliente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Tarjeta de presentación del usuario */}
      <UserProfileCard user={user} onEditProfile={onEditProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del cliente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mascotas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mis Mascotas</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">🐾</div>
              <p className="text-gray-600">No tienes mascotas registradas aún.</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Agregar Mascota
              </button>
            </div>
          </div>

          {/* Servicios contratados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Servicios Contratados</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📅</div>
              <p className="text-gray-600">No tienes servicios contratados.</p>
              <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Buscar Cuidadores
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Información personal */}
        <div className="space-y-6">
          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Documento</label>
                <p className="font-medium">{cliente?.documentoIdentidad || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono Emergencia</label>
                <p className="font-medium">{cliente?.telefonoEmergencia || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                🐕 Buscar Cuidadores
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                📝 Registrar Mascota
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                💬 Ver Mensajes
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                ⭐ Dejar Reseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;