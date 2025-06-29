


import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit";

dotenv.config()
console.log(process.env.DATABASE_URL)

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore"
  schema: "./src/database/schema",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/mydb",
  }
});
