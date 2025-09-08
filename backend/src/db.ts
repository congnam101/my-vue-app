// backend/src/db.ts
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.DB_HOST || "db",
  database: process.env.POSTGRES_DB || "erp_base",
  password: process.env.POSTGRES_PASSWORD || "123456",
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});
