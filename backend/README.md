## Plant Tracker Backend

This is a [Hono](https://hono.dev/) app hosted in a Cloudflare Worker, using [Better Auth](https://better-auth.vercel.app/) for authentication, [Resend](https://resend.com/emails) for sending emails, and [Drizzle](https://orm.drizzle.team/) for interacting with the Cloudflare D1 database.

### Secrets

For local development, secrets are pulled from the ignored `.dev.vars` file in this directory. Production secrets are managed via the `wrangler` CLI tool. See the `.dev.vars.sample` file for the required variables.
