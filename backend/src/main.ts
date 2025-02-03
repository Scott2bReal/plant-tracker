import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { AnyD1Database, drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { rooms } from './schema'

export interface Bindings {
  FRONTEND_BASE_URL: string | undefined
  DB: AnyD1Database
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const roomRoute = app.get(
  '/rooms/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param')
    const db = drizzle(c.env.DB)
    const result = await db
      .selectDistinct()
      .from(rooms)
      .where(eq(rooms.id, parseInt(id)))
      .limit(1)
      .execute()
    if (!result[0]) {
      return c.json('Not found', 404)
    }
    return c.json(result[0])
  }
)
export type RoomRouteType = typeof roomRoute

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createRoomRoute = app.post(
  `/rooms/create`,
  zValidator(
    'json',
    z.object({
      name: z.string(),
    })
  ),
  async (c) => {
    const { name } = c.req.valid('json')
    const db = drizzle(c.env.DB)
    const result = await db
      .insert(rooms)
      .values({ name, lastWatered: new Date().toISOString() })
      .execute()
    return c.json(result)
  }
)
export type CreateRoomRouteType = typeof createRoomRoute

app.notFound((c) => {
  return c.json('Not found', 404)
})

export default app
