import React from 'react';
import { ArrowRight, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ AÑADIR ESTA LÍNEA
import Button from '../../../components/ui/Button';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-400 rounded-full"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center"> 

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Cuidado Profesional
            <span className="block text-primary-600">para tu Mejor Amigo</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Conectamos dueños de mascotas con cuidadores verificados y de confianza. 
            Tu tranquilidad es nuestra prioridad.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/register">
              <Button size="large" className="hover-scale">
                Encontrar un Cuidador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="large" className="hover-scale">
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Cuidadores Verificados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Mascotas Cuidadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;