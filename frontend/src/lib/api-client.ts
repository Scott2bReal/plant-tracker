import type { Hono } from 'hono'
import { hc } from 'hono/client'

// biome-ignore lint: suspicious/noExplicitAny This is how Hono likes it
export function apiClient<T extends Hono<any, any, any>>() {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('plant-tracker-token')
      : null
  return hc<T>('/', {
    fetch: (input: URL | RequestInfo, init?: RequestInit) => {
      const headers = new Headers(init?.headers)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return fetch(input, { ...init, headers })
    },
  })
}
