import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const credentials = pgTable("credentials", {
  user_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  password_hash: varchar({ length: 255 }).notNull(),

  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull().$onUpdateFn(() => new Date()),
});
