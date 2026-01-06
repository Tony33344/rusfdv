import Link from "next/link";
import { CheckCircle, Play, Lock as LockIcon } from "lucide-react";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";

interface LessonMeta {
  id: number;
  title: {
    ru: string;
    sl: string;
    en: string;
  };
  textbookTheme: number;
  grammar?: {
    topic: string;
  };
  conversation?: {
    topic: string;
  };
}

async function getLessons(): Promise<LessonMeta[]> {
  const lessonsDir = path.join(process.cwd(), "content", "lessons");
  
  try {
    const files = await fs.readdir(lessonsDir);
    const lessonFiles = files.filter((f) => f.endsWith(".json")).sort();
    
    const lessons = await Promise.all(
      lessonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(lessonsDir, file), "utf8");
        return JSON.parse(content) as LessonMeta;
      })
    );
    
    return lessons;
  } catch {
    return [];
  }
}

export default async function LessonsPage() {
  const lessons = await getLessons();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // For now, track completed lessons in localStorage on client side
  // This avoids Prisma DB connection issues
  const completedNumbers = new Set<number>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Уроки 📚
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          30 уроков — от алфавита до свободного общения
        </p>
      </div>

      {/* Lesson Grid */}
      <div className="grid gap-4">
        {lessons.map((lesson, index) => {
          const isCompleted = completedNumbers.has(lesson.id);
          
          return (
            <Link
              key={lesson.id}
              href={`/dashboard/lessons/${lesson.id}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Lesson Number */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                  ${isCompleted
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  }
                `}
              >
                {isCompleted ? <CheckCircle size={24} /> : lesson.id}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  Урок {lesson.id}: {lesson.title.ru}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {lesson.grammar?.topic && `Грамматика: ${lesson.grammar.topic}`}
                  {lesson.grammar?.topic && lesson.conversation?.topic && " • "}
                  {lesson.conversation?.topic && `Тема: ${lesson.conversation.topic}`}
                </p>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Play size={20} />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Placeholder lessons if we don't have all 30 yet */}
        {Array.from({ length: Math.max(0, 30 - lessons.length) }).map((_, i) => {
          const lessonNum = lessons.length + i + 1;
          return (
            <div
              key={`placeholder-${lessonNum}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm opacity-60"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                <LockIcon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Урок {lessonNum}
                </h3>
                <p className="text-sm text-gray-500">Скоро будет доступен</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
