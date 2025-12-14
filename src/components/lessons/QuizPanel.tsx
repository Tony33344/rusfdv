"use client";

import { useEffect, useMemo, useState } from "react";

type TriText = { ru: string; sl: string; en: string };

type QuizQuestion = {
  type: "multiple_choice" | "fill_blank";
  prompt: TriText;
  options?: TriText[];
  answerIndex?: number;
  answerText?: TriText;
  explanation?: TriText;
};

function keyFor(lessonId: number) {
  return `russianput:lesson:${lessonId}:quiz`;
}

type Stored = {
  // per question index
  values: Array<{ kind: "mcq"; value: number | null } | { kind: "text"; value: string }>;
};

export function QuizPanel({
  lessonId,
  questions,
}: {
  lessonId: number;
  questions: QuizQuestion[];
}) {
  const [values, setValues] = useState<Stored["values"]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const initial = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(keyFor(lessonId));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Stored;
      if (!parsed?.values || !Array.isArray(parsed.values)) return null;
      return parsed.values;
    } catch {
      return null;
    }
  }, [lessonId]);

  useEffect(() => {
    const base: Stored["values"] = questions.map((q) =>
      q.type === "multiple_choice"
        ? { kind: "mcq", value: null }
        : { kind: "text", value: "" }
    );

    if (initial) {
      // merge
      for (let i = 0; i < base.length; i++) {
        const saved = initial[i];
        if (!saved) continue;
        if (saved.kind === base[i].kind) {
          base[i] = saved as any;
        }
      }
    }

    setValues(base);
  }, [initial, questions]);

  const persist = (next: Stored["values"]) => {
    setValues(next);
    try {
      localStorage.setItem(keyFor(lessonId), JSON.stringify({ values: next } satisfies Stored));
    } catch {
      // ignore
    }
  };

  const setMcq = (qIdx: number, optionIdx: number) => {
    persist(
      values.map((v, i) => {
        if (i !== qIdx) return v;
        return { kind: "mcq", value: optionIdx };
      })
    );
  };

  const setText = (qIdx: number, nextText: string) => {
    persist(
      values.map((v, i) => {
        if (i !== qIdx) return v;
        return { kind: "text", value: nextText };
      })
    );
  };

  if (!questions?.length) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Мини-тест / Mini-quiz</h2>
        <button
          type="button"
          onClick={() => setShowAnswers((v) => !v)}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {showAnswers ? "Скрыть ответы" : "Показать ответы"}
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const stored = values[qIdx];

          const correctness = (() => {
            if (!showAnswers) return null;
            if (q.type === "multiple_choice") {
              if (typeof q.answerIndex !== "number") return null;
              if (!stored || stored.kind !== "mcq" || stored.value === null) return false;
              return stored.value === q.answerIndex;
            }

            if (q.type === "fill_blank") {
              const expected = q.answerText?.ru;
              if (!expected) return null;
              if (!stored || stored.kind !== "text") return false;
              const got = stored.value.trim().toLowerCase();
              const exp = expected.trim().toLowerCase();
              return got === exp;
            }

            return null;
          })();

          return (
            <div key={qIdx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="font-medium text-gray-900 dark:text-white">
                {qIdx + 1}. {q.prompt.ru}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{q.prompt.sl}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{q.prompt.en}</p>

              {q.type === "multiple_choice" && q.options?.length ? (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const selected = stored?.kind === "mcq" ? stored.value === optIdx : false;
                    const isCorrectOption = showAnswers && typeof q.answerIndex === "number" && optIdx === q.answerIndex;

                    return (
                      <label
                        key={optIdx}
                        className={`flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border transition cursor-pointer ${
                          selected
                            ? "border-blue-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        } ${isCorrectOption ? "ring-1 ring-green-400" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${lessonId}-${qIdx}`}
                          checked={selected}
                          onChange={() => setMcq(qIdx, optIdx)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">{opt.ru}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{opt.sl}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{opt.en}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {q.type === "fill_blank" ? (
                <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    value={stored?.kind === "text" ? stored.value : ""}
                    onChange={(e) => setText(qIdx, e.target.value)}
                    placeholder="Введите ответ"
                    className="w-full md:w-[320px] px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  />

                  {showAnswers && q.answerText?.ru ? (
                    <div
                      className={`text-xs px-3 py-2 rounded-lg ${
                        correctness ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {correctness ? "OK" : `Ответ: ${q.answerText.ru}`}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {showAnswers && correctness !== null ? (
                <p
                  className={`mt-3 text-sm ${
                    correctness ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {correctness ? "Верно" : "Неверно"}
                </p>
              ) : null}

              {q.explanation ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {q.explanation.ru} • {q.explanation.sl} • {q.explanation.en}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
