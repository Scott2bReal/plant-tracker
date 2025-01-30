import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const plantRoomTable = sqliteTable('plant_room', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
})
