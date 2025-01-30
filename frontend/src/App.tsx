import { createQuery } from '@tanstack/solid-query'
import './App.css'

function App() {
  const query = createQuery(() => ({
    queryKey: ['basic query'],
    queryFn: async () => {
      const result = await fetch(import.meta.env.VITE_BACKEND_BASE_URL)
      if (!result.ok) throw new Error('Failed to fetch data')
      return result.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    throwOnError: true, // Throw an error if the query fails
  }))

  return (
    <>
      <h1>Data from backend</h1>
      <h2>Status</h2>
      <p>{query.status}</p>
      <h3>Data</h3>
      <pre>{JSON.stringify(query.data, null, 2)}</pre>
    </>
  )
}

export default App
