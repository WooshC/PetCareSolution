import '../../styles/cliente.css'
import React from 'react'
import Perfil from './Perfil'
// import Solicitudes from './Solicitudes' // Activa cuando esté lista

export default function LayoutCliente() {
  return (
    // 🔹 Agregamos w-100 y flex-row para fila
    <div className="d-flex flex-row min-vh-100 w-100">
      {/* Panel izquierdo: Perfil del cliente */}
      <div className="perfil-cliente">
        <Perfil />
      </div>

      {/* Panel derecho: Solicitudes */}
      <div className="seccion-solicitudes">
        <h2 className="titulo-seccion">Solicitudes</h2>
        <p>Aquí se mostrarán las solicitudes agrupadas por estado.</p>
        {/* <Solicitudes /> */}
      </div>
    </div>
  )
}

