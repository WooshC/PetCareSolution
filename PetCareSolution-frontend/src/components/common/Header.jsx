import React from 'react';
import { PawPrint, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Ahora enlaza a /Home */}
          <Link to="/Home" className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">PetCare</span>
              <span className="text-xl font-bold text-primary-600">Solution</span>
            </div>
          </Link>

          {/* Desktop Navigation - Usando Link de React Router */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/Home#features" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Características
            </Link>
            <Link 
              to="/Home#how-it-works" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Cómo Funciona
            </Link>
            <Link 
              to="/Home#faq" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              FAQ
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="small">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="small">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/Home#features" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </Link>
              <Link 
                to="/Home#how-it-works" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link 
                to="/Home#faq" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="small" className="w-full justify-center">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" size="small" className="w-full justify-center">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;