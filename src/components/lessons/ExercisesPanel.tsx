"use client";

import { useEffect, useMemo, useState } from "react";

export type LessonExercise = {
  type: string;
  instruction: string;
  items: string[];
  categories?: string[];
  answers?: string[];
};

function keyFor(lessonId: number, exerciseIndex: number) {
  return `russianput:lesson:${lessonId}:exercise:${exerciseIndex}`;
}

export function ExercisesPanel({
  lessonId,
  exercises,
}: {
  lessonId: number;
  exercises: LessonExercise[];
}) {
  const [values, setValues] = useState<string[][]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const initialValues = useMemo(() => {
    if (typeof window === "undefined") return [] as string[][];

    return exercises.map((ex, idx) => {
      try {
        const raw = localStorage.getItem(keyFor(lessonId, idx));
        const parsed = raw ? (JSON.parse(raw) as unknown) : null;
        const arr = Array.isArray(parsed) ? (parsed as string[]) : [];
        const out = new Array(ex.items.length).fill("");
        for (let i = 0; i < out.length; i++) out[i] = arr[i] ?? "";
        return out;
      } catch {
        return new Array(ex.items.length).fill("");
      }
    });
  }, [exercises, lessonId]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setValue = (exerciseIndex: number, itemIndex: number, next: string) => {
    setValues((prev) => {
      const copy = prev.map((v) => v.slice());
      if (!copy[exerciseIndex]) copy[exerciseIndex] = [];
      copy[exerciseIndex][itemIndex] = next;
      try {
        localStorage.setItem(keyFor(lessonId, exerciseIndex), JSON.stringify(copy[exerciseIndex]));
      } catch {
        // ignore
      }
      return copy;
    });
  };

  if (!exercises?.length) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Упражнения / Exercises
        </h2>
        <button
          type="button"
          onClick={() => setShowAnswers((v) => !v)}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {showAnswers ? "Скрыть ответы" : "Показать ответы"}
        </button>
      </div>

      <div className="space-y-6">
        {exercises.map((ex, exIdx) => {
          const v = values[exIdx] ?? new Array(ex.items.length).fill("");

          return (
            <div
              key={exIdx}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <p className="font-medium text-gray-900 dark:text-white">{ex.instruction}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Тип: {ex.type}</p>

              <div className="mt-4 space-y-3">
                {ex.items.map((item, itemIdx) => {
                  const answer = ex.answers?.[itemIdx];
                  const value = v[itemIdx] ?? "";

                  const isCorrect =
                    showAnswers && answer
                      ? value.trim().toLowerCase() === String(answer).trim().toLowerCase()
                      : null;

                  const inputEl = ex.categories?.length ? (
                    <select
                      value={value}
                      onChange={(e) => setValue(exIdx, itemIdx, e.target.value)}
                      className="w-full md:w-[280px] px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <option value="">—</option>
                      {ex.categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={value}
                      onChange={(e) => setValue(exIdx, itemIdx, e.target.value)}
                      placeholder="Введите ответ"
                      className="w-full md:w-[280px] px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    />
                  );

                  return (
                    <div
                      key={itemIdx}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="text-gray-900 dark:text-white">{item}</div>
                      <div className="flex items-center gap-3">
                        {inputEl}
                        {showAnswers && answer ? (
                          <div
                            className={`text-xs px-2 py-1 rounded-full ${
                              isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isCorrect ? "OK" : `Ответ: ${answer}`}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
