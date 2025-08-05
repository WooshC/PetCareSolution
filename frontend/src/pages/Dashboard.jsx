// src/pages/Dashboard.jsx
import useAuth from '../hooks/useAuth';
import AdminDashboard from './Admin/AdminDashboard';
import CuidadorDashboard from './Cuidador/CuidadorDashboard';
//import ClienteDashboard from './Cliente/ClienteDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Cargando información del usuario...</p>;
    }

    const rol = user.roles?.[0]?.toLowerCase();
    const estado = user.estado?.toLowerCase(); // si existe este campo

    if (rol === 'administrador') {
        return <AdminDashboard />;
    }

    if (rol === 'cuidador') {
        const estadoSafe = estado || '';
        const estadoLower = estadoSafe.toLowerCase();

        if (['inactivo', 'pendiente', 'incompleto'].includes(estadoLower)) {
            return (
                <p>
                    Tu cuenta está en estado <strong>{estado}</strong>. Un administrador debe validarla antes de continuar.
                </p>
            );
        }

        return <CuidadorDashboard />;
    }

    //if (rol === 'cliente') {
    //    return <ClienteDashboard />;
    //}

    return <p>Rol desconocido o no autorizado.</p>;
};

export default Dashboard;
