import { pgTable, integer, varchar, index } from 'drizzle-orm/pg-core'

const usersTable = pgTable(
  'users',
  {
    id: integer().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
  },
  (table) => ({
    searchIndex: index('users_email_idx').on(table.email),
  }),
)

export { usersTable }
