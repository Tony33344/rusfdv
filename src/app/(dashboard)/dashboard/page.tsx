import { auth } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Mic, ClipboardList, Trophy, Clock, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Студент";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Привет, {userName}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Добро пожаловать в курс русского языка. Продолжайте учиться!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">0/30</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Уроков пройдено</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">0%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Посещаемость</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Trophy className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Баллов</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="text-orange-600 dark:text-orange-400" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">0ч</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Время обучения</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/lessons"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl group-hover:scale-110 transition">
              <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Уроки
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            30 уроков с фонетикой, грамматикой и разговорными темами.
          </p>
        </Link>

        <Link
          href="/dashboard/practice"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl group-hover:scale-110 transition">
              <Mic className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Практика
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Тренируйте произношение с AI-репетитором и практикуйте разговорную речь.
          </p>
        </Link>

        <Link
          href="/dashboard/progress"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl group-hover:scale-110 transition">
              <ClipboardList className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Прогресс
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Отслеживайте свой прогресс, оценки и посещаемость курса.
          </p>
        </Link>
      </div>

      {/* Current Lesson Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Следующий урок
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Урок 1: Фонетика и азбука
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Знакомство с русским алфавитом и основами произношения
            </p>
          </div>
          <Link
            href="/dashboard/lessons/1"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Начать
          </Link>
        </div>
      </div>
    </div>
  );
}
