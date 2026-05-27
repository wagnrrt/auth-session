import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid()
    .primaryKey(),

  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull().$onUpdateFn(() => new Date())
});


