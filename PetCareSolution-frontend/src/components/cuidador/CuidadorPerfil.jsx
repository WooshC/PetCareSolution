import React, { useState, useEffect } from 'react';
import { caregiverService } from '../../services/api/caregiverAPI';

const CuidadorPerfil = ({ onLogout, onEditProfile }) => {
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCuidadorProfile = async () => {
      try {
        console.log('🔄 Cargando perfil de cuidador...');
        const response = await caregiverService.getProfile(token);
        
        console.log('📋 Respuesta procesada:', response);
        
        if (response.success && response.data) {
          console.log('✅ Perfil de cuidador cargado:', response.data);
          setCuidador(response.data);
          setError(null);
        } else {
          console.warn('⚠️ No se encontró perfil de cuidador:', response.error);
          setError(response.error || 'No se encontró perfil de cuidador');
          setCuidador(null);
        }
      } catch (error) {
        console.error('❌ Error cargando perfil de cuidador:', error);
        setError(error.message || 'Error al cargar el perfil');
        setCuidador(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCuidadorProfile();
  }, [token]);

  // Función para formatear moneda
  const formatCurrency = (amount) => {
    if (!amount) return 'No especificada';
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-EC');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  if (error && !cuidador) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🐾</div>
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Perfil de Cuidador No Encontrado
        </h2>
        <p className="text-yellow-700 mb-4">
          {error}
        </p>
        <button
          onClick={onEditProfile}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Crear Perfil de Cuidador
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Tarjeta de Bienvenida */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {user.name}!
        </h2>
        <p className="text-gray-600">
          Gestiona tus servicios y conecta con dueños de mascotas.
        </p>
        {error && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Información del Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Documento de Identidad</label>
                <p className="font-medium">{cuidador?.documentoIdentidad || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono de Emergencia</label>
                <p className="font-medium">{cuidador?.telefonoEmergencia || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Estado de Verificación</label>
                <p>
                  {cuidador?.documentoVerificado ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⏳ Pendiente
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Fecha de Registro</label>
                <p className="font-medium">{formatDate(cuidador?.fechaCreacion)}</p>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biografía</h3>
            {cuidador?.biografia ? (
              <p className="text-gray-700 leading-relaxed">{cuidador.biografia}</p>
            ) : (
              <p className="text-gray-500 italic">
                Aún no has agregado una biografía. 
                <button 
                  onClick={onEditProfile}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Agregar biografía
                </button>
              </p>
            )}
          </div>

          {/* Experiencia */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Experiencia</h3>
            {cuidador?.experiencia ? (
              <p className="text-gray-700 leading-relaxed">{cuidador.experiencia}</p>
            ) : (
              <p className="text-gray-500 italic">
                Aún no has agregado información sobre tu experiencia.
                <button 
                  onClick={onEditProfile}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Agregar experiencia
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Columna Derecha - Información de Servicios y Estadísticas */}
        <div className="space-y-6">
          {/* Tarifas y Horarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Servicios y Tarifas</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Tarifa por Hora</label>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(cuidador?.tarifaPorHora)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Horario de Atención</label>
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

          {/* Calificación */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calificación</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {cuidador?.calificacionPromedio > 0 ? cuidador.calificacionPromedio.toFixed(1) : '0.0'}/5.0
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= (cuidador?.calificacionPromedio || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {cuidador?.calificacionPromedio > 0 ? 'Calificaciones recibidas' : 'Sin calificaciones aún'}
              </p>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
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
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Horas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">Reseñas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuidadorPerfil;