"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CompleteLessonButton({ lessonId }: { lessonId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function markComplete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/progress/lessons/${lessonId}/complete`, {
        method: "POST",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      setDone(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={markComplete}
      disabled={loading || done}
      className={`px-6 py-3 text-white font-medium rounded-lg transition ${
        done
          ? "bg-green-700"
          : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
      }`}
    >
      {done ? "Урок завершён ✓" : loading ? "Сохранение..." : "Урок завершён ✓"}
    </button>
  );
}
