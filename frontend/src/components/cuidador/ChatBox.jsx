// src/components/cuidador/ChatBox.jsx
import React, { useState, useEffect } from 'react';
import { enviarMensaje, obtenerMensajes } from '../../api/chat';

const ChatBox = ({ solicitudId }) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  const cargarMensajes = async () => {
    const data = await obtenerMensajes(solicitudId);
    setMensajes(data);
  };

  const handleEnviar = async () => {
    if (!nuevoMensaje.trim()) return;
    await enviarMensaje(solicitudId, nuevoMensaje);
    setNuevoMensaje('');
    await cargarMensajes();
  };

  useEffect(() => {
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 3000); // polling cada 3s
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '1rem' }}>
        {mensajes.map((msg, index) => (
          <div key={index}><strong>{msg.emisor}</strong>: {msg.texto}</div>
        ))}
      </div>
      <input
        type="text"
        value={nuevoMensaje}
        onChange={(e) => setNuevoMensaje(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={handleEnviar}>Enviar</button>
    </div>
  );
};

export default ChatBox;
