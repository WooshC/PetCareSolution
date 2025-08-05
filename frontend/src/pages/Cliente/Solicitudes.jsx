import React, { useEffect, useState } from 'react'
import { getMisSolicitudes, actualizarSolicitud } from '../../api/solicitud'
import SolicitudCard from '../../components/solicitudes/SolicitudCard'
import EditarSolicitud from './EditarSolicitud'

const agruparPorEstado = (solicitudes) => {
  const grupos = {
    pendientes: [],
    aceptadas: [],
    historial: []
  }

  solicitudes.forEach(s => {
    const estado = s.estado?.toLowerCase()

    if (['pendiente', 'asignada'].includes(estado)) {
      grupos.pendientes.push(s)
    } else if (['aceptada', 'en progreso'].includes(estado)) {
      grupos.aceptadas.push(s)
    } else if (['finalizada', 'cancelada', 'rechazada'].includes(estado)) {
      grupos.historial.push(s)
    }
  })

  return grupos
}

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [error, setError] = useState(null)
  const [solicitudEditando, setSolicitudEditando] = useState(null) // 🔹 Nuevo estado

  // Cargar solicitudes
  const cargarSolicitudes = async () => {
    try {
      const data = await getMisSolicitudes()
      setSolicitudes(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  // Abrir modal de edición
  const handleEdit = (solicitud) => {
    setSolicitudEditando(solicitud)
  }

  // Guardar cambios de edición
  const handleSaveEdit = async (datos) => {
    try {
      await actualizarSolicitud(solicitudEditando.solicitudID, {
        tipoServicio: datos.tipoServicio,
        descripcion: datos.descripcion,
        ubicacion: datos.ubicacion,
        fechaHoraInicio: `${datos.fecha}T${datos.hora}`,
        duracionHoras: parseInt(datos.duracion),
      })

      alert('Solicitud actualizada correctamente')
      setSolicitudEditando(null)
      cargarSolicitudes() // refrescar lista
    } catch (err) {
      alert(err.message)
    }
  }

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!solicitudes.length) return <p>No tienes solicitudes registradas.</p>

  const grupos = agruparPorEstado(solicitudes)

  return (
    <div className="p-3">
      <h2>Solicitudes ({solicitudes.length})</h2>

      {/* Pendientes */}
      <h4 className="mt-4">Pendientes / Asignadas</h4>
      {grupos.pendientes.length === 0 && <p>No hay solicitudes pendientes.</p>}
      {grupos.pendientes.map((s) => (
        <SolicitudCard
          key={s.solicitudID}
          solicitud={s}
          onEditar={handleEdit} // 🔹 Cambiado para coincidir con SolicitudCard
        />
      ))}

      {/* Aceptadas / En Progreso */}
      <h4 className="mt-4">Aceptadas / En Progreso</h4>
      {grupos.aceptadas.length === 0 && <p>No hay solicitudes aceptadas.</p>}
      {grupos.aceptadas.map((s) => (
        <SolicitudCard key={s.solicitudID} solicitud={s} />
      ))}

      {/* Historial */}
      <h4 className="mt-4">Historial</h4>
      {grupos.historial.length === 0 && <p>No hay historial de servicios.</p>}
      {grupos.historial.map((s) => (
        <SolicitudCard key={s.solicitudID} solicitud={s} />
      ))}

      {/* Modal de edición */}
        {solicitudEditando && (
    <div className="modal-overlay">
        <div className="modal-contenido">
        <button
            className="modal-cerrar"
            onClick={() => setSolicitudEditando(null)}
        >
            &times;
        </button>

        <EditarSolicitud
            solicitud={solicitudEditando}
            onClose={() => setSolicitudEditando(null)}
            onSave={handleSaveEdit}
        />
        </div>
    </div>
    )}
    </div>
  )
}
