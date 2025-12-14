import { VoiceRecorder } from "@/components/audio/VoiceRecorder";
import { ArrowLeft, Volume2 } from "lucide-react";
import Link from "next/link";

const practiceWords = [
  { ru: "Привет", sl: "Zdravo", en: "Hello" },
  { ru: "Спасибо", sl: "Hvala", en: "Thank you" },
  { ru: "Пожалуйста", sl: "Prosim", en: "Please" },
  { ru: "Хорошо", sl: "Dobro", en: "Good" },
  { ru: "Да", sl: "Da", en: "Yes" },
  { ru: "Нет", sl: "Ne", en: "No" },
  { ru: "Здравствуйте", sl: "Pozdravljeni", en: "Hello (formal)" },
  { ru: "До свидания", sl: "Nasvidenje", en: "Goodbye" },
];

export default function PronunciationPracticePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/practice"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Практика произношения 🎙️
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Записывайте свою речь и сравнивайте с образцом
          </p>
        </div>
      </div>

      {/* Voice Recorder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Запишите своё произношение
        </h2>
        <VoiceRecorder
          targetPhrase="Привет! Как дела?"
          onRecordingComplete={(blob) => {
            console.log("Recording complete:", blob);
          }}
          onTranscript={(text) => {
            console.log("Transcript:", text);
          }}
        />
      </div>

      {/* Practice Words */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Слова для практики
        </h2>
        <div className="grid gap-3">
          {practiceWords.map((word, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {word.ru}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {word.sl} • {word.en}
                </p>
              </div>
              <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition">
                <Volume2 size={20} className="text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          💡 Советы для произношения
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Говорите чётко и не торопитесь</li>
          <li>• Обращайте внимание на ударение в словах</li>
          <li>• Слушайте образец перед записью</li>
          <li>• Практикуйтесь регулярно для лучших результатов</li>
        </ul>
      </div>
    </div>
  );
}
