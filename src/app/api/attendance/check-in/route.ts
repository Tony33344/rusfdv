import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const lessonNumber = Number(body?.lessonId ?? body?.lessonNumber);

  if (!Number.isFinite(lessonNumber) || lessonNumber <= 0) {
    return NextResponse.json({ error: "Invalid lessonId" }, { status: 400 });
  }

  // Placeholder response - attendance tracking will use localStorage for now
  // In production, this would save to Supabase tables
  return NextResponse.json({
    lessonNumber,
    status: "PRESENT",
    checkedInAt: new Date().toISOString(),
    message: "Посещаемость отмечена / Attendance recorded",
  });
}
