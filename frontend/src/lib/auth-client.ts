import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({
  baseURL: '/api',
  plugins: [magicLinkClient()],
})
