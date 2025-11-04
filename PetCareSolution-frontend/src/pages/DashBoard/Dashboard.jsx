// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CuidadorDashboard from '../../components/dashboard/CuidadorDashboard';
import ClienteDashboard from '../../components/dashboard/ClienteDashboard';
import DefaultDashboard from '../../components/dashboard/DefaultDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Obtener datos del usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login
  if (!token) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // Determinar qué componente mostrar según el rol
  const renderDashboardContent = () => {
    switch (user.role?.toLowerCase()) {
      case 'cuidador':
        return <CuidadorDashboard onLogout={handleLogout} onEditProfile={handleEditProfile} />;
      case 'cliente':
        return <ClienteDashboard onLogout={handleLogout} onEditProfile={handleEditProfile} />;
      case 'admin':
        return <DefaultDashboard onLogout={handleLogout} onEditProfile={handleEditProfile} user={user} />;
      default:
        return <DefaultDashboard onLogout={handleLogout} onEditProfile={handleEditProfile} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">PetCare Ecuador</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user.name || 'Usuario'}</span>
              <button
                onClick={handleEditProfile}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido del Dashboard */}
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;