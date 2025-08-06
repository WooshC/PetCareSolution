import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/auth.css'; // Para usar auth-btn

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // Limpia token y estado global
    navigate('/login'); // Redirige al login
  };

  return (
    <button className="auth-btn" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
