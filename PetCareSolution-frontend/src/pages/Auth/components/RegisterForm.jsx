import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, PawPrint } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Cliente', label: '👤Cliente' },
    { value: 'Cuidador', label: '🐾 Cuidador' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.role) {
      newErrors.role = 'Selecciona un tipo de usuario';
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
      // Aquí irá la llamada al Auth Service
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registro exitoso:', data);
        
        // Redirigir según el rol o mostrar mensaje de éxito
        alert('¡Registro exitoso! Por favor inicia sesión.');
        
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: ''
        });
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Error en el registro' });
      }
    } catch (error) {
      console.error('Error en el registro:', error);
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
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a nuestra comunidad de amantes de mascotas
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <Input
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Ingresa tu nombre completo"
              icon={<User className="h-5 w-5 text-gray-400" />}
              required
            />

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

            {/* Rol */}
            <Select
              label="Tipo de Usuario"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              options={roleOptions}
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
                placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar Contraseña */}
            <div className="relative">
              <Input
                label="Confirmar Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Repite tu contraseña"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Error de submit */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Términos y condiciones */}
            <div className="text-sm text-gray-600">
              Al registrarte, aceptas nuestros{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                Política de Privacidad
              </a>
            </div>

            {/* Botón de registro */}
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
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            {/* Enlace a login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Información adicional */}
        <div className="text-center text-xs text-gray-500 space-y-2">
          <p>🔒 Tus datos están protegidos y seguros</p>
          <p>🐾 Únete a miles de amantes de mascotas</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;