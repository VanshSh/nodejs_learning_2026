import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { usersTable } from './drizzle/schema.js'
import { db } from './db/index.js'

// CRUD operations to test the connection and queries with Drizzle ORM and PostgreSQL.

async function getAllUsers() {
  const users = await db.select().from(usersTable)
  console.log('😇 getAllUsers =>', users)
  return users
}

async function getUserById(id) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1)

  console.log('😇 getUserById =>', user)
  return user?.[0] ?? null
}

async function createUser({ id, name, email }) {
  const newUser = await db.insert(usersTable).values({ id, name, email })
  console.log('😇 createUser =>', newUser)
  return newUser
}

async function updateUser(id, updates) {
  const updated = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, id))

  console.log('😇 updateUser =>', updated)
  return updated
}

async function deleteUser(id) {
  const deleted = await db.delete(usersTable).where(eq(usersTable.id, id))
  console.log('😇 deleteUser =>', deleted)
  return deleted
}

async function main() {
  // Adjust the data below as needed to match your existing rows/IDs.
  const id = Math.floor(Date.now() / 1000)
  const email = `vinod.bisht+${id}@example.com`

  await createUser({
    id,
    name: 'Vinod Bisht',
    email,
  })

  await getAllUsers()
  await getUserById(id)
  await updateUser(id, { name: 'Vinod B.', email: `vinod.b+${id}@example.com` })
  await getUserById(id)
  await deleteUser(id)
  await getAllUsers()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
