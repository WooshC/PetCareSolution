import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { ratingsService } from '../../services/api';

const CalificarModal = ({ solicitud, onClose, onSuccess }) => {
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (calificacion === 0) {
            setError('Por favor selecciona una calificación de estrellas');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const ratingData = {
                requestId: solicitud.solicitudID,
                cuidadorId: solicitud.cuidadorID,
                score: calificacion,
                comment: comentario
            };

            await ratingsService.createRating(token, ratingData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error al calificar:', err);
            setError(err.message || 'Error al enviar la calificación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-white text-xl font-bold flex items-center">
                        <Star className="w-6 h-6 mr-2 fill-current" />
                        Calificar Servicio
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transaction-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            ¿Cómo fue tu experiencia con <strong>{solicitud.nombreCuidador}</strong>?
                        </p>

                        {/* Estrellas */}
                        <div className="flex justify-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setCalificacion(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredStar || calificacion)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-purple-600">
                            {calificacion > 0 ? `${calificacion} Estrella${calificacion > 1 ? 's' : ''}` : 'Selecciona una calificación'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comentario (Opcional)
                        </label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Cuéntanos más sobre el servicio recibido..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-center">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || calificacion === 0}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Calificación'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalificarModal;
