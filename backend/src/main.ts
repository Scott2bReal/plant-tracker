import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { AnyD1Database, DrizzleD1Database } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import { dbMiddleware } from './middleware/db'
import { rooms } from './schema'
import { JwtVariables } from 'hono/jwt'
import { sign, jwt } from 'hono/jwt'

export interface Bindings {
  DB: AnyD1Database
  JWT_SECRET: string
  APP_PASSWORD: string
}

export interface Variables extends JwtVariables {
  db: DrizzleD1Database
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath(
  '/api'
)

// Set up DB
app.use('*', async (c, next) => await dbMiddleware(c, next))

// JWT middleware for all routes except login
app.use('*', async (c, next) => {
  // Skip JWT check for login endpoint
  if (c.req.path === '/api/login') {
    return await next()
  }
  return await jwt({ secret: c.env.JWT_SECRET })(c, next)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allRoomsRoute = app.get('/rooms', async (c) => {
  const result = await c.var.db.select().from(rooms).execute()
  return c.json(result)
})
export type AllRoomsRouteType = typeof allRoomsRoute

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const waterRoomRoute = app.put(
  `/rooms/:id/water`,
  zValidator(
    'param',
    z.object({
      id: z.string(),
    })
  ),
  zValidator(
    'json',
    z.object({
      lastWatered: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param')
    const { lastWatered } = c.req.valid('json')
    const result = await c.var.db
      .update(rooms)
      .set({ lastWatered: lastWatered })
      .where(eq(rooms.id, parseInt(id)))
      .execute()
    return c.json(result)
  }
)
export type WaterRoomRouteType = typeof waterRoomRoute

// Login endpoint (no registration, hard-coded password)
const loginRoute = app.post(
  '/login',
  zValidator(
    'json',
    z.object({
      password: z.string(),
    })
  ),
  async (c) => {
    const { password } = c.req.valid('json')
    if (password !== c.env.APP_PASSWORD) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    // You can add a username field if you want to distinguish users, or just issue a generic token
    const token = await sign({ role: 'user' }, c.env.JWT_SECRET)
    return c.json({ token })
  }
)
export type LoginRouteType = typeof loginRoute

app.notFound((c) => {
  return c.json('Not found', 404)
})

export default app
