import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, PawPrint } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso:', data);
        
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('¡Inicio de sesión exitoso!');
        // Redirigir al dashboard según el rol
        window.location.href = '/Home';
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
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
            <span className="text-2xl font-bold text-primary-600">Solution</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de PetCare Solution
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
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Recordar contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Error de submit */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
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
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Información adicional */}
        <div className="text-center text-xs text-gray-500">
          <p>🔒 Acceso seguro y protegido</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;