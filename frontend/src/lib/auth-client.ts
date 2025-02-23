import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  plugins: [magicLinkClient()],
})
