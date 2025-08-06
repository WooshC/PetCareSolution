import React, { useEffect, useState, useRef } from 'react'
import { getConversacion, enviarMensaje } from '../../api/chat'
import useAuth from '../../hooks/useAuth'

export default function ChatModal({ solicitudId, onClose }) {
  const { user } = useAuth()
  const [mensajes, setMensajes] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const endRef = useRef(null)

  const cargarMensajes = async () => {
    const data = await getConversacion(solicitudId)
    setMensajes(data)
  }

  useEffect(() => {
    cargarMensajes()
    const interval = setInterval(cargarMensajes, 3000) // polling temporal
    return () => clearInterval(interval)
  }, [solicitudId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const handleEnviar = async () => {
  if (!nuevoMensaje.trim()) return;

  const mensajeTemporal = {
    senderId: user?.id,
    content: nuevoMensaje,
  };

  // 1️⃣ Mostrar el mensaje inmediatamente
  setMensajes((prev) => [...prev, mensajeTemporal]);

  // 2️⃣ Limpiar el input inmediatamente
  setNuevoMensaje('');

  try {
    // 3️⃣ Enviar al backend
    await enviarMensaje(solicitudId, mensajeTemporal.content);

    // 4️⃣ Refrescar historial desde el backend
    cargarMensajes();
  } catch (err) {
    console.error('Error enviando mensaje:', err);
  }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-contenido" style={{ width: '400px', height: '450px', display: 'flex', flexDirection: 'column' }}>
        <button className="modal-cerrar" onClick={onClose}>&times;</button>
        <h5>Chat de Solicitud #{solicitudId}</h5>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', borderRadius: '6px', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: '#f8f9fa' }}>
          {mensajes.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No hay mensajes</p>}
          {mensajes.map((m, i) => {
            const esMio = m.senderId === user?.id || m.remitente?.toLowerCase() === 'cliente'
            return (
              <div key={i} style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start', marginBottom: '0.4rem' }}>
                <div style={{ maxWidth: '70%', padding: '0.4rem 0.6rem', borderRadius: '12px', backgroundColor: esMio ? '#0d6efd' : '#e9ecef', color: esMio ? '#fff' : '#000', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  {m.content || m.texto}
                </div>
              </div>
            )
          })}
          <div ref={endRef} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            className="form-control"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button className="btn btn-primary" onClick={handleEnviar}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
