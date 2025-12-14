import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// FDV Grading System:
// - Written exam (50%): 60-69=6, 70-79=7, 80-89=8, 90-96=9, 97-100=10
// - Oral exam (25%)
// - Presentation (15%)
// - Homework + Attendance (10%)

interface GradeBreakdown {
  written: { score: number; weight: 0.5; grade: number | null };
  oral: { score: number; weight: 0.25; grade: number | null };
  presentation: { score: number; weight: 0.15; grade: number | null };
  homework: { score: number; weight: 0.1; grade: number | null };
  attendance: { present: number; total: number; percentage: number };
  finalGrade: number | null;
  passed: boolean;
}

function scoreToGrade(score: number): number | null {
  if (score < 60) return null; // Failed
  if (score < 70) return 6;
  if (score < 80) return 7;
  if (score < 90) return 8;
  if (score < 97) return 9;
  return 10;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return demo data for now (no database connection required)
  // In production, this would fetch from Supabase tables
  const demoGrades: GradeBreakdown = {
    written: { score: 0, weight: 0.5, grade: null },
    oral: { score: 0, weight: 0.25, grade: null },
    presentation: { score: 0, weight: 0.15, grade: null },
    homework: { score: 0, weight: 0.1, grade: null },
    attendance: { present: 0, total: 30, percentage: 0 },
    finalGrade: null,
    passed: false,
  };

  return NextResponse.json({
    breakdown: demoGrades,
    details: {
      writtenExams: [],
      oralExams: [],
      presentations: [],
      homeworkSubmissions: [],
    },
    message: "Оценки будут доступны после сдачи экзаменов / Grades will be available after exams",
  });
}
