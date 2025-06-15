import pool from "../lib/db.js";

async function insertDummyData() {
  const dummyData = {
    database_id: "test123",
    progress: "50%",
    old_video_links: ["https://huggingface.co/datasets/siyavash/so101_test/resolve/main/videos/chunk-000/observation.images.wrist/episode_000000.mp4", "https://huggingface.co/datasets/siyavash/so101_test/resolve/main/videos/chunk-000/observation.images.wrist/episode_000001.mp4"],
    new_video_links: ["https://huggingface.co/datasets/siyavash/so101_test/resolve/main/videos/chunk-000/observation.images.wrist/episode_000002.mp4", "https://huggingface.co/datasets/siyavash/so101_test/resolve/main/videos/chunk-000/observation.images.wrist/episode_000003.mp4"],
  };

  const result = await pool.query(
    `
    INSERT INTO datasets (database_id, progress, old_video_links, new_video_links)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [
      dummyData.database_id,
      dummyData.progress,
      dummyData.old_video_links,
      dummyData.new_video_links
    ]
  );

  console.log("✅ Dummy data inserted:", result.rows[0]);
  process.exit();
}

insertDummyData().catch((err) => {
  console.error("❌ Error inserting dummy data:", err);
  process.exit(1);
});
