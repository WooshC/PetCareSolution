import React, { useState } from 'react'
import EstadoBadge from './EstadoBadge'
import { getCuidadores } from '../../api/cuidador'
import ChatModal from './ChatModal' // 🔹 Importa el modal de chat

export default function SolicitudCard({ solicitud, onEditar, onSolicitar, onCancelar }) {
  const [showDetail, setShowDetail] = useState(false)
  const [cuidadores, setCuidadores] = useState([])
  const [loadingCuidadores, setLoadingCuidadores] = useState(false)
  const [expandedCuidadores, setExpandedCuidadores] = useState({}) // Controla Ver Detalle por cuidador
  const [showChat, setShowChat] = useState(false) // 🔹 Nuevo estado para chat

  const estado = solicitud.estado?.toLowerCase()
  const esPendiente = estado === 'pendiente'
  const esAsignada = estado === 'asignada'
  const esAceptada = estado === 'aceptada' || estado === 'en progreso'
  const esHistorial = ['finalizada', 'cancelada', 'rechazada'].includes(estado)

  const toggleDetail = async () => {
    const newState = !showDetail
    setShowDetail(newState)

    // Solo cargamos cuidadores si es Pendiente y nunca los hemos cargado
    if (newState && esPendiente && cuidadores.length === 0) {
      setLoadingCuidadores(true)
      try {
        const data = await getCuidadores()
        setCuidadores(data)
      } catch (error) {
        console.error('Error cargando cuidadores', error)
      } finally {
        setLoadingCuidadores(false)
      }
    }
  }

  const toggleCuidadorDetail = (cuidadorID) => {
    setExpandedCuidadores(prev => ({
      ...prev,
      [cuidadorID]: !prev[cuidadorID]
    }))
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">{solicitud.descripcion}</h5>
            <EstadoBadge estado={solicitud.estado} />
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={toggleDetail}
            >
              {showDetail ? 'Ocultar Detalle' : 'Ver Detalle'}
            </button>
            {(esPendiente || esAsignada) && (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => onEditar && onEditar(solicitud)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onCancelar && onCancelar(solicitud)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Detalle expandible */}
        {showDetail && (
          <div className="mt-3 border-top pt-2">
            <p><strong>Fecha:</strong> {new Date(solicitud.fechaHoraInicio).toLocaleString('es-EC')}</p>
            <p><strong>Duración:</strong> {solicitud.duracionHoras || 'N/A'} hora(s)</p>
            <p><strong>Ubicación:</strong> {solicitud.ubicacion || 'No especificada'}</p>

            {esPendiente && (
              <div className="mt-2">
                <p><strong>Cuidadores sugeridos:</strong></p>
                {loadingCuidadores && <p>Cargando cuidadores...</p>}
                {!loadingCuidadores && cuidadores.length === 0 && <p>No hay cuidadores disponibles.</p>}
                <ul className="list-unstyled">
                  {cuidadores.map((c) => (
                    <li key={c.cuidadorID} className="mb-3 border-bottom pb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          {c.nombreUsuario || `Cuidador #${c.cuidadorID}`}
                          {c.tarifaPorHora ? ` - $${c.tarifaPorHora}/h` : ''}
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => console.log('Ver Perfil', c)}
                          >
                            Ver Perfil
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => toggleCuidadorDetail(c.cuidadorID)}
                          >
                            {expandedCuidadores[c.cuidadorID] ? 'Ocultar Detalle' : 'Ver Detalle'}
                          </button>
                        </div>
                      </div>

                      {expandedCuidadores[c.cuidadorID] && (
                        <div className="mt-2 ps-3">
                          <p><strong>Biografía:</strong> {c.biografia || 'No especificada'}</p>
                          <p><strong>Experiencia:</strong> {c.experiencia || 'No especificada'}</p>
                          <p><strong>Tarifa por hora:</strong> {c.tarifaPorHora ? `$${c.tarifaPorHora}` : 'N/A'}</p>
                          <button className="btn btn-sm btn-outline-success me-2">
                            Chat
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => onSolicitar && onSolicitar(solicitud, c)}
                          >
                            Solicitar
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {esAsignada && (
              <div className="mt-2">
                <p><strong>Cuidador asignado:</strong> {solicitud.nombreCuidador || 'N/A'}</p>
              </div>
            )}

            {esAceptada && (
              <div className="mt-2">
                <p><strong>Cuidador:</strong> {solicitud.nombreCuidador || 'N/A'}</p>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setShowChat(true)} // 🔹 Abrir chat
                >
                  Abrir Chat
                </button>

                {showChat && (
                  <ChatModal 
                    solicitudId={solicitud.solicitudID} 
                    onClose={() => setShowChat(false)} 
                  />
                )}
              </div>
            )}

            {esHistorial && (
              <div className="mt-2">
                <p><strong>Estado final:</strong> {solicitud.estado}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
