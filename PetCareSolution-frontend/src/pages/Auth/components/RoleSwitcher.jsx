// components/RoleSwitcher.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentRole = user.currentRole || user.role;

  const handleRoleSwitch = (newRole) => {
    const updatedUser = {
      ...user,
      currentRole: newRole
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Redirigir al dashboard correspondiente
    const targetPath = getDashboardPath(newRole);
    navigate(targetPath, { replace: true });
  };

  const getDashboardPath = (role) => {
    const normalizedRole = role?.toLowerCase();
    switch (normalizedRole) {
      case 'cuidador': return '/cuidador/dashboard';
      case 'cliente': return '/cliente/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  if (!user.availableRoles || user.availableRoles.length <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Cambiar de Rol</h3>
      <div className="flex flex-wrap gap-2">
        {user.availableRoles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSwitch(role)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              currentRole === role
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {role === 'cuidador' ? '👤 Cuidador' : role === 'cliente' ? '❤️ Cliente' : role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSwitcher;