import React, { useState } from 'react'
import { actualizarSolicitud } from '../../api/solicitud'

export default function EditarSolicitud({ solicitud, onClose, onSave }) {
  const fechaInicial = solicitud.fechaHoraInicio
    ? solicitud.fechaHoraInicio.split('T')[0]
    : ''
  const horaInicial = solicitud.fechaHoraInicio
    ? solicitud.fechaHoraInicio.split('T')[1].slice(0, 5)
    : ''

  const [formData, setFormData] = useState({
    tipoServicio: solicitud.tipoServicio || '',
    descripcion: solicitud.descripcion || '',
    ubicacion: solicitud.ubicacion || '',
    fecha: fechaInicial,
    hora: horaInicial,
    duracion: solicitud.duracionHoras || 1,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div>
      <h3 className="titulo-seccion mb-3">Editar Solicitud</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tipo de Servicio</label>
          <select
            name="tipoServicio"
            className="form-select"
            value={formData.tipoServicio}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Cuidado">Cuidado</option>
            <option value="Paseo">Paseo</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            className="form-control"
            value={formData.ubicacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Hora</label>
            <input
              type="time"
              name="hora"
              className="form-control"
              value={formData.hora}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Duración (horas)</label>
          <input
            type="number"
            name="duracion"
            className="form-control"
            min="1"
            value={formData.duracion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="cliente-btn">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  )
}
