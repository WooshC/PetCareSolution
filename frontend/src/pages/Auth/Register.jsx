// src/pages/Auth/Register.jsx
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css'; // <- Importa el nuevo CSS

const Register = () => {
  const navigate = useNavigate();

  const handleRolSelect = (rol) => {
    navigate(`/registro-usuario/${rol.toLowerCase()}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Elige el tipo de usuario para tu registro</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button className="auth-btn" onClick={() => handleRolSelect('cliente')}>
            Soy Cliente
          </button>
          <button className="auth-btn" onClick={() => handleRolSelect('cuidador')}>
            Soy Cuidador
          </button>
        </div>

        <div className="auth-links" style={{ marginTop: '1.5rem' }}>
          <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
