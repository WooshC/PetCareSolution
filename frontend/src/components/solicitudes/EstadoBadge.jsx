// src/components/solicitudes/EstadoBadge.jsx
import React from 'react'

export default function EstadoBadge({ estado }) {
  const colores = {
    pendiente: 'warning',
    asignada: 'info',
    aceptada: 'primary',
    'en progreso': 'primary',
    finalizada: 'success',
    cancelada: 'secondary',
    rechazada: 'danger',
  }

  const color = colores[estado?.toLowerCase()] || 'secondary'

  return <span className={`badge bg-${color}`}>{estado}</span>
}
