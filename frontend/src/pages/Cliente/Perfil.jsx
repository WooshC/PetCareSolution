import React, { useState } from 'react'
import useFetch from '../../hooks/useFetch'
import Modal from '../../components/common/Modal'
import CrearSolicitud from './CrearSolicitud'

export default function Perfil() {
  const { data: perfil, loading: loadingPerfil } = useFetch('/api/cliente/mi-perfil')
  const [mostrarModal, setMostrarModal] = useState(false)

  if (loadingPerfil) return <p>Cargando perfil...</p>
  if (!perfil) return <p>No tienes perfil creado.</p>

  return (
    <div className="perfil-tarjeta">
      <div className="perfil-avatar">
        <i className="fas fa-user fa-3x text-white"></i>
      </div>
      <h4 className="perfil-titulo">Cliente de PetCare</h4>
      <p className="perfil-subtitulo">Tu espacio personal</p>

      <div className="perfil-info mt-3">
        <p><strong>Documento:</strong> {perfil.documentoIdentidad}</p>
        <p><strong>Teléfono Emergencia:</strong> {perfil.telefonoEmergencia}</p>
        <p><strong>Estado:</strong> {perfil.estado}</p>
      </div>

      <button className="cliente-btn mt-4" onClick={() => setMostrarModal(true)}>
        Nueva Solicitud
      </button>

      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <CrearSolicitud onClose={() => setMostrarModal(false)} />
        </Modal>
      )}
    </div>
  )
}
