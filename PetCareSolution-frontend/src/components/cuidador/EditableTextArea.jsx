// components/EditableTextArea.jsx
import React from 'react';
import { FileText } from 'lucide-react';

const EditableTextArea = ({ 
  title, 
  icon: Icon = FileText,
  value, 
  editing, 
  editErrors, 
  fieldName,
  placeholder, 
  maxLength,
  onEditChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      {editing ? (
        <div>
          <textarea
            value={value || ''}
            onChange={(e) => onEditChange(fieldName, e.target.value)}
            rows={fieldName === 'experiencia' ? 5 : 4}
            className={`w-full p-3 border rounded-lg resize-none ${
              editErrors[fieldName] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{editErrors[fieldName] && <span className="text-red-500">{editErrors[fieldName]}</span>}</span>
            <span>{(value || '').length}/{maxLength} caracteres</span>
          </div>
        </div>
      ) : (
        <div>
          {value ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{value}</p>
          ) : (
            <p className="text-gray-500 italic">
              Aún no has agregado {title.toLowerCase()}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableTextArea;