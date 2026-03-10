import 'dotenv/config'
import { usersTable } from './drizzle/schema.js'
import { db } from './db/index.js'

async function getAllUsers() {
  const users = await db.select().from(usersTable)
  console.log('😇 L-6 in index.js=> ', users)
  return users
}

async function createUsers({ id, name, email }) {
  const newUser = await db.insert(usersTable).values({ id, name, email })
  console.log('😇 L-18 in index.js=> ', newUser)
  return newUser
}

// createUsers({ id: 3, name: 'Vinod Bisht', email: 'vinod.bisht@example.com' })
getAllUsers()
