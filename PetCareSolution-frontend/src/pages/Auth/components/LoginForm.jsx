import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, PawPrint } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { authService } from '../../../services/api/authAPI';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (!result.success) {
        throw new Error(result.message || 'Error en el login');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user || {
        id: result.user?.id,
        email: formData.email,
        name: result.user?.name,
        roles: result.user?.roles || ['Usuario']
      }));

      alert('¡Inicio de sesión exitoso!');
      redirectUser(result.user);

    } catch (error) {
      let errorMessage = 'Error de conexión. Intenta nuevamente.';
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes('credenciales') || errorMsg.includes('inválidas') || errorMsg.includes('incorrectas')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (errorMsg.includes('email') || errorMsg.includes('usuario') || errorMsg.includes('encontrado')) {
        errorMessage = 'El email no está registrado.';
      } else if (errorMsg.includes('password') || errorMsg.includes('contraseña')) {
        errorMessage = 'La contraseña es incorrecta.';
      } else if (errorMsg.includes('network') || errorMsg.includes('conexión')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = error.message || 'Error inesperado. Intenta nuevamente.';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUser = (user) => {
    const roles = user?.roles || [];
    
    if (roles.includes('Admin')) {
      navigate('/admin/dashboard');
    } else if (roles.includes('Cuidador')) {
      navigate('/cuidador/dashboard');
    } else if (roles.includes('Cliente')) {
      navigate('/cliente/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
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

            {/* Error de submit */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              </div>
            )}

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
                'Iniciar Sesión'
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
  );
};

export default LoginForm;
