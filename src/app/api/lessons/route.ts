import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const lessonsDir = path.join(process.cwd(), "content", "lessons");

  let fileNames: string[];
  try {
    fileNames = await fs.readdir(lessonsDir);
  } catch {
    return NextResponse.json(
      { lessons: [], error: "Missing content/lessons directory" },
      { status: 200 },
    );
  }

  const lessonFiles = fileNames
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const lessons = await Promise.all(
    lessonFiles.map(async (fileName) => {
      const fullPath = path.join(lessonsDir, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const data = JSON.parse(raw) as { id?: number; title?: unknown };
      return {
        fileName,
        id: data.id ?? null,
        title: data.title ?? null,
      };
    }),
  );

  return NextResponse.json({ lessons });
}