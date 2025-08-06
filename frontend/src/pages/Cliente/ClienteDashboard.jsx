// src/pages/Cliente/ClienteDashboard.jsx
import useAuth from '../../hooks/useAuth';

const ClienteDashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard de Cliente</h2>
            {user && (
                <p>
                    Bienvenido <strong>{user.name || user.email}</strong> 👋
                </p>
            )}
            <p>Este es un dashboard de prueba para Cliente sin llamadas a la API.</p>
        </div>
    );
};

export default ClienteDashboard;
