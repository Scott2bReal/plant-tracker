import { magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'

export const authClient = createAuthClient({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:5173'
    : 'https://plant-tracker.scott-app.com',
  plugins: [magicLinkClient()],
})
