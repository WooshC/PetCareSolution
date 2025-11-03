import React from 'react';
import { PawPrint, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/Home" className="flex items-center space-x-2 mb-4">
              <PawPrint className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold">PetCareSolution</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Conectando dueños de mascotas con cuidadores profesionales de confianza.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@petcaresolution.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Ciudad, País</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/Home" className="block hover:text-white transition-colors">Inicio</Link>
              <Link to="/Home#features" className="block hover:text-white transition-colors">Características</Link>
              <Link to="/Home#how-it-works" className="block hover:text-white transition-colors">Cómo Funciona</Link>
              <Link to="/Home#faq" className="block hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="#" className="block hover:text-white transition-colors">Términos de Servicio</a>
              <a href="#" className="block hover:text-white transition-colors">Política de Privacidad</a>
              <a href="#" className="block hover:text-white transition-colors">Cookies</a>
              <a href="#" className="block hover:text-white transition-colors">Aviso Legal</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PetCare Solution. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;