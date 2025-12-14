"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";

interface TranslationExerciseProps {
  instruction: string;
  items: Array<{ source: string; target: string }>;
  direction: "ru-sl" | "sl-ru";
  onComplete?: (score: number) => void;
}

export function TranslationExercise({
  instruction,
  items,
  direction,
  onComplete,
}: TranslationExerciseProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(items.length).fill("")
  );
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const normalizeAnswer = (answer: string): string => {
    return answer
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ");
  };

  const handleSubmit = () => {
    const newResults = userAnswers.map((answer, i) => {
      const correct = normalizeAnswer(items[i].target);
      const user = normalizeAnswer(answer);
      // Allow for some flexibility - check if main words match
      const correctWords = correct.split(" ");
      const userWords = user.split(" ");
      const matchingWords = correctWords.filter((w) => userWords.includes(w));
      return matchingWords.length >= correctWords.length * 0.7 || correct === user;
    });
    setResults(newResults);
    setSubmitted(true);

    const score = Math.round(
      (newResults.filter(Boolean).length / newResults.length) * 100
    );
    onComplete?.(score);
  };

  const handleReset = () => {
    setUserAnswers(new Array(items.length).fill(""));
    setSubmitted(false);
    setResults([]);
  };

  const score = results.length
    ? Math.round((results.filter(Boolean).length / results.length) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {instruction}
      </h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {index + 1}.
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {item.source}
              </span>
              <ArrowRight className="text-gray-400" size={16} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userAnswers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={submitted}
                className={`flex-1 px-4 py-2 border-2 rounded-lg font-medium transition ${
                  submitted
                    ? results[index]
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder={direction === "ru-sl" ? "Slovensko..." : "По-русски..."}
              />
              {submitted && (
                <span>
                  {results[index] ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </span>
              )}
            </div>
            {submitted && !results[index] && (
              <p className="text-sm text-green-600 dark:text-green-400 ml-6">
                Правильный ответ: {item.target}
              </p>
            )}
          </div>
        ))}
      </div>

      {submitted && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Результат:</span>
            <span
              className={`text-2xl font-bold ${
                score >= 80
                  ? "text-green-500"
                  : score >= 60
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {score}%
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={userAnswers.some((a) => !a.trim())}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <RefreshCw size={18} />
            Попробовать ещё раз
          </button>
        )}
      </div>
    </div>
  );
}
