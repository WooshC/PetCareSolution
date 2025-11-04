// components/dashboard/DefaultDashboard.jsx
import React from 'react';
import UserProfileCard from './UserProfileCard';

const DefaultDashboard = ({ onLogout, onEditProfile, user }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <UserProfileCard user={user} onEditProfile={onEditProfile} />
      
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido a PetCare Ecuador!</h2>
        <p className="text-gray-600 mb-6">
          Estamos configurando tu experiencia personalizada. 
          Pronto tendrás acceso a todas las funcionalidades según tu rol.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Explorar Servicios
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
            Ver Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;