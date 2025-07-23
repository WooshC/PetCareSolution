import { useEffect, useState } from 'react'

export const useFetch = (url, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token') // o desde contexto
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}
