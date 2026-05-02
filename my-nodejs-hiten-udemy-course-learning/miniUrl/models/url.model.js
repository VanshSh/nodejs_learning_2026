
import { integer, pgTable, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),

    shortCode: varchar('code', { lenght: 155 }).notNull().unique(),
    targetUrl: text(
        'target_url'
    ).notNull(),

    userId: uuid('user_id').references(() => usersTable.id).notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})
