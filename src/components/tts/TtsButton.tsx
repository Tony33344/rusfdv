"use client";

import { useCallback, useRef, useState } from "react";
import { Volume2, Loader2 } from "lucide-react";

type Props = {
  text: string;
  lang?: string;
  className?: string;
  size?: number;
};

const VOICE_STORAGE_KEY = "russianput:voice_id";

export function TtsButton({ text, lang = "ru-RU", className = "", size = 20 }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const browserTts = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);

    // Try to force a Russian voice. Without this, some systems default to an English voice.
    const pickVoice = () => {
      const voices = speechSynthesis.getVoices();
      const normalized = lang.toLowerCase();
      const ru = voices.find((v) => v.lang?.toLowerCase() === normalized)
        ?? voices.find((v) => v.lang?.toLowerCase().startsWith("ru"));
      if (ru) utterance.voice = ru;
    };

    pickVoice();
    // Some browsers populate voices async
    if (!utterance.voice) {
      speechSynthesis.onvoiceschanged = () => {
        pickVoice();
      };
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [lang, text]);

  const play = useCallback(async () => {
    if (!text?.trim()) return;
    setIsPlaying(true);

    try {
      let voiceId: string | null = null;
      try {
        voiceId = localStorage.getItem(VOICE_STORAGE_KEY);
      } catch {
        voiceId = null;
      }

      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: voiceId || undefined }),
      });

      if (!res.ok) {
        // API returns JSON with demo=true when key missing
        try {
          const data = await res.json();
          if (data?.demo) {
            browserTts();
            return;
          }
        } catch {
          // fall through
        }
        browserTts();
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = url;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      await audioRef.current.play();
    } catch {
      browserTts();
    }
  }, [browserTts, text]);

  return (
    <button
      type="button"
      onClick={play}
      disabled={isPlaying}
      className={`inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 ${className}`}
      title="Play"
    >
      {isPlaying ? <Loader2 className="animate-spin" size={size} /> : <Volume2 size={size} />}
    </button>
  );
}
