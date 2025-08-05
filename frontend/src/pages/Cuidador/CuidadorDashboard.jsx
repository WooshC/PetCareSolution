import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';

const CuidadorDashboard = () => {
    const { token } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL; // http://localhost:5008
    const REQUEST_URL = import.meta.env.VITE_REQUEST_URL || 'http://localhost:5010'; // http://localhost:5010
    const fetchWithToken = useFetch();
    const [chatActivo, setChatActivo] = useState(null);

    // Cargar perfil de cuidador
    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const data = await fetchWithToken(`${API_URL}/api/Cuidador/mi-perfil`);
                setPerfil(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPerfil();
    }, [API_URL, token]);

    // Cargar solicitudes (solo si el perfil está activo)
    useEffect(() => {
        if (!perfil || perfil.estado !== 'Activo') return;

        const fetchSolicitudes = async () => {
            try {
                const data = await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/mis-solicitudes`);
                setSolicitudes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, [REQUEST_URL, token, perfil]);

    const aceptar = async (id) => {
        await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/${id}/aceptar`, {
            method: 'POST'
        });

        refreshSolicitudes();
    };

    const rechazar = async (id) => {
        await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/${id}/rechazar`, {
            method: 'POST'
        });
        refreshSolicitudes();
    };

    const refreshSolicitudes = async () => {
        const data = await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/mis-solicitudes`);
        setSolicitudes(data);
    };

    const renderSolicitudes = (estado) => {
        return solicitudes
            .filter(s => s.estado?.toLowerCase() === estado.toLowerCase())
            .map(s => (
                <div key={s.id} className="card">
                    <h4>{s.descripcion}</h4>
                    <p><strong>Fecha:</strong> {s.fecha}</p>
                    <p><strong>Duración:</strong> {s.duracion} horas</p>
                    <p><strong>Ubicación:</strong> {s.ubicacion}</p>
                    <p><strong>Estado:</strong> {s.estado}</p>

                    {['Asignada', 'Aceptada', 'En Progreso'].includes(s.estado) && (
                        <button onClick={() => setChatActivo({ solicitudId: s.id, clienteId: s.clienteId })}>
                            Chat
                        </button>
                    )}

                    {estado === 'Pendiente' && (
                        <div>
                            <button onClick={() => aceptar(s.id)}>Aceptar</button>
                            <button onClick={() => rechazar(s.id)}>Rechazar</button>
                        </div>
                    )}

                    {estado === 'Aceptada' && (
                        <div>
                            <button onClick={() => iniciarServicio(s.id)}>Iniciar Servicio</button>
                        </div>
                    )}

                    {estado === 'En Progreso' && (
                        <div>
                            <button onClick={() => finalizarServicio(s.id)}>Finalizar Servicio</button>
                        </div>
                    )}
                </div>
            ));
    };

    const refreshPerfil = async () => {
        const data = await fetchWithToken(`${API_URL}/api/Cuidador/mi-perfil`);
        setPerfil(data);
    };

    const iniciarServicio = async (id) => {
        try {
            await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/${id}/iniciar-servicio`, {
                method: 'POST'
            });
            refreshSolicitudes();
        } catch (err) {
            console.error('Error al iniciar servicio:', err);
        }
    };

    const finalizarServicio = async (id) => {
        try {
            await fetchWithToken(`${REQUEST_URL}/api/SolicitudCuidador/${id}/finalizar-servicio`, {
                method: 'POST'
            });
            refreshSolicitudes();
        } catch (err) {
            console.error('Error al finalizar servicio:', err);
        }
    };

    if (!perfil) return <p>Cargando perfil...</p>;

    if (perfil.estado === 'Incompleto' || perfil.documentoIdentidad === '') {
        return <CuidadorPerfilForm onSuccess={refreshPerfil} />;
    }

    if (perfil.estado !== 'Activo') {
        return <p>Tu cuenta está en estado <strong>{perfil.estado}</strong>. Un administrador debe validarla.</p>;
    }

    if (chatActivo) {
        return (
            <div>
                <button onClick={() => setChatActivo(null)}>← Volver</button>
                <ChatView
                    otherUserId={chatActivo.clienteId}
                    solicitudId={chatActivo.solicitudId}
                />
            </div>
        );
    }

    if (loading) return <p>Cargando solicitudes...</p>;

    return (
        <div>
            <h2>Solicitudes Pendientes</h2>
            {renderSolicitudes('Pendiente')}

            <h2>Solicitudes Aceptadas</h2>
            {renderSolicitudes('Aceptada')}

            <h2>En Progreso</h2>
            {renderSolicitudes('En Progreso')}
        </div>
    );
};

export default CuidadorDashboard;
