'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface ConversationLine {
  id: number;
  speaker: 'А' | 'Б';
  text: string;
  audioUrl: string;
}

const conversationData: ConversationLine[] = [
  { 
    id: 0, 
    speaker: 'А', 
    text: 'Добрый вечер, меня зовут Оля. А как тебя зовут?',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0JTQvtCx0YDRi9C5.mp3'
  },
  { 
    id: 1, 
    speaker: 'Б', 
    text: 'Меня зовут Марк.',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0JzQtdC90Y8g0LfQ.mp3'
  },
  { 
    id: 2, 
    speaker: 'А', 
    text: 'Очень приятно.',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0JQvtC60LAh.mp3'
  },
  { 
    id: 3, 
    speaker: 'А', 
    text: 'Ты студент какого факультета?',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0JrQsNC60LjQtSDR.mp3'
  },
  { 
    id: 4, 
    speaker: 'Б', 
    text: 'Я студент факультета общественных наук.',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0K8g0LbQuNCy0YMg.mp3'
  },
  { 
    id: 5, 
    speaker: 'А', 
    text: 'Что ты изучаешь?',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0KLRiyDRgdGC0YPQ.mp3'
  },
  { 
    id: 6, 
    speaker: 'Б', 
    text: 'Я изучаю международные отношения.',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0K8g0LfQvdCw0Y4g.mp3'
  },
  { 
    id: 7, 
    speaker: 'А', 
    text: 'Где ты живёшь?',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0KfRgtCINGC0Ysg0.mp3'
  },
  { 
    id: 8, 
    speaker: 'Б', 
    text: 'Я живу в Любляне, в Словении.',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0K8g0LjQt9GD0YfQ.mp3'
  },
  { 
    id: 9, 
    speaker: 'А', 
    text: 'Какие языки ты знаешь?',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0JPQtNC1INGC0Ysg.mp3'
  },
  { 
    id: 10, 
    speaker: 'Б', 
    text: 'Я знаю английский и немецкий язык.',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0K8g0YHRgtGD0LTQ.mp3'
  },
  { 
    id: 11, 
    speaker: 'А', 
    text: 'Пока!',
    audioUrl: '/audio-cache/А_EXAVITQu4vr4xnSDxMaL_0J7Rh9C10L3RjCDQ.mp3'
  },
  { 
    id: 12, 
    speaker: 'Б', 
    text: 'До свидания!',
    audioUrl: '/audio-cache/Б_onwK4e9ZLuTAKqWW03F9_0JTQviDRgdCy0LjQ.mp3'
  }
];

export default function ConversationPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playLine = async (lineId: number) => {
    if (playingId === lineId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    const line = conversationData.find((l) => l.id === lineId);
    if (!line) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(line.audioUrl);
    audioRef.current = audio;
    setPlayingId(lineId);

    audio.onended = () => {
      setPlayingId(null);
      if (isPlayingAll) {
        const nextIndex = currentPlayIndex + 1;
        if (nextIndex < conversationData.length) {
          setCurrentPlayIndex(nextIndex);
        } else {
          setIsPlayingAll(false);
          setCurrentPlayIndex(0);
        }
      }
    };

    audio.onerror = () => {
      console.error('Error playing audio:', line.audioUrl);
      setPlayingId(null);
    };

    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingId(null);
    }
  };

  const playAllConversation = async () => {
    if (isPlayingAll) {
      audioRef.current?.pause();
      setIsPlayingAll(false);
      setPlayingId(null);
      return;
    }

    setIsPlayingAll(true);
    setCurrentPlayIndex(0);
  };

  useEffect(() => {
    if (isPlayingAll && currentPlayIndex < conversationData.length) {
      playLine(conversationData[currentPlayIndex].id);
    }
  }, [isPlayingAll, currentPlayIndex]);

  const resetAll = () => {
    audioRef.current?.pause();
    setPlayingId(null);
    setIsPlayingAll(false);
    setCurrentPlayIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🇷🇺 Русский Диалог
          </h1>
          <p className="text-purple-200 text-lg">
            Russian Conversation Practice
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-purple-300">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              А — Оля (Sarah)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Б — Марк (Daniel)
            </span>
          </div>
        </motion.div>

        {/* Control Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={playAllConversation}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-green-500/25"
          >
            {isPlayingAll ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Conversation
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Play Full Conversation
              </>
            )}
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-full font-medium transition-all shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </motion.div>

        {/* Conversation Lines */}
        <div className="space-y-4">
          <AnimatePresence>
            {conversationData.map((line, index) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: line.speaker === 'А' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${
                  line.speaker === 'А' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-xl ${
                    line.speaker === 'А'
                      ? 'bg-gradient-to-r from-pink-600 to-pink-500 rounded-tl-none'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 rounded-tr-none'
                  } ${
                    playingId === line.id
                      ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-transparent'
                      : ''
                  }`}
                >
                  {/* Speaker Label */}
                  <div
                    className={`absolute -top-3 ${
                      line.speaker === 'А' ? 'left-4' : 'right-4'
                    } px-3 py-1 rounded-full text-xs font-bold ${
                      line.speaker === 'А'
                        ? 'bg-pink-700 text-pink-100'
                        : 'bg-blue-700 text-blue-100'
                    }`}
                  >
                    {line.speaker === 'А' ? 'Оля' : 'Марк'}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    {/* Play Button */}
                    <button
                      onClick={() => playLine(line.id)}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        line.speaker === 'А'
                          ? 'bg-pink-700 hover:bg-pink-800'
                          : 'bg-blue-700 hover:bg-blue-800'
                      }`}
                    >
                      {playingId === line.id ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>

                    {/* Text */}
                    <p className="text-white text-lg font-medium leading-relaxed">
                      {line.text}
                    </p>
                  </div>

                  {/* Audio Ready Indicator */}
                  <div
                    className={`absolute -bottom-2 ${
                      line.speaker === 'А' ? 'left-4' : 'right-4'
                    }`}
                  >
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white">
                      <Volume2 className="w-3 h-3" />
                      Ready
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center text-purple-300 text-sm"
        >
          <p>Professional Russian Language Learning</p>
          <p className="mt-1 text-purple-400">
            Click on any line to hear it spoken, or play the full conversation
          </p>
        </motion.div>
      </div>
    </div>
  );
}
