import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db, sql } from "./src/database/connection"

import dotenv from 'dotenv'
async function runMigrations() {
  console.log("🚀 Running database migrations...")
  dotenv.config()
  console.log(process.env.DATABASE_URL)
  try {
    await migrate(db, { migrationsFolder: "./drizzle" })
    console.log("✅ Migrations completed successfully")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigrations()
