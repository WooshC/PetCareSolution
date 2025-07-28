// src/api/solicitud.js

export async function crearSolicitud(datos) {
  const res = await fetch('http://localhost:5010/api/SolicitudCliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(datos),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al crear solicitud: ${error}`)
  }

  return await res.json()
}
