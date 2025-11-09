import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/api/clientAPI';
import { Edit3, Save, X, User, Phone, Shield, Calendar, Mail } from 'lucide-react';

const ClientePerfil = ({ onLogout, onEditProfile }) => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClienteProfile();
  }, [token]);

  const fetchClienteProfile = async () => {
    try {
      console.log('🔄 Cargando perfil de cliente...');
      const response = await clientService.getProfile(token);
      
      console.log('📋 Respuesta del servicio:', response);
      
      if (response.success && response.data) {
        console.log('✅ Perfil de cliente cargado:', response.data);
        setCliente(response.data);
        setEditData(response.data);
        setError(null);
      } else {
        console.warn('⚠️ No se encontró perfil de cliente:', response.error);
        setError(response.error || 'No se encontró perfil de cliente');
        setCliente(null);
      }
    } catch (error) {
      console.error('❌ Error cargando perfil de cliente:', error);
      setError(error.message || 'Error al cargar el perfil');
      setCliente(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar edición
  const handleEditStart = () => {
    setEditing(true);
    setEditData(cliente || {});
    setEditErrors({});
  };

  // Función para cancelar edición
  const handleEditCancel = () => {
    setEditing(false);
    setEditData(cliente || {});
    setEditErrors({});
  };

  // Función para manejar cambios en los campos editables
  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (editErrors[field]) {
      setEditErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validación de campos
  const validateFields = () => {
    const errors = {};

    // Validar documento de identidad (requerido)
    if (!editData.documentoIdentidad?.trim()) {
      errors.documentoIdentidad = 'El documento de identidad es requerido';
    } else if (!/^\d{10,13}$/.test(editData.documentoIdentidad)) {
      errors.documentoIdentidad = 'Documento de identidad inválido (10-13 dígitos)';
    }

    // Validar teléfono de emergencia
    if (editData.telefonoEmergencia && !/^\d{7,15}$/.test(editData.telefonoEmergencia)) {
      errors.telefonoEmergencia = 'Teléfono de emergencia inválido (7-15 dígitos)';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para guardar cambios
  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Guardando cambios...', editData);
      
      const updateData = {
        documentoIdentidad: editData.documentoIdentidad || '',
        telefonoEmergencia: editData.telefonoEmergencia || ''
      };

      const response = await clientService.updateProfile(updateData, token);
      
      if (response.success) {
        console.log('✅ Perfil actualizado exitosamente');
        setCliente(prev => ({ ...prev, ...updateData }));
        setEditing(false);
        setError(null);
        
        // Mostrar mensaje de éxito
        setError({ type: 'success', message: response.message || 'Perfil actualizado exitosamente' });
        setTimeout(() => setError(null), 3000);
      } else {
        throw new Error(response.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error guardando perfil:', error);
      setError({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Función para crear perfil si no existe
  const handleCreateProfile = async () => {
    if (!validateFields()) {
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        documentoIdentidad: editData.documentoIdentidad || '',
        telefonoEmergencia: editData.telefonoEmergencia || ''
      };

      const response = await clientService.createProfile(profileData, token);
      
      if (response.success) {
        console.log('✅ Perfil creado exitosamente');
        setCliente(response.data);
        setEditing(false);
        setError(null);
        
        setError({ type: 'success', message: response.message || 'Perfil creado exitosamente' });
        setTimeout(() => setError(null), 3000);
      } else {
        throw new Error(response.error || 'Error al crear el perfil');
      }
    } catch (error) {
      console.error('❌ Error creando perfil:', error);
      setError({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para formatear teléfono
  const formatPhone = (phone) => {
    if (!phone) return 'No especificado';
    return phone;
  };

  // Función para obtener el estado de verificación
  const getVerificationStatus = () => {
    if (!cliente) return { text: 'No disponible', color: 'gray' };
    
    if (cliente.documentoVerificado) {
      return { text: '✅ Verificado', color: 'green' };
    } else {
      return { text: '⏳ Pendiente', color: 'yellow' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  // Si no hay perfil de cliente, mostrar opción para crear
  if (error && !cliente && typeof error === 'string') {
    const verificationStatus = getVerificationStatus();
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🐾</div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Perfil de Cliente No Encontrado
          </h2>
          <p className="text-yellow-700">
            {error}
          </p>
        </div>
        
        {/* Formulario para crear perfil */}
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento de Identidad *
            </label>
            <input
              type="text"
              value={editData.documentoIdentidad || ''}
              onChange={(e) => handleEditChange('documentoIdentidad', e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                editErrors.documentoIdentidad ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 1234567890"
              maxLength={13}
            />
            {editErrors.documentoIdentidad && (
              <p className="text-red-500 text-xs mt-1">{editErrors.documentoIdentidad}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de Emergencia
            </label>
            <input
              type="text"
              value={editData.telefonoEmergencia || ''}
              onChange={(e) => handleEditChange('telefonoEmergencia', e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                editErrors.telefonoEmergencia ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 0987654321"
              maxLength={15}
            />
            {editErrors.telefonoEmergencia && (
              <p className="text-red-500 text-xs mt-1">{editErrors.telefonoEmergencia}</p>
            )}
          </div>
          
          <button
            onClick={handleCreateProfile}
            disabled={saving}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-medium"
          >
            {saving ? 'Creando Perfil...' : 'Crear Perfil de Cliente'}
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();

  return (
    <div>
      {/* Tarjeta de Bienvenida y Botones */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Bienvenido, {user.name}!
            </h2>
            <p className="text-gray-600">
              Gestiona tus mascotas y encuentra cuidadores confiables.
            </p>
          </div>
          
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={handleEditStart}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Editar Perfil</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensajes de éxito/error */}
        {error && typeof error === 'object' && (
          <div className={`mt-3 rounded p-3 ${
            error.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Información del Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Información del Perfil</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             

              {/* Documento de Identidad */}
              <div>
                <label className="text-sm text-gray-500">Documento de Identidad</label>
                {editing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.documentoIdentidad || ''}
                      onChange={(e) => handleEditChange('documentoIdentidad', e.target.value)}
                      className={`w-full p-2 border rounded-lg ${
                        editErrors.documentoIdentidad ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: 1234567890"
                    />
                    {editErrors.documentoIdentidad && (
                      <p className="text-red-500 text-xs mt-1">{editErrors.documentoIdentidad}</p>
                    )}
                  </div>
                ) : (
                  <p className="font-medium">{cliente?.documentoIdentidad || 'No especificado'}</p>
                )}
              </div>

              {/* Teléfono de Emergencia */}
              <div>
                <label className="text-sm text-gray-500">Teléfono de Emergencia</label>
                {editing ? (
                  <div>
                    <input
                      type="text"
                      value={editData.telefonoEmergencia || ''}
                      onChange={(e) => handleEditChange('telefonoEmergencia', e.target.value)}
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
                  <p className="font-medium">{cliente?.telefonoEmergencia || 'No especificado'}</p>
                )}
              </div>

              {/* Estado de Verificación */}
              <div>
                <label className="text-sm text-gray-500">Estado de Verificación</label>
                <p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${verificationStatus.color}-100 text-${verificationStatus.color}-800`}>
                    {verificationStatus.text}
                  </span>
                </p>
              </div>

              {/* Fecha de Registro */}
              <div>
                <label className="text-sm text-gray-500">Fecha de Registro</label>
                <p className="font-medium">{formatDate(cliente?.fechaCreacion)}</p>
              </div>

              {/* Última Actualización */}
              <div>
                <label className="text-sm text-gray-500">Última Actualización</label>
                <p className="font-medium">{formatDate(cliente?.fechaActualizacion)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Información Adicional */}
        <div className="space-y-6">
          {/* Información de Usuario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Información de Usuario</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nombre</label>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Teléfono Principal</label>
                <p className="font-medium">{formatPhone(user.phoneNumber)}</p>
              </div>
            </div>
          </div>

          {/* Estado del Perfil */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Estado del Perfil</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Perfil Completo</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Activo</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verificación</span>
                <span className={`bg-${verificationStatus.color}-100 text-${verificationStatus.color}-800 text-xs px-2 py-1 rounded-full`}>
                  {cliente?.documentoVerificado ? 'Completada' : 'Pendiente'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estado</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {cliente?.estado || 'Activo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientePerfil;