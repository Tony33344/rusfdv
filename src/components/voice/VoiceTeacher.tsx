"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface VoiceTeacherProps {
  phrase: {
    ru: string;
    sl: string;
    audio?: string | null;
  };
  onComplete?: (score: number) => void;
}

interface Feedback {
  score: number;
  feedback: string;
  corrections: Array<{ expected: string; heard: string; tip: string }>;
  demo?: boolean;
}

export function VoiceTeacher({ phrase, onComplete }: VoiceTeacherProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play the phrase using ElevenLabs TTS
  const playPhrase = useCallback(async () => {
    setIsPlaying(true);
    setError(null);

    try {
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase.ru }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.demo) {
          // Demo mode - use browser TTS as fallback
          const utterance = new SpeechSynthesisUtterance(phrase.ru);
          utterance.lang = "ru-RU";
          utterance.rate = 0.8;
          utterance.onend = () => setIsPlaying(false);
          speechSynthesis.speak(utterance);
          return;
        }
        throw new Error(data.error || "Failed to generate speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (err) {
      console.error("Play error:", err);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(phrase.ru);
      utterance.lang = "ru-RU";
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  }, [phrase.ru]);

  // Start recording
  const startRecording = useCallback(async () => {
    setError(null);
    setTranscription(null);
    setFeedback(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await processRecording();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Process the recording
  const processRecording = async () => {
    setIsProcessing(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      // Step 1: Transcribe the audio
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const sttResponse = await fetch("/api/voice/stt", {
        method: "POST",
        body: formData,
      });

      const sttData = await sttResponse.json();
      
      if (sttData.demo || !sttResponse.ok) {
        // Demo mode - simulate transcription
        setTranscription(phrase.ru); // Assume perfect for demo
        setFeedback({
          score: 85,
          feedback: "Great pronunciation! (Demo mode - add API keys for real feedback)",
          corrections: [],
          demo: true,
        });
        onComplete?.(85);
        return;
      }

      setTranscription(sttData.transcription);

      // Step 2: Get pronunciation feedback
      const feedbackResponse = await fetch("/api/voice/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expected: phrase.ru,
          transcribed: sttData.transcription,
        }),
      });

      const feedbackData = await feedbackResponse.json();
      setFeedback(feedbackData);
      onComplete?.(feedbackData.score);
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process recording. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset state
  const reset = () => {
    setTranscription(null);
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <audio ref={audioRef} className="hidden" />
      
      {/* Phrase Display */}
      <div className="text-center mb-6">
        <p className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
          {phrase.ru}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {phrase.sl}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        {/* Listen Button */}
        <button
          onClick={playPhrase}
          disabled={isPlaying || isRecording || isProcessing}
          className="flex items-center gap-2 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Volume2 size={20} />
          )}
          Послушать
        </button>

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPlaying || isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff size={20} />
              Остановить
            </>
          ) : (
            <>
              <Mic size={20} />
              Записать
            </>
          )}
        </button>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
          <Loader2 className="animate-spin" size={20} />
          <span>Анализирую произношение...</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {/* Results */}
      {feedback && (
        <div className="space-y-4">
          {/* Score */}
          <div className="flex items-center justify-center gap-4">
            <div
              className={`text-4xl font-bold ${
                feedback.score >= 80
                  ? "text-green-500"
                  : feedback.score >= 60
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {feedback.score}%
            </div>
            {feedback.score >= 80 ? (
              <CheckCircle className="text-green-500" size={32} />
            ) : (
              <XCircle className="text-red-500" size={32} />
            )}
          </div>

          {/* Transcription */}
          {transcription && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Вы сказали:
              </p>
              <p className="text-gray-900 dark:text-white">{transcription}</p>
            </div>
          )}

          {/* Feedback */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <p className="text-blue-700 dark:text-blue-300">{feedback.feedback}</p>
          </div>

          {/* Corrections */}
          {feedback.corrections && feedback.corrections.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">
                Исправления:
              </p>
              {feedback.corrections.map((correction, i) => (
                <div
                  key={i}
                  className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg"
                >
                  <p className="text-sm">
                    <span className="text-red-500 line-through">
                      {correction.heard}
                    </span>{" "}
                    →{" "}
                    <span className="text-green-600 font-medium">
                      {correction.expected}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    💡 {correction.tip}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Demo Mode Notice */}
          {feedback.demo && (
            <p className="text-xs text-center text-gray-400">
              Demo mode: Add ELEVENLABS_API_KEY and OPENAI_API_KEY for full functionality
            </p>
          )}

          {/* Try Again Button */}
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <RefreshCw size={18} />
            Попробовать ещё раз
          </button>
        </div>
      )}
    </div>
  );
}
