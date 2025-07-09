import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { Context } from 'hono'
import { Resend } from 'resend'
import { Bindings, Variables } from '../main'
import { authTables } from '../schema'

const toISOString = (date: Date | string | undefined): string => {
  if (date instanceof Date) {
    return date.toISOString()
  }
  if (typeof date === 'string') {
    return date
  }
  return new Date().toISOString()
}

export const initAuth = (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  const scottEmail = c.env.ALLOWED_EMAILS?.split(',')[0]
  return betterAuth({
    trustedOrigins: c.env.ALLOW_DOMAINS?.split(',') ?? [],
    session: {
      // 30 days in seconds
      expiresIn: 30 * 24 * 60 * 60,
      preserveSessionInDatabase: true,
    },
    databaseHooks: {
      account: {
        create: {
          // @ts-expect-error Library types are incorrect
          before: async (account) => {
            const formattedAccount = {
              ...account,
              createdAt: toISOString(account.createdAt),
              updatedAt: toISOString(account.updatedAt),
            }
            return {
              data: formattedAccount,
            }
          },
        },
        update: {
          // @ts-expect-error Library types are incorrect
          before: async (account) => {
            const formattedAccount = {
              ...account,
              updatedAt: toISOString(account.updatedAt),
            }
            return {
              data: formattedAccount,
            }
          },
        },
      },
      user: {
        create: {
          // @ts-expect-error Library types are incorrect
          before: async (user) => {
            const formattedUser = {
              ...user,
              name: user.email === scottEmail ? 'Scott' : 'Margot',
              createdAt: toISOString(user.createdAt),
              updatedAt: toISOString(user.updatedAt),
            }
            return {
              data: formattedUser,
            }
          },
        },
        update: {
          // @ts-expect-error Library types are incorrect
          before: async (user) => {
            const formattedUser = {
              ...user,
              updatedAt: toISOString(user.updatedAt),
            }
            return {
              data: formattedUser,
            }
          },
        },
      },
      session: {
        create: {
          // @ts-expect-error Library types are incorrect
          before: async (session) => {
            const formattedSession = {
              ...session,
              createdAt: toISOString(session.createdAt),
              updatedAt: toISOString(session.updatedAt),
              // expire in 30 days
              expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
            return {
              data: formattedSession,
            }
          },
        },
        update: {
          // @ts-expect-error Library types are incorrect
          before: async (session) => {
            const formattedSession = {
              ...session,
              updatedAt: toISOString(session.updatedAt),
              // expire in 30 days
              expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
            return {
              data: formattedSession,
            }
          },
        },
      },
      verification: {
        create: {
          // @ts-expect-error Library types are incorrect
          before: async (verification) => {
            const formattedVerification = {
              ...verification,
              createdAt: toISOString(verification.createdAt),
              updatedAt: toISOString(verification.updatedAt),
              // expire in 5 minutes
              expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            }
            return {
              data: formattedVerification,
            }
          },
        },
        update: {
          // @ts-expect-error Library types are incorrect
          before: async (verification) => {
            const formattedVerification = {
              ...verification,
              createdAt: toISOString(verification.createdAt),
              updatedAt: toISOString(verification.updatedAt),
              // expire in 5 minutes
              expiresAt: toISOString(new Date(Date.now() + 5 * 60 * 1000)),
            }
            return {
              data: formattedVerification,
            }
          },
        },
      },
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const allowedEmails = c.env.ALLOWED_EMAILS?.split(',') ?? []
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
