import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - List homework assignments for a student
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return demo data - no database connection required
  // In production, this would fetch from Supabase tables
  return NextResponse.json({
    assignments: [],
    message: "Домашние задания будут доступны после начала курса / Homework will be available after course starts",
  });
}

// POST - Submit homework (placeholder - database not connected)
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Placeholder response - in production would save to Supabase
  return NextResponse.json({
    message: "Функция отправки ДЗ будет доступна после настройки курса / Homework submission will be available after course setup",
    success: false,
  });
}
