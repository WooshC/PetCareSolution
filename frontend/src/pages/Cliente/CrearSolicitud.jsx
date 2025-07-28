import React, { useState } from 'react'
import { crearSolicitud } from '../../api/solicitud'

export default function CrearSolicitud({ onClose }) {
  const [formData, setFormData] = useState({
    tipoServicio: '',
    descripcion: '',
    ubicacion: '',
    fecha: '',
    hora: '',
    duracion: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        tipoServicio: formData.tipoServicio,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        fechaHoraInicio: `${formData.fecha}T${formData.hora}`,
        duracionHoras: parseInt(formData.duracion),
      }

      await crearSolicitud(payload)
      alert('Solicitud creada exitosamente')
      onClose()
    } catch (error) {
      console.error(error)
      alert('Error al crear la solicitud')
    }
  }

  return (
    <div>
      <h3 className="titulo-seccion mb-3">Nueva Solicitud</h3>
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
            Confirmar Solicitud
          </button>
        </div>
      </form>
    </div>
  )
}
