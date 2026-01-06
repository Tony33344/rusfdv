"use client";

import { useState } from "react";
import { VoiceTeacher } from "@/components/voice/VoiceTeacher";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const practiceCategories = [
  {
    id: "greetings",
    title: "Приветствия",
    phrases: [
      { ru: "Привет!", sl: "Zdravo!" },
      { ru: "Здравствуйте!", sl: "Pozdravljeni!" },
      { ru: "Доброе утро!", sl: "Dobro jutro!" },
      { ru: "Добрый день!", sl: "Dober dan!" },
      { ru: "Добрый вечер!", sl: "Dober večer!" },
      { ru: "До свидания!", sl: "Nasvidenje!" },
      { ru: "Пока!", sl: "Adijo!" },
    ],
  },
  {
    id: "introductions",
    title: "Знакомство",
    phrases: [
      { ru: "Как вас зовут?", sl: "Kako vam je ime?" },
      { ru: "Меня зовут Анна.", sl: "Ime mi je Ana." },
      { ru: "Очень приятно!", sl: "Zelo mi je drago!" },
      { ru: "Откуда вы?", sl: "Od kod ste?" },
      { ru: "Я из Словении.", sl: "Iz Slovenije sem." },
      { ru: "Вы говорите по-русски?", sl: "Ali govorite rusko?" },
    ],
  },
  {
    id: "numbers",
    title: "Числа",
    phrases: [
      { ru: "Один, два, три.", sl: "Ena, dva, tri." },
      { ru: "Четыре, пять, шесть.", sl: "Štiri, pet, šest." },
      { ru: "Семь, восемь, девять, десять.", sl: "Sedem, osem, devet, deset." },
      { ru: "Сколько это стоит?", sl: "Koliko to stane?" },
      { ru: "Это стоит сто рублей.", sl: "To stane sto rubljev." },
    ],
  },
  {
    id: "daily",
    title: "Повседневные фразы",
    phrases: [
      { ru: "Спасибо!", sl: "Hvala!" },
      { ru: "Пожалуйста.", sl: "Prosim." },
      { ru: "Извините.", sl: "Oprostite." },
      { ru: "Да, конечно.", sl: "Da, seveda." },
      { ru: "Нет, спасибо.", sl: "Ne, hvala." },
      { ru: "Я не понимаю.", sl: "Ne razumem." },
      { ru: "Повторите, пожалуйста.", sl: "Ponovite, prosim." },
    ],
  },
  {
    id: "questions",
    title: "Вопросы",
    phrases: [
      { ru: "Что это?", sl: "Kaj je to?" },
      { ru: "Где находится банк?", sl: "Kje je banka?" },
      { ru: "Когда открывается магазин?", sl: "Kdaj se odpre trgovina?" },
      { ru: "Как пройти к метро?", sl: "Kako pridem do metroja?" },
      { ru: "Сколько времени?", sl: "Koliko je ura?" },
    ],
  },
  {
    id: "restaurant",
    title: "В ресторане",
    phrases: [
      { ru: "Меню, пожалуйста.", sl: "Jedilnik, prosim." },
      { ru: "Что вы рекомендуете?", sl: "Kaj priporočate?" },
      { ru: "Я буду суп.", sl: "Jaz bom juho." },
      { ru: "Счёт, пожалуйста.", sl: "Račun, prosim." },
      { ru: "Это очень вкусно!", sl: "To je zelo okusno!" },
    ],
  },
];

export default function VoiceTeacherPage() {
  const [selectedCategory, setSelectedCategory] = useState(practiceCategories[0]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState<Set<string>>(new Set());

  const currentPhrase = selectedCategory.phrases[currentPhraseIndex];
  const phraseKey = `${selectedCategory.id}-${currentPhraseIndex}`;

  const handleComplete = (score: number) => {
    if (score >= 70) {
      setCompletedPhrases((prev) => new Set([...prev, phraseKey]));
    }
  };

  const goToNext = () => {
    if (currentPhraseIndex < selectedCategory.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    }
  };

  const selectCategory = (category: typeof practiceCategories[0]) => {
    setSelectedCategory(category);
    setCurrentPhraseIndex(0);
  };

  const categoryProgress = selectedCategory.phrases.filter((_, i) =>
    completedPhrases.has(`${selectedCategory.id}-${i}`)
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Голосовой репетитор 🎙️
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Слушайте, повторяйте и получайте мгновенную обратную связь
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {practiceCategories.map((category) => {
          const progress = category.phrases.filter((_, i) =>
            completedPhrases.has(`${category.id}-${i}`)
          ).length;
          const isSelected = category.id === selectedCategory.id;

          return (
            <button
              key={category.id}
              onClick={() => selectCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category.title}
              {progress > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  {progress}/{category.phrases.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Прогресс: {categoryProgress} / {selectedCategory.phrases.length} фраз
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((categoryProgress / selectedCategory.phrases.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${(categoryProgress / selectedCategory.phrases.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Phrase Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrev}
          disabled={currentPhraseIndex === 0}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          Назад
        </button>

        <div className="flex items-center gap-2">
          {selectedCategory.phrases.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPhraseIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === currentPhraseIndex
                  ? "bg-blue-600"
                  : completedPhrases.has(`${selectedCategory.id}-${i}`)
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPhraseIndex === selectedCategory.phrases.length - 1}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Далее
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Voice Teacher Component */}
      <VoiceTeacher phrase={currentPhrase} onComplete={handleComplete} />

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Советы для практики
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Сначала послушайте правильное произношение несколько раз</li>
              <li>• Говорите чётко и не торопитесь</li>
              <li>• Обращайте внимание на ударение в словах</li>
              <li>• Повторяйте фразу до тех пор, пока не получите 80%+</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
