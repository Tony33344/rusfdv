import { BookOpen, CheckCircle, Clock, Target, Trophy, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  // Mock data - will be replaced with real DB queries
  const stats = {
    lessonsCompleted: 0,
    totalLessons: 30,
    attendancePercent: 0,
    totalPoints: 0,
    studyHours: 0,
  };

  const gradeBreakdown = {
    written: { score: 0, max: 50, label: "Письменный экзамен" },
    oral: { score: 0, max: 25, label: "Устный экзамен" },
    seminar: { score: 0, max: 15, label: "Семинарская работа" },
    homework: { score: 0, max: 10, label: "ДЗ и посещаемость" },
  };

  const totalScore = Object.values(gradeBreakdown).reduce((sum, g) => sum + g.score, 0);
  const maxScore = Object.values(gradeBreakdown).reduce((sum, g) => sum + g.max, 0);

  function getGrade(score: number): string {
    if (score >= 97) return "10";
    if (score >= 90) return "9";
    if (score >= 80) return "8";
    if (score >= 70) return "7";
    if (score >= 60) return "6";
    return "5";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Мой прогресс 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Отслеживайте свои достижения и оценки по курсу
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="text-blue-600" size={24} />}
          value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
          label="Уроков пройдено"
          color="blue"
        />
        <StatCard
          icon={<Target className="text-green-600" size={24} />}
          value={`${stats.attendancePercent}%`}
          label="Посещаемость"
          color="green"
          warning={stats.attendancePercent < 75}
        />
        <StatCard
          icon={<Trophy className="text-purple-600" size={24} />}
          value={totalScore.toString()}
          label="Баллов"
          color="purple"
        />
        <StatCard
          icon={<Clock className="text-orange-600" size={24} />}
          value={`${stats.studyHours}ч`}
          label="Время обучения"
          color="orange"
        />
      </div>

      {/* Grade Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp size={24} className="text-blue-600" />
          Структура оценки
        </h2>

        <div className="space-y-4">
          {Object.entries(gradeBreakdown).map(([key, data]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700 dark:text-gray-300">{data.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.score}/{data.max}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(data.score / data.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Итого: {totalScore}/{maxScore} баллов
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Минимум для сдачи: 60 баллов
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {getGrade(totalScore)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Текущая оценка
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Warning */}
      {stats.attendancePercent < 75 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Target className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                Внимание: низкая посещаемость
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Для допуска к экзамену требуется минимум 75% посещаемости. 
                Текущая посещаемость: {stats.attendancePercent}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Последняя активность
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
          <p>Пока нет активности</p>
          <p className="text-sm">Начните изучать уроки, чтобы видеть свой прогресс</p>
        </div>
      </div>

      {/* Grading Scale Reference */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">
          Шкала оценок
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
          {[
            { grade: "10", range: "97-100" },
            { grade: "9", range: "90-96" },
            { grade: "8", range: "80-89" },
            { grade: "7", range: "70-79" },
            { grade: "6", range: "60-69" },
            { grade: "5", range: "<60" },
          ].map((item) => (
            <div
              key={item.grade}
              className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg"
            >
              <div className="font-bold text-gray-900 dark:text-white">
                {item.grade}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {item.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  warning = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  warning?: boolean;
}) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900",
    green: "bg-green-100 dark:bg-green-900",
    purple: "bg-purple-100 dark:bg-purple-900",
    orange: "bg-orange-100 dark:bg-orange-900",
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${warning ? "ring-2 ring-yellow-400" : ""}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 ${bgColors[color]} rounded-lg`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
