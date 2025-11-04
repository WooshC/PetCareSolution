import React from 'react';

const DashboardLayout = ({ 
  children, 
  user, 
  onLogout, 
  onEditProfile, 
  role = 'Usuario',
  bgColor = 'bg-gray-50' 
}) => {
  const getRoleColor = () => {
    switch (role.toLowerCase()) {
      case 'cuidador':
        return 'bg-blue-600';
      case 'cliente':
        return 'bg-green-600';
      case 'admin':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleDisplayName = () => {
    switch (role.toLowerCase()) {
      case 'cuidador':
        return 'Cuidador';
      case 'cliente':
        return 'Cliente';
      case 'admin':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header/Navbar Compartido */}
      <nav className={`${getRoleColor()} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">
                PetCare Ecuador - {getRoleDisplayName()}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Hola, {user?.name || 'Usuario'}</span>
              <button
                onClick={onEditProfile}
                className="text-blue-100 hover:text-white text-sm transition-colors"
              >
                Editar Perfil
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer Compartido */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                © 2024 PetCare Ecuador. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Términos de Servicio
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Política de Privacidad
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;