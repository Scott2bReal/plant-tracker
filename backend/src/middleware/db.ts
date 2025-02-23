import { drizzle } from 'drizzle-orm/d1'
import { createMiddleware } from 'hono/factory'
import { Bindings, Variables } from '../main'

export const dbMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  console.log('setting up db...')
  const db = drizzle(c.env.DB)
  c.set('db', db)
  return await next()
})
