"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Mic,
  Presentation,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

interface GradeBreakdown {
  written: { score: number; weight: number; grade: number | null };
  oral: { score: number; weight: number; grade: number | null };
  presentation: { score: number; weight: number; grade: number | null };
  homework: { score: number; weight: number; grade: number | null };
  attendance: { present: number; total: number; percentage: number };
  finalGrade: number | null;
  passed: boolean;
}

interface GradeDetails {
  writtenExams: Array<{ name: string; score: number | null; date: string | null }>;
  oralExams: Array<{ name: string; score: number | null; date: string | null }>;
  presentations: Array<{ name: string; score: number | null; date: string | null }>;
  homeworkCount: number;
  totalAssignments: number;
}

export default function GradesPage() {
  const [breakdown, setBreakdown] = useState<GradeBreakdown | null>(null);
  const [details, setDetails] = useState<GradeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const response = await fetch("/api/grades");
        if (!response.ok) throw new Error("Failed to fetch grades");
        const data = await response.json();
        setBreakdown(data.breakdown);
        setDetails(data.details);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Не удалось загрузить оценки");
        // Set demo data for display
        setBreakdown({
          written: { score: 0, weight: 0.5, grade: null },
          oral: { score: 0, weight: 0.25, grade: null },
          presentation: { score: 0, weight: 0.15, grade: null },
          homework: { score: 0, weight: 0.1, grade: null },
          attendance: { present: 0, total: 30, percentage: 0 },
          finalGrade: null,
          passed: false,
        });
        setDetails({
          writtenExams: [],
          oralExams: [],
          presentations: [],
          homeworkCount: 0,
          totalAssignments: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const gradeColor = (grade: number | null) => {
    if (grade === null) return "text-gray-400";
    if (grade >= 9) return "text-green-500";
    if (grade >= 7) return "text-blue-500";
    if (grade >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Оценки и прогресс 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Система оценивания по стандартам FDV (4 кредитные точки)
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <AlertTriangle size={20} />
            <span>{error} — показаны демо-данные</span>
          </div>
        </div>
      )}

      {/* Final Grade Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Итоговая оценка</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold">
                {breakdown?.finalGrade ?? "—"}
              </span>
              {breakdown?.passed ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full text-sm">
                  <CheckCircle size={16} />
                  Зачёт
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 rounded-full text-sm">
                  <XCircle size={16} />
                  Не зачтено
                </span>
              )}
            </div>
          </div>
          <TrendingUp size={64} className="text-white/20" />
        </div>
      </div>

      {/* Grade Breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Written Exam */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Письменный</p>
              <p className="text-xs text-gray-400">50% от оценки</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${scoreColor(breakdown?.written.score ?? 0)}`}>
              {breakdown?.written.score ?? 0}%
            </span>
            <span className={`text-xl font-semibold ${gradeColor(breakdown?.written.grade ?? null)}`}>
              {breakdown?.written.grade ?? "—"}
            </span>
          </div>
        </div>

        {/* Oral Exam */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Mic className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Устный</p>
              <p className="text-xs text-gray-400">25% от оценки</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${scoreColor(breakdown?.oral.score ?? 0)}`}>
              {breakdown?.oral.score ?? 0}%
            </span>
            <span className={`text-xl font-semibold ${gradeColor(breakdown?.oral.grade ?? null)}`}>
              {breakdown?.oral.grade ?? "—"}
            </span>
          </div>
        </div>

        {/* Presentation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Presentation className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Презентация</p>
              <p className="text-xs text-gray-400">15% от оценки</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${scoreColor(breakdown?.presentation.score ?? 0)}`}>
              {breakdown?.presentation.score ?? 0}%
            </span>
            <span className={`text-xl font-semibold ${gradeColor(breakdown?.presentation.grade ?? null)}`}>
              {breakdown?.presentation.grade ?? "—"}
            </span>
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <FileText className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Домашние задания</p>
              <p className="text-xs text-gray-400">10% от оценки</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${scoreColor(breakdown?.homework.score ?? 0)}`}>
              {breakdown?.homework.score ?? 0}%
            </span>
            <span className="text-sm text-gray-500">
              {details?.homeworkCount ?? 0}/{details?.totalAssignments ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
              <Calendar className="text-teal-600 dark:text-teal-400" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Посещаемость
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Минимум 75% для допуска к экзамену
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-3xl font-bold ${
                (breakdown?.attendance.percentage ?? 0) >= 75
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {breakdown?.attendance.percentage ?? 0}%
            </span>
            <p className="text-sm text-gray-500">
              {breakdown?.attendance.present ?? 0} / {breakdown?.attendance.total ?? 30} занятий
            </p>
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              (breakdown?.attendance.percentage ?? 0) >= 75
                ? "bg-green-500"
                : "bg-red-500"
            }`}
            style={{ width: `${breakdown?.attendance.percentage ?? 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>0%</span>
          <span className="text-yellow-500">75% (минимум)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Grading Scale */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Шкала оценивания FDV
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { grade: 6, range: "60-69%", color: "bg-yellow-100 text-yellow-700" },
            { grade: 7, range: "70-79%", color: "bg-lime-100 text-lime-700" },
            { grade: 8, range: "80-89%", color: "bg-green-100 text-green-700" },
            { grade: 9, range: "90-96%", color: "bg-emerald-100 text-emerald-700" },
            { grade: 10, range: "97-100%", color: "bg-teal-100 text-teal-700" },
          ].map((item) => (
            <div
              key={item.grade}
              className={`${item.color} rounded-lg p-3 text-center`}
            >
              <div className="text-2xl font-bold">{item.grade}</div>
              <div className="text-xs opacity-75">{item.range}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Для положительной оценки необходимо набрать минимум 60% и иметь 75% посещаемости.
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Требования курса (4 КТ / 60 часов)
        </h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-500" />
            75% обязательная присутствие и активное участие
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-500" />
            Своевременное выполнение домашних заданий
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-500" />
            Устная презентация (2 семестр)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-blue-500" />
            Письменный и устный экзамен
          </li>
        </ul>
      </div>
    </div>
  );
}
