// src/api/solicitud.js

export async function crearSolicitud(datos) {
  const BASE = import.meta.env.VITE_API_REQUEST
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE}/api/solicitudcliente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al crear solicitud: ${error}`)
  }

  return res.json()
}

// segundo endpoint:

export async function getMisSolicitudes() {
  const BASE = import.meta.env.VITE_API_REQUEST
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE}/api/solicitudcliente/mis-solicitudes`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al obtener mis solicitudes: ${error}`)
  }

  


  //the last

  return res.json()
}

// 🔹 Actualizar solicitud existente
export async function actualizarSolicitud(id, datos) {
  const BASE = import.meta.env.VITE_API_REQUEST
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE}/api/solicitudcliente/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al actualizar solicitud: ${error}`)
  }

  return res.json()
}


