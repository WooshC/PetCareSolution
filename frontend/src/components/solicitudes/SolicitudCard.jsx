// frontend/src/components/solicitudes/SolicitudCard.jsx
import React from 'react';
import './SolicitudCard.css';
import EstadoBadge from './EstadoBadge';

const SolicitudCard = ({ solicitud }) => {
    return (
        <div className="solicitud-card">
            <h3 className="card-title">{solicitud.titulo || solicitud.descripcion.substring(0, 30) + '...'}</h3>
            <EstadoBadge estado={solicitud.estado} />
            <div className="card-actions">
                <button className="btn btn-detalle">Ver Detalle</button>
                <button className="btn btn-editar">Editar</button>
            </div>
        </div>
    );
};

export default SolicitudCard;