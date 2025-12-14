"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, CheckCircle, XCircle } from "lucide-react";

interface VocabularyItem {
  ru: string;
  sl: string;
}

interface VocabularyFlashcardsProps {
  vocabulary: VocabularyItem[];
  onComplete?: (score: number) => void;
}

export function VocabularyFlashcards({
  vocabulary,
  onComplete,
}: VocabularyFlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = vocabulary[currentIndex];
  const totalCards = vocabulary.length;
  const reviewedCards = knownCards.size + unknownCards.size;

  const playAudio = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(currentCard.ru);
    utterance.lang = "ru-RU";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }, [currentCard.ru]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    const newKnown = new Set(knownCards);
    newKnown.add(currentIndex);
    unknownCards.delete(currentIndex);
    setKnownCards(newKnown);
    goToNext();
  };

  const handleUnknown = () => {
    const newUnknown = new Set(unknownCards);
    newUnknown.add(currentIndex);
    knownCards.delete(currentIndex);
    setUnknownCards(newUnknown);
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Check if all cards reviewed
      if (knownCards.size + unknownCards.size + 1 >= totalCards) {
        setIsComplete(true);
        const score = Math.round(((knownCards.size + 1) / totalCards) * 100);
        onComplete?.(score);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const goToPrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setIsComplete(false);
  };

  if (isComplete) {
    const score = Math.round((knownCards.size / totalCards) * 100);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Отлично! 🎉
        </h3>
        <div className="mb-6">
          <div
            className={`text-5xl font-bold mb-2 ${
              score >= 80
                ? "text-green-500"
                : score >= 60
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {score}%
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Вы знаете {knownCards.size} из {totalCards} слов
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span>{knownCards.size} знаю</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <XCircle size={20} />
            <span>{unknownCards.size} учить</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition mx-auto"
        >
          <RotateCcw size={18} />
          Начать заново
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} / {totalCards}
        </span>
        <div className="flex gap-2">
          <span className="text-sm text-green-600">{knownCards.size} ✓</span>
          <span className="text-sm text-red-600">{unknownCards.size} ✗</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="relative h-48 cursor-pointer perspective-1000"
      >
        <div
          className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center p-6 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-3xl font-bold text-white mb-2">{currentCard.ru}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              className="mt-2 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              <Volume2 className="text-white" size={24} />
            </button>
            <p className="text-sm text-blue-100 mt-4">Нажмите, чтобы перевернуть</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex flex-col items-center justify-center p-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-3xl font-bold text-white">{currentCard.sl}</p>
            <p className="text-sm text-green-100 mt-4">Нажмите, чтобы перевернуть</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleUnknown}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition"
          >
            <XCircle size={18} />
            Не знаю
          </button>
          <button
            onClick={handleKnown}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition"
          >
            <CheckCircle size={18} />
            Знаю
          </button>
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === totalCards - 1}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
