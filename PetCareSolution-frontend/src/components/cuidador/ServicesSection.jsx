// components/ServicesSection.jsx
import React from 'react';
import { DollarSign, Clock } from 'lucide-react';

const ServicesSection = ({ 
  cuidador, 
  editing, 
  editData, 
  editErrors, 
  onEditChange,
  formatCurrency 
}) => {
  return (
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
                  onChange={(e) => onEditChange('tarifaPorHora', parseFloat(e.target.value) || 0)}
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
              onChange={(e) => onEditChange('horarioAtencion', e.target.value)}
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
  );
};

export default ServicesSection;