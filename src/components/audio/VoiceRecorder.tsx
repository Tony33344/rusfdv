"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Play, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  onTranscript?: (text: string) => void;
  targetPhrase?: string;
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  onTranscript,
  targetPhrase,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }

        // Send to transcription API (stub for now)
        if (onTranscript) {
          setIsProcessing(true);
          try {
            // TODO: Integrate with OpenAI Whisper API
            // const formData = new FormData();
            // formData.append("audio", blob);
            // const res = await fetch("/api/transcribe", { method: "POST", body: formData });
            // const data = await res.json();
            // setTranscript(data.text);
            // onTranscript(data.text);
            
            // Placeholder
            setTimeout(() => {
              setTranscript("(Транскрипция будет здесь)");
              setIsProcessing(false);
            }, 1000);
          } catch (err) {
            setError("Ошибка транскрипции");
            setIsProcessing(false);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Не удалось получить доступ к микрофону");
      console.error("Microphone error:", err);
    }
  }, [onRecordingComplete, onTranscript]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setTranscript(null);
    setError(null);
  }, [audioUrl]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Target Phrase */}
      {targetPhrase && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
            Скажите по-русски:
          </p>
          <p className="text-xl font-medium text-gray-900 dark:text-white">
            {targetPhrase}
          </p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-4">
        {!audioUrl ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "p-6 rounded-full transition-all duration-200",
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isRecording ? (
              <Square className="text-white" size={32} />
            ) : (
              <Mic className="text-white" size={32} />
            )}
          </button>
        ) : (
          <>
            <button
              onClick={playRecording}
              className="p-4 bg-green-600 hover:bg-green-700 rounded-full transition"
            >
              <Play className="text-white" size={24} />
            </button>
            <button
              onClick={resetRecording}
              className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition"
            >
              <RotateCcw className="text-gray-700 dark:text-gray-300" size={24} />
            </button>
          </>
        )}
      </div>

      {/* Status Text */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {isRecording
          ? "🎙️ Говорите..."
          : audioUrl
          ? "Запись готова"
          : "Нажмите для записи"}
      </p>

      {/* Hidden Audio Element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Loader2 className="animate-spin" size={20} />
          <span>Обработка...</span>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Распознанный текст:
          </p>
          <p className="text-gray-900 dark:text-white">{transcript}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
