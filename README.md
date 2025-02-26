## Plant tracker

Learning to use Solid for app development on Cloudflare.

This project is a monorepo using `pnpm` workspaces. The frontend is hosted on Cloudflare pages (could transition to a worker at some point), while the backend is hosted in a Cloudflare Worker.

### Installation

Run `pnpm install` in the project root to install all dependencies for both front and back ends.

Any additional dependencies should be added from the project root, using e.g. `pnpm add --filter frontend zod`

### Scripts

Dev servers for both frontend and backend can be initiated using `pnpm frontend:dev` or `pnpm backend:dev`, respectively.

There also exists a `pnpm check` script, which will check types, linting, and formatting on the front and back ends

### Frontend

Vite with Solid. Types are supplied from the backend via `hono/client`

### Backend

A Hono app connected to a Cloudflare D1 database
