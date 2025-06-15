import pool from "@/lib/db"

export async function GET() {
  const result = await pool.query(`
    SELECT id, database_id, progress, old_video_links, new_video_links
    FROM datasets
    ORDER BY created_at DESC
  `)

  console.log(result.rows)

  return Response.json(result.rows)
}