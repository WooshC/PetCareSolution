// components/dashboard/ClienteDashboard.jsx
import React from 'react';

const ClienteDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleEditProfile = () => {
    console.log('Editar perfil de cliente');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">PetCare Ecuador - Cliente</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-green-100">Hola, {user.name || 'Cliente'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            Esta es el área del cliente. Aquí podrás buscar cuidadores y gestionar tus mascotas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-gray-800 mb-2">Buscar Cuidadores</h3>
              <p className="text-gray-600 text-sm">Encuentra el cuidador perfecto para tu mascota</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mis Mascotas</h3>
              <p className="text-gray-600 text-sm">Gestiona el perfil de tus mascotas</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mis Solicitudes</h3>
              <p className="text-gray-600 text-sm">Revisa el estado de tus servicios</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteDashboard;