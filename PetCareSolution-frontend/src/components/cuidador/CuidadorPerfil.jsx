// CuidadorPerfil.jsx
import React, { useState, useEffect } from 'react';
import { caregiverService } from '../../services/api/caregiverAPI';
import { CuidadorRequest } from '../../models/Cuidador';

// Importar componentes
import ProfileHeader from './ProfileHeader';
import BasicInfoSection from './BasicInfoSection';
import EditableTextArea from './EditableTextArea';
import ServicesSection from './ServicesSection';
import RatingSection from './RatingSection';
import StatsSection from './StatsSection';

const CuidadorPerfil = ({ authUser, cuidador, loading, error, onEditProfile, onProfileUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  
  const token = localStorage.getItem('token');

  // Inicializar datos de edición cuando se carga el cuidador
  useEffect(() => {
    if (cuidador) {
      setEditData(cuidador);
    }
  }, [cuidador]);

  // Función para iniciar edición
  const handleEditStart = () => {
    setEditing(true);
    setEditData(cuidador || {});
    setEditErrors({});
    setApiError(null);
  };

  // Función para cancelar edición
  const handleEditCancel = () => {
    setEditing(false);
    setEditData(cuidador || {});
    setEditErrors({});
    setApiError(null);
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
    if (!validateFields()) return;

    setSaving(true);
    setApiError(null);
    
    try {
      const updateData = new CuidadorRequest(
        editData.documentoIdentidad,
        editData.telefonoEmergencia,
        editData.biografia,
        editData.experiencia,
        editData.tarifaPorHora,
        editData.horarioAtencion
      );

      const response = await caregiverService.updateProfile(updateData, token);
      
      if (response.success) {
        setEditing(false);
        onProfileUpdate(); // Recargar datos
        setApiError({ type: 'success', message: 'Perfil actualizado exitosamente' });
        setTimeout(() => setApiError(null), 3000);
      } else {
        throw new Error(response.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setApiError({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  // Funciones de formateo
  const formatCurrency = (amount) => {
    if (!amount) return 'No especificada';
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-EC');
  };

  const formatPhone = (phone) => {
    if (!phone) return 'No especificado';
    return phone;
  };

  // Estados de carga y error
  if (loading) {
    return <LoadingState />;
  }

  if (error && !cuidador && typeof error === 'string') {
    return <ErrorState error={error} onEditProfile={onEditProfile} />;
  }

  return (
    <div>
      <ProfileHeader
        userName={authUser?.name || 'Cuidador'}
        editing={editing}
        saving={saving}
        onEditStart={handleEditStart}
        onSave={handleSave}
        onCancel={handleEditCancel}
        error={apiError}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Información del Perfil */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection
            authUser={authUser}
            cuidador={cuidador}
            editing={editing}
            editData={editData}
            editErrors={editErrors}
            onEditChange={handleEditChange}
            formatPhone={formatPhone}
            formatDate={formatDate}
          />

          <EditableTextArea
            title="Biografía"
            value={editing ? editData.biografia : cuidador?.biografia}
            editing={editing}
            editErrors={editErrors}
            fieldName="biografia"
            placeholder="Cuéntanos sobre ti, tu experiencia con mascotas y por qué eres un buen cuidador..."
            maxLength={500}
            onEditChange={handleEditChange}
          />

          <EditableTextArea
            title="Experiencia"
            value={editing ? editData.experiencia : cuidador?.experiencia}
            editing={editing}
            editErrors={editErrors}
            fieldName="experiencia"
            placeholder="Describe tu experiencia previa con mascotas, tipos de animales que has cuidado, certificaciones, etc."
            maxLength={1000}
            onEditChange={handleEditChange}
          />
        </div>

        {/* Columna Derecha - Información de Servicios y Estadísticas */}
        <div className="space-y-6">
          <ServicesSection
            cuidador={cuidador}
            editing={editing}
            editData={editData}
            editErrors={editErrors}
            onEditChange={handleEditChange}
            formatCurrency={formatCurrency}
          />

          <RatingSection cuidador={cuidador} />
          <StatsSection />
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares para estados (sin cambios)
const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">Cargando perfil...</span>
  </div>
);

const ErrorState = ({ error, onEditProfile }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    <div className="text-4xl mb-4">🐾</div>
    <h2 className="text-xl font-semibold text-yellow-800 mb-2">
      Perfil de Cuidador No Encontrado
    </h2>
    <p className="text-yellow-700 mb-4">{error}</p>
    <button
      onClick={onEditProfile}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Crear Perfil de Cuidador
    </button>
  </div>
);

export default CuidadorPerfil;