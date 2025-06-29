import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema/index"
import * as dotenv from "dotenv"
// Database connection
dotenv.config()
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/real_estate_db"

// Create postgres client
export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create drizzle instance with relations
export const db = drizzle(sql, {
  schema: {
    ...schema,

  },
})

// Test connection
export async function testConnection() {
  try {
    await sql`SELECT 1`
    console.log("✅ Database connected successfully")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Graceful shutdown
export async function closeConnection() {
  await sql.end()
  console.log("🔌 Database connection closed")
}
