"use client";

import { useEffect, useState } from "react";

const VOICE_STORAGE_KEY = "russianput:voice_id";

const VOICES: Array<{ id: string; label: string }> = [
  { id: "gedzfqL7OGdPbwm0ynTP", label: "Voice 1" },
  { id: "UEKYgullGqaF0keqT8Bu", label: "Voice 2" },
];

export function VoiceSelector() {
  const [voiceId, setVoiceId] = useState<string>(VOICES[0].id);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VOICE_STORAGE_KEY);
      if (saved && VOICES.some((v) => v.id === saved)) {
        setVoiceId(saved);
      } else {
        localStorage.setItem(VOICE_STORAGE_KEY, VOICES[0].id);
      }
    } catch {
      // ignore
    }
  }, []);

  const onChange = (next: string) => {
    setVoiceId(next);
    try {
      localStorage.setItem(VOICE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <select
      value={voiceId}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      title="Voice"
    >
      {VOICES.map((v) => (
        <option key={v.id} value={v.id}>
          {v.label}
        </option>
      ))}
    </select>
  );
}
