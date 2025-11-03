import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Eye, EyeOff, User, Mail, Lock, PawPrint, FileText, Phone, 
  Clock, DollarSign, Smartphone, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { authService } from '../../../services/api/authAPI';
import { clientService } from '../../../services/api/clientAPI';
import { caregiverService } from '../../../services/api/caregiverAPI';

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string()
    .min(10, 'Mínimo 10 caracteres')
    .max(15, 'Máximo 15 caracteres')
    .regex(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido'),
  password: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mayúsculas, minúsculas y números'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  role: z.enum(['Cliente', 'Cuidador'], { required_error: 'Selecciona un tipo de usuario' }),
  documentoIdentidad: z.string().min(1, 'Documento requerido').max(20, 'Máximo 20 caracteres'),
  telefonoEmergencia: z.string().min(1, 'Teléfono requerido').max(15, 'Máximo 15 caracteres'),
  biografia: z.string().optional(),
  experiencia: z.string().optional(),
  horarioAtencion: z.string().optional(),
  tarifaPorHora: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
}).refine((data) => {
  if (data.role === 'Cuidador') return data.biografia?.trim().length > 0;
  return true;
}, { message: 'Biografía requerida', path: ['biografia'] })
.refine((data) => {
  if (data.role === 'Cuidador') return data.experiencia?.trim().length > 0;
  return true;
}, { message: 'Experiencia requerida', path: ['experiencia'] })
.refine((data) => {
  if (data.role === 'Cuidador') return data.horarioAtencion?.trim().length > 0;
  return true;
}, { message: 'Horario requerido', path: ['horarioAtencion'] })
.refine((data) => {
  if (data.role === 'Cuidador') return data.tarifaPorHora && parseFloat(data.tarifaPorHora) > 0;
  return true;
}, { message: 'Tarifa mayor a 0', path: ['tarifaPorHora'] });

