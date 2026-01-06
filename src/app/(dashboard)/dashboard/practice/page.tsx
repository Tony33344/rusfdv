import { Mic, Volume2, BookA, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Практика 🎙️
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Тренируйте произношение и разговорные навыки с AI-репетитором
        </p>
      </div>

      {/* Practice Modes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Alphabet Practice */}
        <Link
          href="/dashboard/practice/alphabet"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl group-hover:scale-110 transition">
              <BookA className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Азбука
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Кириллический алфавит
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Изучайте русские буквы, их произношение и написание. Интерактивные карточки с аудио.
          </p>
        </Link>

        {/* Pronunciation Practice */}
        <Link
          href="/dashboard/practice/pronunciation"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl group-hover:scale-110 transition">
              <Mic className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Произношение
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-оценка речи
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Записывайте свою речь и получайте мгновенную обратную связь от AI-репетитора.
          </p>
        </Link>

        {/* Listening Practice */}
        <Link
          href="/dashboard/practice/listening"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-xl group-hover:scale-110 transition">
              <Volume2 className="text-purple-600 dark:text-purple-400" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Аудирование
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Понимание на слух
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Слушайте диалоги и тексты на русском языке, отвечайте на вопросы.
          </p>
        </Link>

        {/* Conversation Practice */}
        <Link
          href="/dashboard/practice/conversation"
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-xl group-hover:scale-110 transition">
              <MessageSquare className="text-orange-600 dark:text-orange-400" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Разговор
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-собеседник
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Практикуйте разговорную речь с AI-собеседником на различные темы.
          </p>
        </Link>
      </div>

      {/* Voice Tutor Preview */}
      <Link
        href="/dashboard/practice/voice-teacher"
        className="block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white hover:from-indigo-700 hover:to-purple-700 transition"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Mic size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Голосовой репетитор</h2>
            <p className="text-indigo-200">Powered by ElevenLabs + OpenAI Whisper + GPT-4</p>
          </div>
        </div>
        <p className="text-indigo-100 mb-4">
          Наш AI-репетитор слушает ваше произношение, анализирует ошибки и даёт персональные рекомендации на русском, словенском или английском языке.
        </p>
        <span className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition">
          Начать практику →
        </span>
      </Link>
    </div>
  );
}
