import React, { useState } from 'react';
import { aceptarSolicitud, rechazarSolicitud, enviarValoracion } from '../../api/cuidador';
import { Link } from 'react-router-dom';

const SolicitudCard = ({ solicitud, onStatusChange }) => {
  const [rating, setRating] = useState('');
  const [comentario, setComentario] = useState('');

  const handleAceptar = async () => {
    try {
      await aceptarSolicitud(solicitud.id);
      onStatusChange && onStatusChange();
    } catch (error) {
      alert('Error al aceptar la solicitud');
    }
  };

  const handleRechazar = async () => {
    try {
      await rechazarSolicitud(solicitud.id);
      onStatusChange && onStatusChange();
    } catch (error) {
      alert('Error al rechazar la solicitud');
    }
  };

  const handleEnviarValoracion = async (e) => {
    e.preventDefault();
    try {
      await enviarValoracion(solicitud.id, rating, comentario);
      alert('Valoración enviada con éxito');
      setRating('');
      setComentario('');
    } catch (error) {
      alert('Error al enviar valoración');
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      marginBottom: '1rem',
      padding: '1rem',
      borderRadius: '8px'
    }}>
      <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
      <p><strong>Horas:</strong> {solicitud.numeroHoras}</p>
      <p><strong>Fecha:</strong> {solicitud.fecha}</p>
      <p><strong>Ubicación:</strong> {solicitud.ubicacion}</p>
      <p><strong>Estado:</strong> {solicitud.estado}</p>

      {solicitud.estado === 'pendiente' && (
        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={handleAceptar}>Aceptar</button>
          <button onClick={handleRechazar} style={{ marginLeft: '1rem' }}>Rechazar</button>
        </div>
      )}

      {['aceptado', 'iniciado'].includes(solicitud.estado) && (
        <div style={{ marginTop: '0.5rem' }}>
          <Link to={`/cuidador/chat/${solicitud.id}`}>
            <button>Ir al chat</button>
          </Link>
        </div>
      )}

      {solicitud.estado === 'finalizado' && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Enviar valoración</h4>
          <form onSubmit={handleEnviarValoracion}>
            <label>Calificación (1–5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
            <br />
            <label>Comentario:</label>
            <br />
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              required
            />
            <br />
            <button type="submit">Enviar valoración</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SolicitudCard;
