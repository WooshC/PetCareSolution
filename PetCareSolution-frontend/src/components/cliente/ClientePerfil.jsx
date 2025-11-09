import React, { useState, useEffect } from 'react';
import { clientService } from '../../services/api/clientAPI';
import { Edit3, Save, X, User, Phone, Shield, Calendar } from 'lucide-react';

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
      const response = await clientService.getProfile(token); // Cambiado a clientService
      
      console.log('📋 Respuesta procesada:', response);
      
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

  // Validación de campos (versión mejorada)
  const validateFields = () => {
    const errors = {};

    // Validar documento de identidad (requerido)
    if (!editData.documentoIdentidad?.trim()) {
      errors.documentoIdentidad = 'El documento de identidad es requerido';
    } else if (!/^\d{10,13}$/.test(editData.documentoIdentidad)) {
      errors.documentoIdentidad = 'Documento de identidad inválido (10-13 dígitos)';
    }

    // Validar teléfono de emergencia (requerido)
    if (!editData.telefonoEmergencia?.trim()) {
      errors.telefonoEmergencia = 'El teléfono de emergencia es requerido';
    } else if (!/^\d{7,15}$/.test(editData.telefonoEmergencia)) {
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
        setError({ type: 'success', message: 'Perfil actualizado exitosamente' });
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
        
        setError({ type: 'success', message: 'Perfil creado exitosamente' });
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
    return new Date(dateString).toLocaleDateString('es-EC');
  };

  // Función para formatear teléfono
  const formatPhone = (phone) => {
    if (!phone) return 'No especificado';
    return phone;
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
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🐾</div>
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Perfil de Cliente No Encontrado
        </h2>
        <p className="text-yellow-700 mb-4">
          {error}
        </p>
        
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
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Ej: 1234567890"
            />
            {editErrors.documentoIdentidad && (
              <p className="text-red-500 text-xs mt-1">{editErrors.documentoIdentidad}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de Emergencia *
            </label>
            <input
              type="text"
              value={editData.telefonoEmergencia || ''}
              onChange={(e) => handleEditChange('telefonoEmergencia', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Ej: 0987654321"
            />
            {editErrors.telefonoEmergencia && (
              <p className="text-red-500 text-xs mt-1">{editErrors.telefonoEmergencia}</p>
            )}
          </div>
          
          <button
            onClick={handleCreateProfile}
            disabled={saving}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Creando...' : 'Crear Perfil de Cliente'}
          </button>
        </div>
      </div>
    );
  }

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

      {/* Resto del componente permanece igual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ... (el resto del JSX permanece igual) ... */}
      </div>
    </div>
  );
};

export default ClientePerfil;