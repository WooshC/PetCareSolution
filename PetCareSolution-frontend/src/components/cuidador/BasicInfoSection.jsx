// components/cuidador/BasicInfoSection.jsx
import React from 'react';
import { User } from 'lucide-react';

const BasicInfoSection = ({ 
  authUser, 
  cuidador, 
  editing, 
  editData, 
  editErrors, 
  onEditChange,
  formatPhone,
  formatDate 
}) => {
  // Manejar caso cuando authUser es null (después del logout)
  if (!authUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Información del Perfil</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Sesión cerrada. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Información del Perfil</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Teléfono Principal (solo lectura) */}
        <div>
          <label className="text-sm text-gray-500">Teléfono Principal</label>
          <p className="font-medium">{formatPhone(authUser?.phoneNumber || '')}</p>
          <p className="text-xs text-gray-400">Contacto principal</p>
        </div>

        {/* Documento de Identidad (solo lectura) */}
        <div>
          <label className="text-sm text-gray-500">Documento de Identidad</label>
          <p className="font-medium">{cuidador?.documentoIdentidad || 'No especificado'}</p>
        </div>

        {/* Teléfono de Emergencia (editable) */}
        <div>
          <label className="text-sm text-gray-500">Teléfono de Emergencia</label>
          {editing ? (
            <div>
              <input
                type="text"
                value={editData.telefonoEmergencia || ''}
                onChange={(e) => onEditChange('telefonoEmergencia', e.target.value)}
                className={`w-full p-2 border rounded-lg ${
                  editErrors.telefonoEmergencia ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 0987654321"
              />
              {editErrors.telefonoEmergencia && (
                <p className="text-red-500 text-xs mt-1">{editErrors.telefonoEmergencia}</p>
              )}
            </div>
          ) : (
            <p className="font-medium">{cuidador?.telefonoEmergencia || 'No especificado'}</p>
          )}
        </div>

        {/* Correo Electrónico (solo lectura) */}
        <div>
          <label className="text-sm text-gray-500">Correo Electrónico</label>
          <p className="font-medium">{authUser?.email || 'No disponible'}</p>
          <p className="text-xs text-gray-400">No editable</p>
        </div>

        {/* Estado de Verificación (solo lectura) */}
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

        {/* Fecha de Registro (solo lectura) */}
        <div>
          <label className="text-sm text-gray-500">Fecha de Registro</label>
          <p className="font-medium">{formatDate(cuidador?.fechaCreacion)}</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;