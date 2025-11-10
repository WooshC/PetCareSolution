// components/cliente/SolicitudesHeader.jsx
import React from 'react';
import { Plus } from 'lucide-react';

const SolicitudesHeader = ({ totalSolicitudes, onOpenCreateModal }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Mis Solicitudes</h2>
                <p className="text-gray-600 text-sm mt-1">
                    {totalSolicitudes > 0 
                        ? `${totalSolicitudes} solicitud(es) encontrada(s)`
                        : 'Gestiona tus solicitudes de cuidado para mascotas'
                    }
                </p>
            </div>
            <button 
                onClick={onOpenCreateModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Solicitud
            </button>
        </div>
    );
};

export default SolicitudesHeader;