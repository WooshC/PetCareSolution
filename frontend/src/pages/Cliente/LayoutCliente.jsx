import '../../styles/cliente.css'
import React from 'react'
import Perfil from './Perfil'
// import Solicitudes from './Solicitudes' // Activa cuando esté lista

export default function LayoutCliente() {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo: Perfil del cliente */}
      <div className="w-1/4 perfil-cliente">
        <Perfil />
      </div>

      {/* Panel derecho: Solicitudes o futuras vistas */}
      <div className="w-3/4 seccion-solicitudes">
        <h2 className="titulo-seccion">Solicitudes</h2>
        <p>Aquí se mostrarán las solicitudes agrupadas por estado.</p>
        {/* <Solicitudes /> */}
      </div>
    </div>
  )
}
