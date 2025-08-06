import React from 'react';
import './EstadoBadge.css'; // Asegúrate de crear este archivo CSS

const EstadoBadge = ({ estado }) => {
    // Usamos el estado para generar una clase CSS dinámica
    const estadoClass = estado.toLowerCase();
    
    return (
        <span className={`estado-badge ${estadoClass}`}>
            {estado}
        </span>
    );
};

export default EstadoBadge;