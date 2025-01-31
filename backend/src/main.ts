import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { rooms } from './schema'

export interface Bindings {
  FRONTEND_BASE_URL: string | undefined
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_BASE_URL ?? ''
  return cors({ origin })(c, next)
})

app.get('/', async (c) => {
  return c.json('another thing')
})

app.get('/rooms', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(rooms).execute()
  return c.json(result)
})

app.notFound((c) => {
  return c.json('Not found', 404)
})

export default app
