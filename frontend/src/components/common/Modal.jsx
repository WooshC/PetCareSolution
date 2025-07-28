import React from 'react'

export default function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="modal-cerrar" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
