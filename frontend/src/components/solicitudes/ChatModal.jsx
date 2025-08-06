import React, { useEffect, useState } from 'react'
import { getConversacion, enviarMensaje } from '../../api/chat'

export default function ChatModal({ solicitudId, onClose }) {
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')

  useEffect(() => {
    cargarMensajes()
  }, [])

  const cargarMensajes = async () => {
    const data = await getConversacion(solicitudId)
    setMensajes(data)
  }

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim()) return
    await enviarMensaje(solicitudId, nuevoMensaje)
    setNuevoMensaje('')
    cargarMensajes() // refresca después de enviar
  }

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={onClose}>&times;</button>
        <h5>Chat de Solicitud #{solicitudId}</h5>
        
        <div className="chat-mensajes">
          {mensajes.map((m, i) => (
            <p key={i}><strong>{m.remitente}:</strong> {m.texto}</p>
          ))}
        </div>

        <div className="chat-input mt-2">
          <input
            className="form-control"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button className="btn btn-primary mt-1 w-100" onClick={handleEnviar}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
