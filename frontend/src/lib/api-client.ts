import type { Hono } from 'hono'
import { hc } from 'hono/client'

// biome-ignore lint: suspicious/noExplicitAny This is how Hono likes it
export function apiClient<T extends Hono<any, any, any>>() {
  return hc<T>('/')
}
