import React, { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import Modal from '../../components/common/Modal'

export default function LayoutCliente() {
  const { data: perfil, loading: loadingPerfil } = useFetch('/api/cliente/mi-perfil')

  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo: perfil */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        {loadingPerfil ? (
          <p>Cargando perfil...</p>
        ) : perfil ? (
          <>
            <h2 className="text-lg font-bold mb-2">Mi Perfil</h2>
            <p><strong>Documento:</strong> {perfil.documentoIdentidad}</p>
            <p><strong>Teléfono Emergencia:</strong> {perfil.telefonoEmergencia}</p>
            <p><strong>Estado:</strong> {perfil.estado}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setMostrarModal(true)}
            >
              Nueva Solicitud
            </button>
          </>
        ) : (
          <p>No tienes perfil creado.</p>
        )}
      </div>

      {/* Lado derecho: (por ahora vacío) */}
      <div className="w-3/4 p-4">
        <h2 className="text-xl font-bold">Solicitudes (próximamente)</h2>
      </div>

      {/* Modal (aún sin formulario real) */}
      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <p>Aquí irá el formulario para crear una solicitud.</p>
        </Modal>
      )}
    </div>
  )
}
