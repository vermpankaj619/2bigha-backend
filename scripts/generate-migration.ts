import { sql } from "../src/database/connection"
import dotenv from 'dotenv'
async function generateMigration() {
  console.log("🚀 Generating database migration...")

  dotenv.config()
  try {
    // Enable required extensions
    console.log("📍 Enabling database extensions...")
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await sql`CREATE EXTENSION IF NOT EXISTS postgis`
    await sql`CREATE EXTENSION IF NOT EXISTS postgis_topology`

    console.log("✅ Extensions enabled successfully")
    console.log("📝 Migration files should be generated using: npm run db:generate")
  } catch (error) {
    console.error("❌ Migration generation failed:", error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

generateMigration()
