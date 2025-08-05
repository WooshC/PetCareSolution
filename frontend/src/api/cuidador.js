// src/api/cuidador.js
//Karina
export async function getCuidadores() {
  const res = await fetch(`${import.meta.env.VITE_API_CUIDADOR}/api/cuidador`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Error al obtener cuidadores: ${res.status}`)
  }

  return await res.json()
}
//Fin Karina