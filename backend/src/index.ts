import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)

app.get('/', (c) => {
  return c.json('Hello from Hono!')
})

export default app
