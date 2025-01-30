import { drizzle } from 'drizzle-orm/d1'
import { Bindings } from '..'

export const db = (env: Bindings) => drizzle(env.DB)
