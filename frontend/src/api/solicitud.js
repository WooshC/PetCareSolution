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


// 🔹 Cancelar solicitud (solo si está Pendiente o Asignada)
export async function cancelarSolicitud(id) {
  const BASE = import.meta.env.VITE_API_REQUEST
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE}/api/solicitudcliente/${id}/cancelar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al cancelar solicitud: ${error}`)
  }

  return res.json()
}

// 🔹 Asignar cuidador a solicitud
export async function asignarCuidador(idSolicitud, idCuidador) {
  const BASE = import.meta.env.VITE_API_REQUEST
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE}/api/solicitudcliente/${idSolicitud}/asignar-cuidador`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cuidadorID: idCuidador }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error al asignar cuidador: ${error}`)
  }

  return res.json()
}


