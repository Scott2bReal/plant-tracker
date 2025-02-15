import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { AnyD1Database, drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { rooms } from './schema'

export interface Bindings {
  ALLOW_DOMAINS: string | undefined
  DB: AnyD1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS middleware on every route
app.use('*', async (c, next) => {
  console.log('CORS middleware allowed domains', c.env.ALLOW_DOMAINS)
  const allowedDomains =
    c.env.ALLOW_DOMAINS?.split(',').map((domain) => domain.trim()) ?? []
  return cors({
    origin: allowedDomains,
  })(c, next)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allRoomsRoute = app.get('/rooms', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(rooms).execute()
  return c.json(result)
})
export type AllRoomsRouteType = typeof allRoomsRoute

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const createRoomRoute = app.post(
//   `/rooms/create`,
//   zValidator(
//     'json',
//     z.object({
//       name: z.string(),
//     })
//   ),
//   async (c) => {
//     const { name } = c.req.valid('json')
//     const db = drizzle(c.env.DB)
//     const result = await db
//       .insert(rooms)
//       .values({ name, lastWatered: new Date().toLocaleDateString() })
//       .execute()
//     return c.json(result)
//   }
// )
// export type CreateRoomRouteType = typeof createRoomRoute

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
    const db = drizzle(c.env.DB)
    const result = await db
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
