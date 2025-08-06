// src/pages/Dashboard.jsx
import useAuth from '../hooks/useAuth';
import AdminDashboard from './Admin/AdminDashboard';
import CuidadorDashboard from './Cuidador/CuidadorDashboard';
import ClienteDashboard from './Cliente/ClienteDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Cargando información del usuario...</p>;
    }

    const rol = user.roles?.[0]?.toLowerCase();

    const dashboards = {
        administrador: <AdminDashboard />,
        cuidador: <CuidadorDashboard />,
        cliente: <ClienteDashboard />
    };

    return dashboards[rol] || <p>Rol desconocido o no autorizado.</p>;
};

export default Dashboard;
