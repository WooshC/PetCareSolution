import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import LayoutCliente from '../pages/Cliente/LayoutCliente'

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/cliente"
        element={
          <PrivateRoute role="Cliente">
            <LayoutCliente />
          </PrivateRoute>
        }
      />
      {/* Puedes añadir otras rutas aquí */}
    </Routes>
  )
}
