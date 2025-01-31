import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Bindings {
  FRONTEND_BASE_URL: string | undefined
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_BASE_URL ?? ''
  return cors({ origin })(c, next)
})

app.get('/', async (c) => {
  await sleep(700)
  return c.json('another thing')
})

app.get('/plants', async (c) => {
  await sleep(700)
  return c.json([{ name: 'Fern' }, { name: 'Palm' }, { name: 'Cactus' }])
})

export default app
