import '../../styles/cliente.css'
import React, { useState } from 'react'
import Perfil from './Perfil'
import Solicitudes from './Solicitudes'
import LogoutButton from '../../components/common/LogoutButton'  

export default function ClienteDashboard() {
  // Estado global para contenido de modal
  const [modalContent, setModalContent] = useState(null)

  // Función para abrir modal desde cualquier componente hijo
  const openModal = (content) => setModalContent(content)
  const closeModal = () => setModalContent(null)

  return (
    <div className="d-flex flex-row min-vh-100 w-100">

      {/* 🔹 Botón de logout en esquina superior derecha */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <LogoutButton />
      </div>

      {/* Panel izquierdo: Perfil */}
      <div className="perfil-cliente">
        {/* Pasamos openModal a Perfil si usa modales */}
        <Perfil openModal={openModal} closeModal={closeModal} />
      </div>

      {/* Panel derecho: Solicitudes */}
      <div className="seccion-solicitudes">
        <h2 className="titulo-seccion">Solicitudes</h2>
        <p>Aquí se mostrarán las solicitudes agrupadas por estado.</p>
        {/* Pasamos openModal para que Solicitudes pueda abrir modales */}
        <Solicitudes openModal={openModal} closeModal={closeModal} />
      </div>

      {/* 🔹 Modal global */}
      {modalContent && (
        <div className="modal-overlay">
          <div className="modal-container">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  )
}
