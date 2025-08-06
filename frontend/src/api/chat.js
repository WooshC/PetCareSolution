const BASE = import.meta.env.VITE_API_CHAT
const token = localStorage.getItem('token')

export async function getConversacion(solicitudId) {
  const res = await fetch(`${BASE}/api/chat/conversacion/${solicitudId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function enviarMensaje(solicitudId, mensaje) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ solicitudId, texto: mensaje })
  })
  return res.json()
}
