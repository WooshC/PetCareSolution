import React from 'react';
import { Shield, Clock, Star, MapPin, Heart, Users } from 'lucide-react';
import Card from '../../../components/ui/Card';

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cuidadores Verificados",
      description: "Todos nuestros cuidadores pasan por un riguroso proceso de verificación y background check para tu total tranquilidad."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Disponibilidad 24/7",
      description: "Encuentra cuidadores disponibles en cualquier momento del día, los 7 días de la semana, incluso en emergencias."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Calificaciones y Reseñas",
      description: "Lee experiencias reales de otros dueños de mascotas antes de tomar una decisión informada."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Servicios Personalizados",
      description: "Desde paseos diarios hasta cuidado prolongado, encuentra el servicio perfecto para tus necesidades."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad Confiable",
      description: "Únete a una comunidad de amantes de mascotas que comparten tus mismos valores y cuidados."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por qué elegir PetCare Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos la mejor experiencia para ti y tu mascota con servicios de calidad 
            y cuidadores de confianza que realmente aman a los animales.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="p-6 text-center hover-scale">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;