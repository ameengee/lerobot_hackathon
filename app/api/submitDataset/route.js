import pool from "@/lib/db"

export async function POST(req) {
  const body = await req.json()
  const { database_id, progress, old_video_links, new_video_links } = body

  if (!database_id || !old_video_links || !new_video_links || !progress) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const result = await pool.query(
    `
    INSERT INTO datasets (database_id, progress, old_video_links, new_video_links)
    VALUES ($1, $2, $3, $4)
    `,
    [database_id, progress, old_video_links, new_video_links]
  )

  return Response.json({ status: "success" })
}