import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const RegistroFinal = () => {
    const [form, setForm] = useState({
        documentoIdentidad: '',
        telefonoEmergencia: '',
        biografia: '',
        experiencia: '',
        horarioAtencion: '',
        tarifaPorHora: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fetchWithToken = useFetch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetchWithToken(`${import.meta.env.VITE_API_BASE_URL}/api/Cuidador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form),
            });

            setSuccess('Perfil guardado correctamente. Espera la validación del administrador.');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Registro como cuidador</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Documento de Identidad:
                    <input
                        type="text"
                        name="documentoIdentidad"
                        value={form.documentoIdentidad}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Teléfono de Emergencia:
                    <input
                        type="text"
                        name="telefonoEmergencia"
                        value={form.telefonoEmergencia}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Biografía:
                    <textarea
                        name="biografia"
                        value={form.biografia}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Experiencia:
                    <textarea
                        name="experiencia"
                        value={form.experiencia}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Horario de Atención:
                    <input
                        type="text"
                        name="horarioAtencion"
                        value={form.horarioAtencion}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Tarifa por hora:
                    <input
                        type="number"
                        name="tarifaPorHora"
                        value={form.tarifaPorHora}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </label>

                <button type="submit">Guardar perfil</button>
            </form>
        </div>
    );
};

export default RegistroFinal;
