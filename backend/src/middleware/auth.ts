import { createMiddleware } from 'hono/factory'
import { initAuth } from '../auth/init'
import { Bindings, Variables } from '../main'

export const authMiddleware = createMiddleware<{
  Bindings: Bindings
  Variables: Variables
}>(async (c, next) => {
  console.log('checking auth...')

  if (!c.get('auth')) {
    console.log('No auth instance found, initializing...')
    c.set('auth', initAuth(c))
  }

  const auth = c.get('auth')
  console.log('Auth instance found, proceeding with authentication...', auth)

  const session = await auth.api.getSession({ headers: c.req.raw.headers })

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
