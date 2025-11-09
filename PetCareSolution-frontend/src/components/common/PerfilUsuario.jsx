// src/components/common/PerfilUsuario.jsx
import React from 'react';
import { Mail, Phone, Shield, Star, User } from 'lucide-react';

const PerfilUsuario = ({ 
  usuario, 
  tipo = 'cuidador', // 'cuidador' o 'cliente'
  showStats = false, 
  stats = {},
  className = '' 
}) => {
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const renderStarRating = (rating) => {
    if (!rating || rating === 0) return null;
    
    return (
      <div className="flex space-x-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const user = getCurrentUser();
  
  // Combinar datos del usuario del localStorage con los datos del perfil específico
  const userData = {
    // Datos del localStorage (siempre disponibles)
    nombreUsuario: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    
    // Datos del perfil específico (pueden venir de la API)
    ...usuario
  };

  // Determinar el color y texto según el tipo de usuario
  const getTipoUsuario = () => {
    switch (tipo) {
      case 'cuidador':
        return { 
          color: 'blue', 
          texto: 'Cuidador',
          icono: '🐕'
        };
      case 'cliente':
        return { 
          color: 'green', 
          texto: 'Cliente',
          icono: '❤️'
        };
      default:
        return { 
          color: 'gray', 
          texto: 'Usuario',
          icono: '👤'
        };
    }
  };

  const tipoUsuario = getTipoUsuario();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center ${className}`}>
      {/* Avatar con ícono según tipo de usuario */}
      <div className={`w-16 h-16 bg-${tipoUsuario.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl">{tipoUsuario.icono}</span>
      </div>
      
      {/* Nombre - PRIORIDAD: datos del localStorage */}
      <h3 className="font-semibold text-gray-800 text-lg mb-1">
        {user.name || userData.nombreUsuario || tipoUsuario.texto}
      </h3>
      
      {/* Badge del tipo de usuario */}
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${tipoUsuario.color}-100 text-${tipoUsuario.color}-800 mb-3`}>
        <User className="h-3 w-3 mr-1" />
        {tipoUsuario.texto}
      </span>
      
      {/* Email - PRIORIDAD: datos del localStorage */}
      <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
        <Mail className="h-4 w-4 mr-1" />
        <span>{user.email || userData.email || 'No disponible'}</span>
      </div>
      
      {/* Calificación (solo para cuidadores) */}
      {tipo === 'cuidador' && userData.calificacionPromedio > 0 && (
        <div className="my-4">
          {renderStarRating(userData.calificacionPromedio)}
          <div className="flex items-center justify-center text-gray-600 text-sm mt-1">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            <span>{userData.calificacionPromedio?.toFixed(1) || '0.0'} / 5.0</span>
          </div>
        </div>
      )}

      {/* Tarifa por hora (solo para cuidadores) */}
      {tipo === 'cuidador' && userData.tarifaPorHora && (
        <div className="my-4">
          <span className="text-green-600 font-bold text-lg">
            ${userData.tarifaPorHora}/hora
          </span>
        </div>
      )}

      {/* Teléfono de emergencia - solo si existe en los datos del perfil */}
      {userData.telefonoEmergencia && (
        <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
          <Phone className="h-4 w-4 mr-1" />
          <span>{userData.telefonoEmergencia}</span>
        </div>
      )}

      {/* Teléfono principal - del localStorage */}
      {user.phoneNumber && (
        <div className="flex items-center justify-center text-gray-600 text-sm mb-3">
          <Phone className="h-4 w-4 mr-1" />
          <span>{user.phoneNumber}</span>
        </div>
      )}

      {/* Estado de verificación - solo si existe en los datos del perfil */}
      {userData.documentoVerificado !== undefined && (
        <div className="mt-4">
          {userData.documentoVerificado ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Verificado
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⏳ Pendiente
            </span>
          )}
        </div>
      )}

    
    </div>
  );
};

export default PerfilUsuario;