import React, { useState, useEffect } from 'react';
import { caregiverService } from '../../services/api/caregiverAPI';
import { Edit3, Save, X, User, FileText, Phone, DollarSign, Clock } from 'lucide-react';

const CuidadorPerfil = ({ onLogout, onEditProfile }) => {
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCuidadorProfile();
  }, [token]);

  const fetchCuidadorProfile = async () => {
    try {
      console.log('🔄 Cargando perfil de cuidador...');
      const response = await caregiverService.getProfile(token);
      
      console.log('📋 Respuesta procesada:', response);
      
      if (response.success && response.data) {
        console.log('✅ Perfil de cuidador cargado:', response.data);
        setCuidador(response.data);
        setEditData(response.data); // Inicializar datos de edición
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

  // Función para iniciar edición
  const handleEditStart = () => {
    setEditing(true);
    setEditData(cuidador || {});
    setEditErrors({});
  };

  // Función para cancelar edición
  const handleEditCancel = () => {
    setEditing(false);
    setEditData(cuidador || {});
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

    if (editData.telefonoEmergencia && !/^\d{7,15}$/.test(editData.telefonoEmergencia)) {
      errors.telefonoEmergencia = 'Teléfono inválido';
    }

    if (editData.tarifaPorHora && (editData.tarifaPorHora < 0 || editData.tarifaPorHora > 1000)) {
      errors.tarifaPorHora = 'La tarifa debe estar entre $0 y $1000';
    }

    if (editData.biografia && editData.biografia.length > 500) {
      errors.biografia = 'La biografía no puede exceder 500 caracteres';
    }

    if (editData.experiencia && editData.experiencia.length > 1000) {
      errors.experiencia = 'La experiencia no puede exceder 1000 caracteres';
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
      
      // Filtrar solo los campos que pueden ser editados
      const updateData = {
        documentoIdentidad: editData.documentoIdentidad || '',
        telefonoEmergencia: editData.telefonoEmergencia || '',
        biografia: editData.biografia || '',
        experiencia: editData.experiencia || '',
        tarifaPorHora: editData.tarifaPorHora || 0,
        horarioAtencion: editData.horarioAtencion || ''
      };

      const response = await caregiverService.updateProfile(updateData, token);
      
      if (response.success) {
        console.log('✅ Perfil actualizado exitosamente');
        setCuidador(prev => ({ ...prev, ...updateData }));
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

  // Función para formatear teléfono
  const formatPhone = (phone) => {
    if (!phone) return 'No especificado';
    return phone;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando perfil...</span>
      </div>
    );
  }

  if (error && !cuidador && typeof error === 'string') {
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
      {/* Tarjeta de Bienvenida y Botones */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Bienvenido, {user.name}!
            </h2>
            <p className="text-gray-600">
              Gestiona tus servicios y conecta con dueños de mascotas.
            </p>
          </div>
          
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={handleEditStart}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
              {/* Teléfono Principal (solo lectura) */}
              <div>
                <label className="text-sm text-gray-500">Teléfono Principal</label>
                <p className="font-medium">{formatPhone(user.phoneNumber)}</p>
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
                  <p className="font-medium">{cuidador?.telefonoEmergencia || 'No especificado'}</p>
                )}
              </div>

              {/* Correo Electrónico (solo lectura) */}
              <div>
                <label className="text-sm text-gray-500">Correo Electrónico</label>
                <p className="font-medium">{user.email}</p>
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

          {/* Biografía (editable) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Biografía</h3>
            </div>
            
            {editing ? (
              <div>
                <textarea
                  value={editData.biografia || ''}
                  onChange={(e) => handleEditChange('biografia', e.target.value)}
                  rows="4"
                  className={`w-full p-3 border rounded-lg resize-none ${
                    editErrors.biografia ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Cuéntanos sobre ti, tu experiencia con mascotas y por qué eres un buen cuidador..."
                  maxLength="500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{editErrors.biografia && <span className="text-red-500">{editErrors.biografia}</span>}</span>
                  <span>{(editData.biografia || '').length}/500 caracteres</span>
                </div>
              </div>
            ) : (
              <div>
                {cuidador?.biografia ? (
                  <p className="text-gray-700 leading-relaxed">{cuidador.biografia}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    Aún no has agregado una biografía.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Experiencia (editable) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Experiencia</h3>
            </div>
            
            {editing ? (
              <div>
                <textarea
                  value={editData.experiencia || ''}
                  onChange={(e) => handleEditChange('experiencia', e.target.value)}
                  rows="5"
                  className={`w-full p-3 border rounded-lg resize-none ${
                    editErrors.experiencia ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe tu experiencia previa con mascotas, tipos de animales que has cuidado, certificaciones, etc."
                  maxLength="1000"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{editErrors.experiencia && <span className="text-red-500">{editErrors.experiencia}</span>}</span>
                  <span>{(editData.experiencia || '').length}/1000 caracteres</span>
                </div>
              </div>
            ) : (
              <div>
                {cuidador?.experiencia ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{cuidador.experiencia}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    Aún no has agregado información sobre tu experiencia.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha - Información de Servicios y Estadísticas */}
        <div className="space-y-6">
          {/* Tarifas y Horarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Servicios y Tarifas</h3>
            </div>
            
            <div className="space-y-3">
              {/* Tarifa por Hora (editable) */}
              <div>
                <label className="text-sm text-gray-500">Tarifa por Hora</label>
                {editing ? (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={editData.tarifaPorHora || ''}
                        onChange={(e) => handleEditChange('tarifaPorHora', parseFloat(e.target.value) || 0)}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg ${
                          editErrors.tarifaPorHora ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        min="0"
                        max="1000"
                        step="0.5"
                      />
                    </div>
                    {editErrors.tarifaPorHora && (
                      <p className="text-red-500 text-xs mt-1">{editErrors.tarifaPorHora}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(cuidador?.tarifaPorHora)}
                  </p>
                )}
              </div>

              {/* Horario de Atención (editable) */}
              <div>
                <label className="text-sm text-gray-500">Horario de Atención</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.horarioAtencion || ''}
                    onChange={(e) => handleEditChange('horarioAtencion', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Lunes a Viernes 8:00-18:00"
                  />
                ) : (
                  <p className="font-medium">{cuidador?.horarioAtencion || 'No especificado'}</p>
                )}
              </div>

              {/* Estado (solo lectura) */}
              <div>
                <label className="text-sm text-gray-500">Estado</label>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponible
                </span>
              </div>
            </div>
          </div>

          {/* Calificación (solo lectura) */}
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

          {/* Estadísticas Rápidas (solo lectura) */}
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