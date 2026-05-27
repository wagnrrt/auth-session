import { pgTable, timestamp, uuid, varchar, char, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  id: uuid()
    .primaryKey(),
  user_id: uuid()
    .references(() => users.id, { onDelete: "cascade" }),

  token: char({ length: 64 }).notNull(),
  expires_at: timestamp().notNull(),

  ip_address: varchar({ length: 45 }).notNull(),
  os: varchar({ length: 100 }).notNull(),
  browser: varchar({ length: 100 }).notNull(),
  device: varchar({ length: 50 }).notNull().default("desktop"),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => ([
  index("idx_token").on(table.token),
  index("idx_expires_at").on(table.expires_at),
]))
