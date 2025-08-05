import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';

const AdminDashboard = () => {
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchWithToken = useFetch();

  useEffect(() => {
    fetchCuidadores();
  }, []);

  const fetchCuidadores = async () => {
    setLoading(true);
    try {
      const data = await fetchWithToken(`${API_URL}/api/cuidador`);
      const pendientes = data.filter(c => c.estado !== 'Activo');
      setCuidadores(pendientes);
    } catch (error) {
      console.error('Error al cargar cuidadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const activarCuidador = async (cuidador) => {
    try {
      await fetchWithToken(`${API_URL}/api/cuidador/${cuidador.cuidadorID}`, {
        method: 'PUT',
        body: JSON.stringify({ ...cuidador, estado: 'Activo' }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchCuidadores();
    } catch (err) {
      console.error('Error al activar cuidador:', err);
    }
  };

  if (loading) return <p>Cargando cuidadores...</p>;

  return (
    <div>
      <h2>Gestión de Cuidadores</h2>
      {cuidadores.length === 0 ? (
        <p>No hay cuidadores pendientes.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuidadores.map(c => (
              <tr key={c.cuidadorID}>
                <td>{c.nombreUsuario}</td>
                <td>{c.emailUsuario}</td>
                <td>{c.estado}</td>
                <td>
                  <button onClick={() => activarCuidador(c)}>Activar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
