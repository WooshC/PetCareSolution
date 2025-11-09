//pages/Auth/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { authService } from '../../../services/api/authAPI';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    type: 'success',
    title: '',
    message: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Verificar sesión existente
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = await authService.validateExistingSession();
        if (session.isValid && session.user) {
          // Log eliminado: console.log('✅ Sesión válida encontrada, redirigiendo...');
          const targetPath = getDashboardPath(session.user.role);
          navigate(targetPath, { replace: true });
        }
      } catch (error) {
        // Log eliminado: console.log('ℹ️ No hay sesión activa:', error.message);
      }
    };

    checkExistingSession();
  }, [navigate]);

  // Función para determinar la ruta del dashboard
  const getDashboardPath = (role) => {
    const normalizedRole = role?.toLowerCase();

    switch (normalizedRole) {
      case 'cuidador':
        return '/cuidador/dashboard';
      case 'cliente':
        return '/cliente/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const Modal = () => {
    if (!showModal) return null;

    const iconMap = {
      success: <CheckCircle className="h-12 w-12 text-green-500" />,
      error: <XCircle className="h-12 w-12 text-red-500" />
    };

    const buttonColorMap = {
      success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    };

    const handleClose = () => {
      setShowModal(false);
      if (modalData.type === 'success') {
        // Redirigir inmediatamente sin delay
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const targetPath = getDashboardPath(user.role);
        navigate(targetPath, { replace: true });
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {iconMap[modalData.type]}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {modalData.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {modalData.message}
            </p>
            <button
              onClick={handleClose}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorMap[modalData.type]}`}
            >
              {modalData.type === 'success' ? 'Continuar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === 'email') {
      sanitizedValue = value.toLowerCase().trim();
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!selectedRole) {
      newErrors.role = 'Selecciona un tipo de usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showErrorModal = (title, message) => {
    setModalData({
      type: 'error',
      title,
      message
    });
    setShowModal(true);
  };

  const showSuccessModal = (title, message) => {
    setModalData({
      type: 'success',
      title,
      message
    });
    setShowModal(true);
  };

  const getRoleDisplayName = () => {
    return selectedRole === 'cuidador' ? 'Cuidador' : 'Cliente';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Log eliminado: console.log('🔐 Iniciando proceso de login...');

      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        throw new Error(result.message || 'Error en la autenticación');
      }

      // Log eliminado: console.log('✅ Login exitoso, datos del usuario:', result.user);

      // IMPORTANTE: Usar el rol que viene del servidor, no el seleccionado
      // La redirección ocurre dentro de handleClose del Modal

      // Limpiar formulario por seguridad
      setFormData({ email: '', password: '' });
      setSelectedRole(null);

      showSuccessModal(
        '¡Autenticación Exitosa!',
        `Bienvenido de vuelta ${result.user?.name || ''}. Serás redirigido al dashboard.`
      );

    } catch (error) {
      // Log eliminado: console.error('❌ Error en login:', error.message);
      showErrorModal('Error de Autenticación', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrega los íconos faltantes
  const CheckCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const XCircle = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/Home" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PetCare</span>
              <span className="text-2xl font-bold text-primary-600"> Secure</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Acceso Seguro
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Autenticación protegida - PetCare Ecuador
            </p>
          </div>

          <Card className="p-8 border-2 border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="tu@email.com"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
                disabled={isLoading}
                autoComplete="email"
              />

              {/* Contraseña */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Selección de Rol */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Usuario *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('cuidador')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      selectedRole === 'cuidador'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-25'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    <span className="text-2xl mb-2">👤</span>
                    <span className="font-medium">Cuidador</span>
                    <p className="text-xs text-gray-500 mt-1">Profesional</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('cliente')}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      selectedRole === 'cliente'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-25'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    <span className="text-2xl mb-2">❤️</span>
                    <span className="font-medium">Cliente</span>
                    <p className="text-xs text-gray-500 mt-1">Dueño de mascota</p>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Acceder como {getRoleDisplayName()}
                  </>
                )}
              </Button>

              {/* Enlaces adicionales */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Modal />
    </>
  );
};

export default LoginForm;