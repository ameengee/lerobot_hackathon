import { NextResponse } from "next/server";

export async function POST(req) {
  const { dataset_id } = await req.json();

  console.log("🔍 Scanning dataset:", dataset_id);

  const visited = new Set();
  const mp4Paths = [];

  const crawl = async (path = "") => {
    const url = `https://huggingface.co/api/datasets/${dataset_id}/tree/main/${path}`;
    const res = await fetch(url);
    if (!res.ok) return;

    const files = await res.json();
    for (const file of files) {
      const currentPath = file.path; // ✅ USE THIS DIRECTLY

      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      console.log("✅ Crawled file:", file);
      console.log("📄 Full path:", currentPath);

      if (file.type === "directory") {
        await crawl(currentPath); // ✅ Just recurse into it
      } else if (currentPath.endsWith(".mp4")) {
        mp4Paths.push(currentPath); // ✅ Save relative path
      }
    }
  };

  try {
    await crawl();

    const old_video_links = mp4Paths.map(
      (p) => `https://huggingface.co/datasets/${dataset_id}/resolve/main/${p}`
    );

    const new_video_links = old_video_links.map((url) =>
      url.replace("/episode_", "/episode_gen_")
    );

    console.log("🎞️ Found MP4s:", mp4Paths);

    return NextResponse.json({
      old_video_links: old_video_links.slice(0, 5),
      new_video_links: new_video_links.slice(0, 5),
    });
  } catch (err) {
    console.error("❌ API scan error:", err);
    return NextResponse.json({ error: "Failed to crawl dataset." }, { status: 500 });
  }
}
