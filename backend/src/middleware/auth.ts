import { createMiddleware } from 'hono/factory'
import { initAuth } from '../auth/init'
import { Bindings, Variables } from '../main'

export const authMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  console.log('checking auth...')

  const auth = initAuth(c)
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  console.log('Session: ', session)

  if (!session) {
    c.set('user', null)
    c.set('session', null)
    c.status(401)
    return await next()
  }

  console.log('User authenticated: ', session.user.name)

  c.set('user', session.user)
  c.set('session', session.session)
  return await next()
})
