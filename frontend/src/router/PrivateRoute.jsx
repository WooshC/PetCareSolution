import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rolUsuario = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (role && rolUsuario !== role) {
      return <Navigate to="/no-autorizado" replace />;
    }

    return children;
  } catch (err) {
    console.error('Token inválido:', err);
    return <Navigate to="/login" replace />;
  }
}
