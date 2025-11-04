// src/components/cuidador/CuidadorMain.jsx
import React, { useState, useEffect } from 'react';
import CuidadorHeader from '../layout/CuidadorHeader';
// Cambia esta importación:
import CuidadorPerfil from '../cuidador/CuidadorPerfil';
import SolicitudesSection from './SolicitudesSection';
import SolicitudesActivasSection from './SolicitudesActivasSection';
import HistorialSection from './HistorialSection';
// import { caregiverService, solicitudService } from '../../services/api';

const CuidadorMain = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('perfil');
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solicitudesCount, setSolicitudesCount] = useState(0);
  const [solicitudesActivasCount, setSolicitudesActivasCount] = useState(0);

  // Obtener usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Cargar perfil del cuidador (datos temporales)
  useEffect(() => {
    const loadCuidadorProfile = async () => {
      try {
        // Simular carga de datos del cuidador
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos temporales - cuando tengas el servicio real, reemplaza esto
        const profileData = {
          nombreUsuario: user.name || 'Cuidador',
          emailUsuario: user.email || 'usuario@example.com',
          documentoIdentidad: '1234567890',
          telefonoEmergencia: '+593 987654321',
          documentoVerificado: true,
          fechaCreacion: new Date().toISOString(),
          biografia: 'Cuidador profesional con experiencia en el cuidado de mascotas.',
          experiencia: 'Especializado en cuidado de perros y gatos.',
          horarioAtencion: 'Lunes a Viernes: 8:00 - 18:00',
          tarifaPorHora: 15,
          calificacionPromedio: 4.8
        };
        
        setCuidador(profileData);
      } catch (error) {
        console.error('Error cargando perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCuidadorProfile();
  }, [user.name, user.email]);

  // Cargar contadores (temporales)
  useEffect(() => {
    const loadCounters = async () => {
      try {
        // Simular datos temporales
        setSolicitudesCount(2); // 2 solicitudes pendientes
        setSolicitudesActivasCount(1); // 1 solicitud activa
      } catch (error) {
        console.error('Error cargando contadores:', error);
      }
    };

    loadCounters();
  }, []);

  // Función para editar perfil
  const handleEditProfile = () => {
    // Aquí puedes implementar la lógica de edición
    console.log('Abrir edición de perfil');
  };

  // Renderizar sección actual
  const renderSection = () => {
    if (loading && currentSection === 'perfil') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Cargando perfil...</span>
        </div>
      );
    }

    switch (currentSection) {
      case 'perfil':
        return (
          <CuidadorPerfil 
            cuidador={cuidador}
            onEditProfile={handleEditProfile}
          />
        );
      case 'solicitudes':
        return (
          <SolicitudesSection
            onSolicitudesCountChange={setSolicitudesCount}
          />
        );
      case 'solicitudes-activas':
        return (
          <SolicitudesActivasSection
            onSolicitudesCountChange={setSolicitudesActivasCount}
          />
        );
      case 'historial':
        return <HistorialSection />;
      default:
        return (
          <CuidadorPerfil 
            cuidador={cuidador}
            onEditProfile={handleEditProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CuidadorHeader
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={onLogout}
        cuidadorName={user.name || 'Cuidador'} // Usar el nombre real del usuario
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