"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface FillBlankExerciseProps {
  instruction: string;
  items: string[];
  answers: string[];
  onComplete?: (score: number) => void;
}

export function FillBlankExercise({
  instruction,
  items,
  answers,
  onComplete,
}: FillBlankExerciseProps) {
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

  const handleSubmit = () => {
    const newResults = userAnswers.map((answer, i) => {
      const correct = answers[i]?.toLowerCase().trim();
      const user = answer.toLowerCase().trim();
      return correct === user;
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
        {items.map((item, index) => {
          const parts = item.split("___");
          return (
            <div key={index} className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-700 dark:text-gray-300">
                {index + 1}. {parts[0]}
              </span>
              <input
                type="text"
                value={userAnswers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={submitted}
                className={`px-3 py-1.5 border-2 rounded-lg w-32 text-center font-medium transition ${
                  submitted
                    ? results[index]
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                }`}
                placeholder="..."
              />
              {parts[1] && (
                <span className="text-gray-700 dark:text-gray-300">
                  {parts[1]}
                </span>
              )}
              {submitted && (
                <span className="ml-2">
                  {results[index] ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="text-red-500" size={20} />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        → {answers[index]}
                      </span>
                    </span>
                  )}
                </span>
              )}
            </div>
          );
        })}
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
