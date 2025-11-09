// src/components/cliente/CrearSolicitudModal.jsx
import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, DollarSign, FileText } from 'lucide-react';
import { SolicitudTiposServicio } from '../../models/Solicitud';

const CrearSolicitudModal = ({ isOpen, onClose, onCreateSolicitud, loading }) => {
  const [formData, setFormData] = useState({
    tipoServicio: '',
    descripcion: '',
    fechaHoraInicio: '',
    duracionHoras: 1,
    ubicacion: '',
    cuidadorID: null // Opcional - para asignar directamente
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipoServicio) {
      newErrors.tipoServicio = 'El tipo de servicio es requerido';
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.fechaHoraInicio) {
      newErrors.fechaHoraInicio = 'La fecha y hora son requeridas';
    } else if (new Date(formData.fechaHoraInicio) <= new Date()) {
      newErrors.fechaHoraInicio = 'La fecha debe ser futura';
    }

    if (!formData.duracionHoras || formData.duracionHoras < 1) {
      newErrors.duracionHoras = 'La duración debe ser al menos 1 hora';
    }

    if (!formData.ubicacion) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onCreateSolicitud(formData);
      // Limpiar formulario después de crear
      setFormData({
        tipoServicio: '',
        descripcion: '',
        fechaHoraInicio: '',
        duracionHoras: 1,
        ubicacion: '',
        cuidadorID: null
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating solicitud:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      tipoServicio: '',
      descripcion: '',
      fechaHoraInicio: '',
      duracionHoras: 1,
      ubicacion: '',
      cuidadorID: null
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Crear Nueva Solicitud</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio *
            </label>
            <select
              name="tipoServicio"
              value={formData.tipoServicio}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.tipoServicio ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un tipo de servicio</option>
              {Object.entries(SolicitudTiposServicio).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {errors.tipoServicio && (
              <p className="text-red-500 text-sm mt-1">{errors.tipoServicio}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Servicio *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              placeholder="Describe qué necesitas para tu mascota (comportamiento, necesidades especiales, etc.)"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha y Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="datetime-local"
                  name="fechaHoraInicio"
                  value={formData.fechaHoraInicio}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fechaHoraInicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.fechaHoraInicio && (
                <p className="text-red-500 text-sm mt-1">{errors.fechaHoraInicio}</p>
              )}
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (horas) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="duracionHoras"
                  value={formData.duracionHoras}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duracionHoras ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.duracionHoras && (
                <p className="text-red-500 text-sm mt-1">{errors.duracionHoras}</p>
              )}
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Dirección donde se realizará el servicio"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ubicacion ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.ubicacion && (
              <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Crear Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearSolicitudModal;