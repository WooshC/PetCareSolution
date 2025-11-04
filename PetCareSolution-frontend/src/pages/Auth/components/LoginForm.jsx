import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, PawPrint, CheckCircle, XCircle, User, Heart } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { authService } from '../../../services/api/authAPI';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [selectedRole, setSelectedRole] = useState(null); // 'cuidador' o 'cliente'
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

  // Componente Modal
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
        // Redirigir según el rol seleccionado
        if (selectedRole === 'cuidador') {
          navigate('/cuidador/dashboard');
        } else if (selectedRole === 'cliente') {
          navigate('/cliente/dashboard');
        } else {
          navigate('/dashboard');
        }
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
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    // Limpiar error de rol si existe
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
    switch (selectedRole) {
      case 'cuidador':
        return 'Cuidador';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🔄 Iniciando proceso de login...');
      
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login exitoso - Token recibido');
      console.log('📋 Datos del usuario:', {
        id: result.user?.id,
        name: result.user?.name,
        email: result.user?.email,
        role: result.user?.role
      });

      if (!result.success) {
        throw new Error(result.message || result.error || 'Error en el inicio de sesión');
      }

      if (!result.token) {
        throw new Error('No se recibió token de autenticación');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', result.token);
      
      // Preparar datos del usuario para guardar
      const userData = {
        id: result.user?.id,
        email: result.user?.email || formData.email,
        name: result.user?.name || formData.email.split('@')[0],
        role: selectedRole || result.user?.role || 'Usuario' // Usar el rol seleccionado
      };
      
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('💾 Datos guardados en localStorage:', {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });

      // Mostrar modal de éxito
      showSuccessModal(
        '¡Inicio de Sesión Exitoso!', 
        `Bienvenido de vuelta ${userData.name}. Serás redirigido al dashboard de ${getRoleDisplayName()}.`
      );

    } catch (error) {
      console.error('❌ Error en login:', error.message);
      
      let errorMessage = 'Error de conexión. Intenta nuevamente.';
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes('credenciales') || errorMsg.includes('inválidas') || errorMsg.includes('incorrectas')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (errorMsg.includes('email') || errorMsg.includes('usuario') || errorMsg.includes('encontrado')) {
        errorMessage = 'El email no está registrado. ¿Quieres crear una cuenta?';
      } else if (errorMsg.includes('password') || errorMsg.includes('contraseña')) {
        errorMessage = 'La contraseña es incorrecta. ¿Olvidaste tu contraseña?';
      } else if (errorMsg.includes('network') || errorMsg.includes('conexión') || errorMsg.includes('timeout')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
      } else if (errorMsg.includes('cuenta') || errorMsg.includes('verific')) {
        errorMessage = 'Tu cuenta necesita verificación. Revisa tu email.';
      } else {
        errorMessage = error.message || 'Error inesperado. Por favor, intenta nuevamente.';
      }

      showErrorModal('Error al Iniciar Sesión', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/Home" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-primary-600 p-2 rounded-lg">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PetCare</span>
              <span className="text-2xl font-bold text-primary-600"> Ecuador</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accede a tu cuenta de PetCare Ecuador
            </p>
          </div>

          <Card className="p-8">
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
              />

              {/* Contraseña */}
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Tu contraseña"
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  required
                  disabled={isLoading}
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

              {/* Selección de Rol */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Usuario *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Botón Cuidador */}
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
                    <User className={`h-6 w-6 mx-auto mb-2 ${
                      selectedRole === 'cuidador' ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">Cuidador</span>
                    <p className="text-xs text-gray-500 mt-1">Profesional</p>
                  </button>

                  {/* Botón Cliente */}
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
                    <Heart className={`h-6 w-6 mx-auto mb-2 ${
                      selectedRole === 'cliente' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className="font-medium">Cliente</span>
                    <p className="text-xs text-gray-500 mt-1">Dueño de mascota</p>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              {/* Recordar contraseña y olvidé contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  `Iniciar Sesión como ${getRoleDisplayName()}`
                )}
              </Button>

              {/* Enlace a registro */}
              <div className="text-center">
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