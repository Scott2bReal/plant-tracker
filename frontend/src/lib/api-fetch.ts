type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiFetchOptions {
  method?: HttpMethod
  body?: object
  headers?: HeadersInit
}

export async function apiFetch(
  path: string = '',
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { method = 'GET', body, headers = {} } = options

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  }

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }

  const result = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}${path}`,
    requestOptions
  )

  if (!result.ok) {
    throw new Error(`API request failed: ${result.status} ${result.statusText}`)
  }

  return result.json()
}
