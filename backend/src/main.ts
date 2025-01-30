import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db } from './db'

export interface Bindings {
  FRONTEND_BASE_URL: string
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_BASE_URL
  return cors({ origin })(c, next)
})

app.get('/', (c) => {
  const database = db(c.env)
  console.log(database)
  return c.json('Hello from Hono!')
})

app.post('/add-plant', async (c) => {
  const database = db(c.env)
})

export default app
