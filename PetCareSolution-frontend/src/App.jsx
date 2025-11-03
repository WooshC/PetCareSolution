import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirección automática de / a /Home */}
          <Route path="/" element={<Navigate to="/Home" replace />} />
          
          {/* Ruta principal en /Home */}
          <Route path="/Home" element={<Home />} />
          
          {/* Futuras rutas */}
          <Route path="/login" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Login Page - En desarrollo</div>} />
          <Route path="/register" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Register Page - En desarrollo</div>} />
          
          {/* Ruta de fallback - redirige a /Home */}
          <Route path="*" element={<Navigate to="/Home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;