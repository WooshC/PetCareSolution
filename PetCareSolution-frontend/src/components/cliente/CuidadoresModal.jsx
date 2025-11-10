// components/cliente/CuidadoresModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle, Filter, Search } from 'lucide-react';
import { useCuidadores } from '../../hooks/useCuidadores';

const CuidadoresModal = ({ isOpen, onClose, onAsignarCuidador, solicitudId, loading }) => {
  const { cuidadores, loading: loadingCuidadores, error } = useCuidadores();
  const [filtroCalificacion, setFiltroCalificacion] = useState(0);
  const [filtroVerificados, setFiltroVerificados] = useState(false);
  const [filtroTarifaMax, setFiltroTarifaMax] = useState(100);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Resetear filtros cuando se abre el modal
      setFiltroCalificacion(0);
      setFiltroVerificados(false);
      setFiltroTarifaMax(100);
      setBusqueda('');
    }
  }, [isOpen]);

  // Aplicar filtros
  const cuidadoresFiltrados = cuidadores.filter(cuidador => {
    // Filtro por calificación
    if (filtroCalificacion > 0 && cuidador.calificacionPromedio < filtroCalificacion) {
      return false;
    }
    
    // Filtro por verificación
    if (filtroVerificados && !cuidador.documentoVerificado) {
      return false;
    }
    
    // Filtro por tarifa máxima
    if (cuidador.tarifaPorHora > filtroTarifaMax) {
      return false;
    }
    
    // Filtro por búsqueda
    if (busqueda && !cuidador.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    
    return true;
  });

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

  const getExperienciaText = (experiencia) => {
    if (!experiencia) return 'Sin experiencia especificada';
    if (experiencia.includes('año') || experiencia.includes('años')) return experiencia;
    return `${experiencia} de experiencia`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Cuidadores Disponibles</h2>
            <p className="text-sm text-gray-600 mt-1">
              {cuidadoresFiltrados.length} cuidador(es) encontrado(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda por nombre */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro por calificación */}
            <select
              value={filtroCalificacion}
              onChange={(e) => setFiltroCalificacion(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>Todas las calificaciones</option>
              <option value={4}>4+ estrellas</option>
              <option value={4.5}>4.5+ estrellas</option>
              <option value={5}>5 estrellas</option>
            </select>

            {/* Filtro por tarifa máxima */}
            <select
              value={filtroTarifaMax}
              onChange={(e) => setFiltroTarifaMax(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={100}>Cualquier tarifa</option>
              <option value={20}>Hasta $20/h</option>
              <option value={30}>Hasta $30/h</option>
              <option value={50}>Hasta $50/h</option>
            </select>

            {/* Filtro por verificación */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filtroVerificados}
                onChange={(e) => setFiltroVerificados(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Solo verificados</span>
            </label>
          </div>
        </div>

        <div className="p-6">
          {loadingCuidadores ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Cargando cuidadores...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Error al cargar cuidadores
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : cuidadoresFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No hay cuidadores disponibles
              </h3>
              <p className="text-gray-500">
                {cuidadores.length === 0 
                  ? 'No se encontraron cuidadores registrados en el sistema.'
                  : 'No hay cuidadores que coincidan con tus filtros. Intenta ajustar los criterios.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cuidadoresFiltrados.map((cuidador) => (
                <div key={cuidador.cuidadorID} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {cuidador.nombreUsuario || 'Cuidador'}
                    </h3>
                    {cuidador.documentoVerificado && (
                      <span className="flex items-center text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </span>
                    )}
                  </div>

                  {/* Calificación y tarifa */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      {renderStarRating(cuidador.calificacionPromedio)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({cuidador.calificacionPromedio?.toFixed(1) || '0.0'})
                      </span>
                    </div>
                    {cuidador.tarifaPorHora > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        ${cuidador.tarifaPorHora}/hora
                      </span>
                    )}
                  </div>

                  {/* Información del cuidador */}
                  <div className="space-y-2 mb-4">
                    {cuidador.experiencia && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Experiencia:</span>{' '}
                        {getExperienciaText(cuidador.experiencia)}
                      </p>
                    )}
                    
                    {cuidador.horarioAtencion && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Horario:</span>{' '}
                        {cuidador.horarioAtencion}
                      </p>
                    )}
                  </div>

                  {cuidador.biografia && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {cuidador.biografia}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => onAsignarCuidador(cuidador.cuidadorID)}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg transition-colors flex items-center justify-center font-medium"
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

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Mostrando {cuidadoresFiltrados.length} de {cuidadores.length} cuidadores
          </div>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CuidadoresModal;