// components/dashboard/CuidadorDashboard.jsx
import React, { useState, useEffect } from 'react';
import UserProfileCard from './UserProfileCard';
import { caregiverService } from '../../services/api/caregiverAPI';

const CuidadorDashboard = ({ onLogout, onEditProfile }) => {
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCuidadorProfile = async () => {
      try {
        const response = await caregiverService.getProfile(token);
        if (response.success) {
          setCuidador(response.data);
        }
      } catch (error) {
        console.error('Error cargando perfil de cuidador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuidadorProfile();
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
        {/* Columna izquierda - Información del cuidador */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biografía */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biografía</h3>
            <p className="text-gray-600">
              {cuidador?.biografia || 'No has agregado una biografía aún.'}
            </p>
          </div>

          {/* Experiencia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Experiencia</h3>
            <p className="text-gray-600">
              {cuidador?.experiencia || 'No has agregado información sobre tu experiencia.'}
            </p>
          </div>

          {/* Servicios ofrecidos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Servicios Ofrecidos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Paseos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Guardería</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Visitas a domicilio</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Cuidado especial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Información de contacto y tarifas */}
        <div className="space-y-6">
          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Documento</label>
                <p className="font-medium">{cuidador?.documentoIdentidad || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono Emergencia</label>
                <p className="font-medium">{cuidador?.telefonoEmergencia || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tarifas y horarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tarifas y Horarios</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Tarifa por hora</label>
                <p className="text-xl font-bold text-green-600">
                  {cuidador?.tarifaPorHora ? `$${cuidador.tarifaPorHora}` : 'No especificada'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Horario de atención</label>
                <p className="font-medium">{cuidador?.horarioAtencion || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Estado</label>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponible
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Servicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">Horas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Reseñas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuidadorDashboard;