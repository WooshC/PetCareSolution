// src/pages/Auth/Register.jsx
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRolSelect = rol => {
    navigate(`/registro-final/${rol.toLowerCase()}`);
  };

  return (
    <div className="register-selector">
      <h2>¿Cómo deseas registrarte?</h2>
      <div className="role-buttons">
        <button onClick={() => handleRolSelect('cliente')}>Soy Cliente</button>
        <button onClick={() => handleRolSelect('cuidador')}>Soy Cuidador</button>
      </div>
    </div>
  );
};

export default Register;
