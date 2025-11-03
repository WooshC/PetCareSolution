import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CTA = () => {
  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para empezar?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Únete a nuestra comunidad de amantes de las mascotas y descubre la tranquilidad 
          de saber que tu mejor amigo está en buenas manos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register?role=owner">
            <Button variant="secondary" size="large" className="hover-scale">
              Registrarse como Dueño
            </Button>
          </Link>
          <Link to="/register?role=caregiver">
            <Button 
              variant="outline" 
              size="large" 
              className="border-white text-white hover:bg-white hover:text-primary-600 hover-scale"
            >
              Registrarse como Cuidador
            </Button>
          </Link>
        </div>
        <p className="text-primary-200 text-sm mt-4">
          Regístrate en menos de 2 minutos • Sin compromisos
        </p>
      </div>
    </section>
  );
};

export default CTA;