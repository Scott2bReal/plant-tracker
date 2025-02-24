import { zValidator } from '@hono/zod-validator'
import { Session, User } from 'better-auth'
import { eq } from 'drizzle-orm'
import { AnyD1Database, DrizzleD1Database } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { z } from 'zod'
import { initAuth } from './auth/init'
import { dbMiddleware } from './middleware/db'
import { rooms } from './schema'

export interface Bindings {
  DB: AnyD1Database
  RESEND_API_KEY: string | undefined
  ALLOWED_EMAILS: string | undefined
}

export interface Variables {
  user: User | null
  session: Session | null
  db: DrizzleD1Database
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>().basePath(
  '/api'
)

// Set up DB
app.use('*', async (c, next) => await dbMiddleware(c, next))

// Auth middleware
// app.use('*', async (c, next) => await authMiddleware(c, next))

app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  const auth = initAuth(c)
  return auth.handler(c.req.raw)
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

app.notFound((c) => {
  return c.json('Not found', 404)
})

export default app
