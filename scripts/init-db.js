import pool from "../lib/db.js";

async function init() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS datasets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      database_id TEXT,
      progress TEXT,
      old_video_links TEXT[],
      new_video_links TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("✅ Database table initialized.");
  process.exit();
}

init().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
