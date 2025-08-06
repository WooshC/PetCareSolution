// frontend/src/pages/Cuidador/CuidadorDashboard.jsx
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import SolicitudCard from '../../components/solicitudes/SolicitudCard'; // Importamos el nuevo componente
import './CuidadorDashboard.css'; // Asegúrate de tener estilos para el dashboard
import EstadoBadge from '../../components/solicitudes/EstadoBadge'; // Importamos el componente de badge de estado

const CuidadorDashboard = () => {
    const { user } = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchWithToken = useFetch();

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                setLoading(true);
                // Esta es la línea que me pides que no cambie
                const data = await fetchWithToken(`${import.meta.env.VITE_API_REQUEST}/api/SolicitudCuidador/mis-solicitudes`);
                setSolicitudes(data);
            } catch (error) {
                setError("Error al cargar solicitudes");
                console.error("Error al cargar solicitudes", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSolicitudes();
        }
    }, [user, fetchWithToken]);

    const solicitudesPendientes = solicitudes.filter(s => s.estado === 'Pendiente');
    const solicitudesAceptadas = solicitudes.filter(s => s.estado === 'Aceptada');

    return (
        <div style={{ padding: '2rem' }}>
            <div className="dashboard-header">
                <h2>Dashboard de Cuidador</h2>
                {user && (
                    <p>
                        Bienvenido <strong>{user.name || user.email}</strong> 👋
                    </p>
                )}
            </div>

            {loading ? (
                <p>Cargando solicitudes...</p>
            ) : (
                <>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    <div className="solicitudes-container">
                        <h3 className="section-title">Solicitudes Pendientes ({solicitudesPendientes.length})</h3>
                        {solicitudesPendientes.length === 0 ? (
                            <p>No tienes solicitudes pendientes.</p>
                        ) : (
                            solicitudesPendientes.map((solicitud) => (
                                <SolicitudCard key={solicitud.solicitudID} solicitud={solicitud} />
                            ))
                        )}
                    </div>
                    
                    <div className="solicitudes-container" style={{ marginTop: '2rem' }}>
                        <h3 className="section-title">Solicitudes Aceptadas ({solicitudesAceptadas.length})</h3>
                        {solicitudesAceptadas.length === 0 ? (
                            <p>No tienes solicitudes aceptadas.</p>
                        ) : (
                            solicitudesAceptadas.map((solicitud) => (
                                <SolicitudCard key={solicitud.solicitudID} solicitud={solicitud} />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CuidadorDashboard;