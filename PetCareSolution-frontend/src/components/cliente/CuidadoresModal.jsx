// components/cliente/CuidadoresModal.jsx
import React from 'react';
import { X, Star, CheckCircle } from 'lucide-react';

const CuidadoresModal = ({ isOpen, onClose, onAsignarCuidador, solicitudId, loading }) => {
  // Datos de ejemplo - deberías reemplazar esto con una llamada a tu API
  const cuidadoresDisponibles = [
    {
      cuidadorID: 1,
      nombreUsuario: "Ana García",
      emailUsuario: "ana@example.com",
      biografia: "Cuidadora profesional con 5 años de experiencia en cuidado de mascotas.",
      experiencia: "5 años",
      horarioAtencion: "Lunes a Viernes 8:00-18:00",
      tarifaPorHora: 25,
      calificacionPromedio: 4.8,
      documentoVerificado: true
    },
    {
      cuidadorID: 2,
      nombreUsuario: "Carlos López",
      emailUsuario: "carlos@example.com",
      biografia: "Amante de los animales con especialización en cuidado de perros y gatos.",
      experiencia: "3 años",
      horarioAtencion: "Flexible",
      tarifaPorHora: 20,
      calificacionPromedio: 4.5,
      documentoVerificado: true
    }
  ];

  if (!isOpen) return null;

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Cuidadores Disponibles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {cuidadoresDisponibles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay cuidadores disponibles
              </h3>
              <p className="text-gray-500">
                Intenta más tarde o ajusta los criterios de tu solicitud.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cuidadoresDisponibles.map((cuidador) => (
                <div key={cuidador.cuidadorID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">{cuidador.nombreUsuario}</h3>
                    {cuidador.documentoVerificado && (
                      <span className="flex items-center text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> {cuidador.emailUsuario}
                  </p>

                  {cuidador.biografia && (
                    <p className="text-sm text-gray-700 mb-3">{cuidador.biografia}</p>
                  )}

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      {renderStarRating(cuidador.calificacionPromedio)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({cuidador.calificacionPromedio.toFixed(1)})
                      </span>
                    </div>
                    {cuidador.tarifaPorHora && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        ${cuidador.tarifaPorHora}/hora
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAsignarCuidador(cuidador.cuidadorID)}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Asignando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Elegir Cuidador
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuidadoresModal;