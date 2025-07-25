import RegisterCuidador from '../pages/Cuidador/Register';
import LoginCuidador from '../pages/Cuidador/Login';
import DashboardCuidador from '../pages/Cuidador/Dashboard';
import RegisterUser from '../pages/Cuidador/RegisterUser';


export const routes = [
  // otras rutas existentes
  { path: '/cuidador/registro', element: <RegisterCuidador /> },
  { path: '/cuidador/login', element: <LoginCuidador /> },
  { path: '/cuidador/dashboard', element: <DashboardCuidador /> },
  { path: '/cuidador/registro-usuario', element: <RegisterUser /> }
];
