export async function apiFetch(path: string = ''): Promise<Response> {
  const result = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}${path}`)
  if (!result.ok) throw new Error('Failed to fetch data')
  return result.json()
}
