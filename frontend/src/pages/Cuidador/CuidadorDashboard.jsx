// src/pages/Cuidador/CuidadorDashboard.jsx
import useAuth from '../../hooks/useAuth';

const CuidadorDashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Dashboard de Cuidador</h2>
            {user && (
                <p>
                    Bienvenido <strong>{user.name || user.email}</strong> 👋
                </p>
            )}
            <p>Este es un dashboard de prueba sin llamadas a la API.</p>
        </div>
    );
};

export default CuidadorDashboard;
