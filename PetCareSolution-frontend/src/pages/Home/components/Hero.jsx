import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
      {/* Background image (marca de agua) */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-4.5 blur-sm"
        style={{
          backgroundImage:
            "url('https://imgs.search.brave.com/X9RMzcm4dVZzmQe7iORRk-Clzc55O8VfgQBEpCpdlUI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9iODVvemIy/cTM1OG8vM0MxT0tq/dUx0OGlJY0pnSmZx/dXhqSi8xOWY5ZDY0/MWViNTkyNTRkMGUx/MWVmODlhZjJmNTlh/Yi9wZXJyb19mZWxp/ei5wbmc')",
        }}
      ></div>

      {/* Fondo decorativo adicional */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-400 rounded-full"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-md">
          Cuidado Profesional
          <span className="block text-primary-600">para tu Mejor Amigo</span>
        </h1>
        <p className="text-xl md:text-2xl font-semibold mb-8 max-w-3xl mx-auto leading-relaxed 
                      text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0)]">
          Conectamos dueños de mascotas con cuidadores verificados y de confianza. 
          Tú tranquilidad es nuestra prioridad.
        </p>


        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
      </div>
    </section>
  );
};

export default Hero;
