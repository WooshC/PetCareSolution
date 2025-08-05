import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Registro from '../pages/Auth/Register';
import RegisterUser from '../pages/Auth/RegisterUser'; // ✅ nuevo paso
import RegistroFinal from '../pages/Auth/RegistroFinal';
import { PrivateRoute } from './PrivateRoute';
import Dashboard from '../pages/Dashboard';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro-usuario/:rol" element={<RegisterUser />} /> {/* ✅ nueva */}
      <Route path="/registro-final/:rol" element={<RegistroFinal />} />

      {/* Rutas privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
