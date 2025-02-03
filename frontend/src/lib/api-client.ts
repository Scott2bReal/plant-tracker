import { Hono } from 'hono'
import { hc } from 'hono/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiClient<T extends Hono<any, any, any>>() {
  return hc<T>(import.meta.env.VITE_BACKEND_BASE_URL)
}
