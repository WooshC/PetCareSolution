import React, { useEffect, useState } from 'react';
import SidebarCuidador from '../../components/cuidador/SidebarCuidador';
import SolicitudCard from '../../components/cuidador/SolicitudCard';
import { obtenerSolicitudesCuidador } from '../../api/cuidador';

const Dashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  const fetchSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudesCuidador();
      setSolicitudes(data);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const agruparPorEstado = (estado) =>
    solicitudes.filter((s) => s.estado === estado);

  return (
    <div style={{ display: 'flex' }}>
      <SidebarCuidador />
      <div style={{ flex: 1, padding: '1rem' }}>
        <section>
          <h2>Solicitudes Pendientes</h2>
          {agruparPorEstado('pendiente').map((s) => (
            <SolicitudCard key={s.id} solicitud={s} onStatusChange={fetchSolicitudes} />
          ))}
        </section>

        <section>
          <h2>Solicitudes Aceptadas</h2>
          {agruparPorEstado('aceptado').map((s) => (
            <SolicitudCard key={s.id} solicitud={s} onStatusChange={fetchSolicitudes} />
          ))}
        </section>

        <section>
          <h2>Historial</h2>
          {['finalizado', 'rechazado', 'cancelado'].map((estado) =>
            agruparPorEstado(estado).map((s) => (
              <SolicitudCard key={s.id} solicitud={s} />
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