const Modal = ({ isOpen, onClose, title, description, type = 'success' }) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="h-12 w-12 text-green-500" />,
    error: <XCircle className="h-12 w-12 text-red-500" />,
    warning: <AlertCircle className="h-12 w-12 text-yellow-500" />
  };

  const buttonColorMap = {
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center">
          <div className="flex justify-center mb-4">{iconMap[type]}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorMap[type]}`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', description: '', type: 'success' });
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const selectedRole = watch('role');

  const roleOptions = [
    { value: 'Cliente', label: '👤 Dueño de Mascota' },
    { value: 'Cuidador', label: '🐾 Cuidador Profesional' }
  ];

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setValue('role', value);
    if (value === 'Cuidador') {
      setTimeout(() => trigger(['biografia', 'experiencia', 'horarioAtencion', 'tarifaPorHora']), 100);
    }
  };

  const showSuccessModal = (role) => {
    setModal({
      isOpen: true,
      title: '¡Registro Exitoso!',
      description: `Tu cuenta como ${role} ha sido creada exitosamente. Ahora puedes iniciar sesión.`,
      type: 'success'
    });
  };

  const showErrorModal = (errorMessage) => {
    setModal({
      isOpen: true,
      title: 'Error en el Registro',
      description: errorMessage || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
      type: 'error'
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (modal.type === 'success') {
      navigate('/login', {
        state: { message: 'Registro exitoso. Por favor inicia sesión.', email: watch('email') }
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const authResult = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role: data.role
      });

      if (!authResult.success) throw new Error(authResult.error || 'Error en el registro');

      const token = authResult.token || authResult.data?.token;
      const profileData = {
        documentoIdentidad: data.documentoIdentidad,
        telefonoEmergencia: data.telefonoEmergencia,
        ...(data.role === 'Cuidador' && {
          biografia: data.biografia,
          experiencia: data.experiencia,
          horarioAtencion: data.horarioAtencion,
          tarifaPorHora: parseFloat(data.tarifaPorHora)
        })
      };

      if (token) {
        const service = data.role === 'Cliente' ? clientService : caregiverService;
        await service.createProfile(profileData, token);
      }

      showSuccessModal(data.role);
    } catch (error) {
      const message = error.message || 'Error inesperado. Intenta nuevamente.';
      showErrorModal(message);
    } finally {
      setIsLoading(false);
    }
  };

  const FormSection = ({ title, children, border = true }) => (
    <div className={`space-y-4 ${border ? 'border-b border-gray-200 pb-6' : ''}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
      {children}
    </div>
  );

  const PasswordInput = ({ label, name, showPassword, onToggle, error, placeholder }) => (
    <div className="relative">
      <Input
        label={label}
        type={showPassword ? 'text' : 'password'}
        {...register(name)}
        error={error?.message}
        placeholder={placeholder}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        required
        disabled={isLoading}
      />
      <button
        type="button"
        className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
        onClick={onToggle}
        disabled={isLoading}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <Link to="/Home" className="inline-flex items-center space-x-2 mb-8">
              <div className="bg-primary-600 p-2 rounded-lg">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PetCare</span>
              <span className="text-2xl font-bold text-primary-600"> Ecuador</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Únete a nuestra comunidad de amantes de mascotas
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormSection title="Información Básica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo"
                    type="text"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Ingresa tu nombre completo"
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    disabled={isLoading}
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="tu@email.com"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Número de Celular"
                    type="tel"
                    {...register('phoneNumber')}
                    error={errors.phoneNumber?.message}
                    placeholder="+57 300 123 4567"
                    icon={<Smartphone className="h-5 w-5 text-gray-400" />}
                    disabled={isLoading}
                    maxLength={15}
                  />
                  <Select
                    label="Tipo de Usuario"
                    name="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    error={errors.role?.message}
                    options={roleOptions}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Contraseña"
                    name="password"
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    error={errors.password}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <PasswordInput
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    showPassword={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    error={errors.confirmPassword}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </FormSection>

              <FormSection title="Información de Contacto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Documento de Identidad"
                    type="text"
                    {...register('documentoIdentidad')}
                    error={errors.documentoIdentidad?.message}
                    placeholder="Número de documento"
                    icon={<FileText className="h-5 w-5 text-gray-400" />}
                    disabled={isLoading}
                    maxLength={20}
                  />
                  <Input
                    label="Teléfono de Emergencia"
                    type="tel"
                    {...register('telefonoEmergencia')}
                    error={errors.telefonoEmergencia?.message}
                    placeholder="+57 300 123 4567"
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    disabled={isLoading}
                    maxLength={15}
                  />
                </div>
              </FormSection>

              {selectedRole === 'Cuidador' && (
                <FormSection title="Información Profesional">
                  <Input
                    label="Biografía"
                    type="textarea"
                    {...register('biografia')}
                    error={errors.biografia?.message}
                    placeholder="Cuéntanos sobre ti y tu experiencia con mascotas..."
                    disabled={isLoading}
                    multiline
                    rows={3}
                  />
                  <Input
                    label="Experiencia"
                    type="textarea"
                    {...register('experiencia')}
                    error={errors.experiencia?.message}
                    placeholder="Describe tu experiencia profesional con mascotas..."
                    disabled={isLoading}
                    multiline
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Horario de Atención"
                      type="text"
                      {...register('horarioAtencion')}
                      error={errors.horarioAtencion?.message}
                      placeholder="Ej: Lunes a Viernes 8:00 AM - 6:00 PM"
                      icon={<Clock className="h-5 w-5 text-gray-400" />}
                      disabled={isLoading}
                      maxLength={100}
                    />
                    <Input
                      label="Tarifa por Hora ($)"
                      type="number"
                      {...register('tarifaPorHora')}
                      error={errors.tarifaPorHora?.message}
                      placeholder="0.00"
                      icon={<DollarSign className="h-5 w-5 text-gray-400" />}
                      disabled={isLoading}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </FormSection>
              )}

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
                  `Registrarse como ${selectedRole || 'Usuario'}`
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        description={modal.description}
        type={modal.type}
      />
    </>
  );
};

export default RegisterForm;
