import { createQuery, focusManager } from '@tanstack/solid-query'
import { onCleanup } from 'solid-js'
import './App.css'
import { apiFetch } from './lib/api-fetch'

function App() {
  const callback = () => {
    console.log('Document focused', focusManager.isFocused())
  }

  document.addEventListener('focus', callback)
  onCleanup(() => {
    document.removeEventListener('focus', callback)
  })

  const queryResult = createQuery(() => ({
    queryKey: ['basic query'],
    queryFn: () => apiFetch('/plants'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    // throwOnError: true, // Throw an error if the query fails
    refetchOnWindowFocus: 'always',
  }))

  return (
    <>
      <h1>Data from backend</h1>
      <h2>Status</h2>
      <p>{queryResult.status}</p>
      <h3>Data</h3>
      <pre>{JSON.stringify(queryResult.data, null, 2)}</pre>
    </>
  )
}

export default App
