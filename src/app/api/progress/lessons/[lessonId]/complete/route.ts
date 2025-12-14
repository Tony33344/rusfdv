import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  const lessonNumber = Number(lessonId);

  if (!Number.isFinite(lessonNumber) || lessonNumber <= 0) {
    return NextResponse.json({ error: "Invalid lessonId" }, { status: 400 });
  }

  // Placeholder response - progress tracking will use localStorage for now
  // In production, this would save to Supabase tables
  return NextResponse.json({
    lessonNumber,
    status: "COMPLETED",
    completedAt: new Date().toISOString(),
    message: "Урок завершён / Lesson completed",
  });
}
