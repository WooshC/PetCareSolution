// src/components/cuidador/CuidadorMain.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CuidadorHeader from '../layout/CuidadorHeader';
import CuidadorPerfil from '../cuidador/CuidadorPerfil';
import SolicitudesSection from './SolicitudesSection';
import SolicitudesActivasSection from './SolicitudesActivasSection';
import HistorialSection from './HistorialSection';
import { useAuth } from '../../hooks/useAuth';
import { useCuidador } from '../../hooks/useCuidador';

const CuidadorMain = () => { // ← Remover onLogout de los props
  const [currentSection, setCurrentSection] = useState('perfil');
  const [solicitudesCount, setSolicitudesCount] = useState(0);
  const [solicitudesActivasCount, setSolicitudesActivasCount] = useState(0);

  const navigate = useNavigate(); // ← Agregar navigate
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const token = localStorage.getItem('token');
  const { cuidador, loading: cuidadorLoading, error, refetch } = useCuidador(token);

  const loading = authLoading || cuidadorLoading;

  // Cargar contadores
  useEffect(() => {
    const loadCounters = async () => {
      try {
        setSolicitudesCount(2);
        setSolicitudesActivasCount(1);
      } catch (error) {
        console.error('Error cargando contadores:', error);
      }
    };

    loadCounters();
  }, []);

  const handleEditProfile = () => {
    console.log('Abrir edición de perfil');
  };

  const handleProfileUpdate = () => {
    refetch();
  };

  // Función de logout corregida
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true }); // ← Redirigir al login
  };

  // Renderizar sección actual
  const renderSection = () => {
    switch (currentSection) {
      case 'perfil':
        return (
          <CuidadorPerfil 
            authUser={authUser}
            cuidador={cuidador}
            loading={loading}
            error={error}
            onEditProfile={handleEditProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case 'solicitudes':
        return (
          <SolicitudesSection
            authUser={authUser}
            cuidador={cuidador}
            onSolicitudesCountChange={setSolicitudesCount}
          />
        );
      case 'solicitudes-activas':
        return (
          <SolicitudesActivasSection
            authUser={authUser}
            cuidador={cuidador}
            onSolicitudesCountChange={setSolicitudesActivasCount}
          />
        );
      case 'historial':
        return <HistorialSection authUser={authUser} cuidador={cuidador} />;
      default:
        return (
          <CuidadorPerfil 
            authUser={authUser}
            cuidador={cuidador}
            loading={loading}
            error={error}
            onEditProfile={handleEditProfile}
            onProfileUpdate={handleProfileUpdate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CuidadorHeader
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={handleLogout} // ← Pasar la función corregida
        cuidadorName={authUser?.name || 'Cuidador'}
        solicitudesCount={solicitudesCount}
        solicitudesActivasCount={solicitudesActivasCount}
      />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default CuidadorMain;