import React from 'react';
import { User, Search, Calendar, CheckCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';

const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="h-6 w-6" />,
      step: "1",
      title: "Crea tu Perfil",
      description: "Regístrate y crea un perfil detallado para ti y tu mascota con sus necesidades específicas."
    },
    {
      icon: <Search className="h-6 w-6" />,
      step: "2",
      title: "Encuentra Cuidadores",
      description: "Busca y filtra cuidadores por ubicación, servicios, experiencia y calificaciones."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      step: "3",
      title: "Reserva tu Servicio",
      description: "Selecciona fechas, servicios específicos y confirma tu reserva de forma segura."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      step: "4",
      title: "Disfruta la Tranquilidad",
      description: "Tu mascota está en buenas manos mientras tú estás fuera. Recibe actualizaciones regulares."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cómo Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra el cuidador perfecto para tu mascota en solo 4 simples pasos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 -z-10"></div>
              )}
              
              <Card className="p-6 relative bg-white">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold relative">
                  {step.step}
                </div>
                <div className="text-primary-600 mb-3">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;