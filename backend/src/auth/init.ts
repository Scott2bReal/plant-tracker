import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { Context } from 'hono'
import { Bindings, Variables } from '../main'

export const initAuth = (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  return betterAuth({
    database: drizzleAdapter(c.env.DB, {
      provider: 'sqlite',
    }),
    emailAndPassword: { enabled: true, autoSignIn: true },
  })
}
