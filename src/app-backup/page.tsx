import Link from "next/link";
import { BookOpen, Mic, Trophy, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">
                РусскийПуть
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition shadow-lg shadow-blue-600/25"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Курс русского языка для FDV
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Изучайте русский язык{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                с AI-репетитором
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              30 интерактивных уроков с голосовым AI-репетитором, 
              упражнениями и отслеживанием прогресса.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-xl shadow-blue-600/25 text-lg"
              >
                Начать обучение
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full transition shadow-lg border border-gray-200 dark:border-gray-700 text-lg hover:border-blue-300 dark:hover:border-blue-600"
              >
                У меня есть аккаунт
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Всё для успешного изучения
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Платформа создана специально для курса «World Language – Russian» в FDV
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="text-blue-600" size={28} />}
              title="30 уроков"
              description="Полный курс от алфавита до свободного общения с интерактивными упражнениями"
              color="blue"
            />
            <FeatureCard
              icon={<Mic className="text-green-600" size={28} />}
              title="AI-репетитор"
              description="Голосовой помощник для практики произношения с мгновенной обратной связью"
              color="green"
            />
            <FeatureCard
              icon={<Trophy className="text-purple-600" size={28} />}
              title="Отслеживание"
              description="Прогресс, посещаемость и оценки — всё в одном месте"
              color="purple"
            />
            <FeatureCard
              icon={<Users className="text-orange-600" size={28} />}
              title="Для FDV"
              description="Соответствует требованиям курса: 75% посещаемость, ДЗ, экзамены"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Структура курса
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Каждый урок включает фонетику, грамматику, разговорную тему и упражнения
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: 1, title: "Фонетика и азбука", topics: ["Кириллица", "Произношение", "Приветствие"] },
              { num: 2, title: "Знакомство", topics: ["Род существительных", "Как вас зовут?", "Личные местоимения"] },
              { num: 3, title: "Семья", topics: ["Притяжательные местоимения", "Члены семьи", "Числа 1-10"] },
              { num: 4, title: "Профессии", topics: ["Глаголы I спряжения", "Кто вы по профессии?", "Места работы"] },
              { num: 5, title: "Мой день", topics: ["Глаголы II спряжения", "Распорядок дня", "Время"] },
              { num: 6, title: "Еда и напитки", topics: ["Винительный падеж", "В ресторане", "Продукты"] },
            ].map((lesson) => (
              <div
                key={lesson.num}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                    {lesson.num}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {lesson.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {lesson.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle size={14} className="text-green-500" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              И ещё 24 урока с грамматикой, падежами, глаголами движения и многим другим
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Посмотреть все уроки
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Готовы начать изучение русского языка?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Зарегистрируйтесь бесплатно и получите доступ ко всем урокам
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full transition shadow-xl hover:shadow-2xl text-lg hover:bg-blue-50"
          >
            Создать аккаунт
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                РусскийПуть
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 Курс русского языка для FDV. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/30",
    green: "bg-green-100 dark:bg-green-900/30",
    purple: "bg-purple-100 dark:bg-purple-900/30",
    orange: "bg-orange-100 dark:bg-orange-900/30",
  };

  return (
    <div className="text-center p-6">
      <div className={`w-14 h-14 ${bgColors[color]} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
