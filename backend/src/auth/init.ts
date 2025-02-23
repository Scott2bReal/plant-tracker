import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { Context } from 'hono'
import { Resend } from 'resend'
import { Bindings, Variables } from '../main'
import { authTables } from '../schema'

export const initAuth = (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  return betterAuth({
    trustedOrigins: c.env.ALLOW_DOMAINS?.split(',') ?? [],
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const allowedEmails = c.env.ALLOWED_EMAILS?.split(',') ?? []
          console.log(allowedEmails)
          if (!allowedEmails.includes(email)) {
            console.error('Invalid email')
            throw new Error('Invalid email')
          }
          const resend = new Resend(c.env.RESEND_API_KEY ?? '')
          if (!resend) return
          const emailResult = await resend.emails.send({
            from: 'magic-link@plant-tracker.scott-app.com',
            to: email,
            subject: 'Log in to Plant Tracker',
            text: `Click this link to log in: ${url}`,
          })
          if (emailResult.error) {
            console.error(emailResult.error)
            throw new Error('Error sending magic link')
          }
        },
      }),
    ],
    database: drizzleAdapter(c.var.db, {
      provider: 'sqlite',
      schema: authTables,
    }),
  })
}
