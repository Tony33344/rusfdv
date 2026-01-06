'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Loader2, RotateCcw, HardDrive, Trash2 } from 'lucide-react';

interface ConversationLine {
  id: number;
  speaker: 'А' | 'Б';
  text: string;
  audioUrl?: string;
  isLoading?: boolean;
}

interface VoiceOption {
  id: string;
  name: string;
}

const VOICE_OPTIONS: Record<'А' | 'Б', VoiceOption[]> = {
  'А': [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { id: 'pMsXgV9v3BLzUgSXRplE', name: 'Bella' }
  ],
  'Б': [
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Sam' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Harry' }
  ]
};

const conversationData: Omit<ConversationLine, 'id' | 'audioUrl' | 'isLoading'>[] = [
  { speaker: 'А', text: 'Добрый вечер, меня зовут Оля. А как тебя зовут?' },
  { speaker: 'Б', text: 'Меня зовут Марк.' },
  { speaker: 'А', text: 'Очень приятно.' },
  { speaker: 'А', text: 'Ты студент какого факультета?' },
  { speaker: 'Б', text: 'Я студент факультета общественных наук.' },
  { speaker: 'А', text: 'Что ты изучаешь?' },
  { speaker: 'Б', text: 'Я изучаю международные отношения.' },
  { speaker: 'А', text: 'Где ты живёшь?' },
  { speaker: 'Б', text: 'Я живу в Любляне, в Словении.' },
  { speaker: 'А', text: 'Какие языки ты знаешь?' },
  { speaker: 'Б', text: 'Я знаю английский и немецкий язык.' },
  { speaker: 'А', text: 'Пока!' },
  { speaker: 'Б', text: 'До свидания!' },
];

interface CacheInfo {
  totalFiles: number;
  totalSize: number;
  files: Array<{
    filename: string;
    size: number;
    created: string;
    url: string;
  }>;
}

export default function ShowcasePage() {
  const [lines, setLines] = useState<ConversationLine[]>(
    conversationData.map((line, index) => ({ ...line, id: index }))
  );
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [selectedVoiceA, setSelectedVoiceA] = useState(VOICE_OPTIONS['А'][0].id);
  const [selectedVoiceB, setSelectedVoiceB] = useState(VOICE_OPTIONS['Б'][0].id);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [showCacheStatus, setShowCacheStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateAudio = async (lineId: number): Promise<string | null> => {
    const line = lines.find((l) => l.id === lineId);
    if (!line) return null;

    if (line.audioUrl) return line.audioUrl;

    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, isLoading: true } : l))
    );

    try {
      const response = await fetch(`/api/tts?voiceId=${line.speaker === 'А' ? selectedVoiceA : selectedVoiceB}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: line.text, speaker: line.speaker }),
      });

      if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error generating audio:', errorData);
      throw new Error(errorData.error || 'Failed to generate audio');
    }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      setLines((prev) =>
        prev.map((l) =>
          l.id === lineId ? { ...l, audioUrl, isLoading: false } : l
        )
      );

      // Reload cache info after generating new audio
      loadCacheInfo();

      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      setLines((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, isLoading: false } : l))
      );
      return null;
    }
  };

  const playLine = async (lineId: number) => {
    if (playingId === lineId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    const audioUrl = await generateAudio(lineId);
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingId(lineId);

    audio.onended = () => {
      setPlayingId(null);
      if (isPlayingAll) {
        const nextIndex = currentPlayIndex + 1;
        if (nextIndex < lines.length) {
          setCurrentPlayIndex(nextIndex);
        } else {
          setIsPlayingAll(false);
          setCurrentPlayIndex(0);
        }
      }
    };

    audio.play();
  };

  const generateAllAudio = async () => {
    setIsGeneratingAll(true);
    for (const line of lines) {
      if (!line.audioUrl) {
        await generateAudio(line.id);
      }
    }
    setIsGeneratingAll(false);
    // Reload cache info after generating all audio
    loadCacheInfo();
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
    if (isPlayingAll && currentPlayIndex < lines.length) {
      playLine(lines[currentPlayIndex].id);
    }
  }, [isPlayingAll, currentPlayIndex]);

  const resetAll = () => {
    audioRef.current?.pause();
    setPlayingId(null);
    setIsPlayingAll(false);
    setCurrentPlayIndex(0);
    lines.forEach((line) => {
      if (line.audioUrl) {
        URL.revokeObjectURL(line.audioUrl);
      }
    });
    setLines(conversationData.map((line, index) => ({ ...line, id: index })));
  };

  // Reset audio when voices change
  const handleVoiceChange = () => {
    resetAll();
  };

  // Cache management functions
  const loadCacheInfo = async () => {
    try {
      const response = await fetch('/api/cache');
      if (response.ok) {
        const info = await response.json();
        setCacheInfo(info);
      }
    } catch (error) {
      console.error('Failed to load cache info:', error);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch('/api/cache', { method: 'DELETE' });
      if (response.ok) {
        resetAll();
        setCacheInfo(null);
        setShowCacheStatus(false);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load cache info on mount and after generation
  useEffect(() => {
    loadCacheInfo();
  }, []);

  const allGenerated = lines.every((line) => line.audioUrl);

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
            Interactive Russian Conversation Showcase
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-purple-300">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              А — Оля (Female)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Б — Марк (Male)
            </span>
          </div>
        </motion.div>

        {/* Voice Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <h3 className="text-white text-lg font-semibold mb-4">Voice Selection</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Speaker A Voice Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                <span className="text-pink-200 font-medium">Оля (Speaker А)</span>
              </div>
              <div className="space-y-2">
                {VOICE_OPTIONS['А'].map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => {
                      setSelectedVoiceA(voice.id);
                      handleVoiceChange();
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedVoiceA === voice.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/10 text-pink-200 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-medium">{voice.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Speaker B Voice Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-blue-200 font-medium">Марк (Speaker Б)</span>
              </div>
              <div className="space-y-2">
                {VOICE_OPTIONS['Б'].map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => {
                      setSelectedVoiceB(voice.id);
                      handleVoiceChange();
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedVoiceB === voice.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-blue-200 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-medium">{voice.name}</div>
                  </button>
                ))}
              </div>
            </div>
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
            onClick={generateAllAudio}
            disabled={isGeneratingAll || allGenerated}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-purple-500/25"
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Audio...
              </>
            ) : allGenerated ? (
              <>
                <Volume2 className="w-5 h-5" />
                All Audio Ready
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Generate All Audio
              </>
            )}
          </button>

          <button
            onClick={playAllConversation}
            disabled={!allGenerated && !isPlayingAll}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-green-500/25"
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

          <button
            onClick={() => {
              setShowCacheStatus(!showCacheStatus);
              if (!showCacheStatus) loadCacheInfo();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-lg"
          >
            <HardDrive className="w-5 h-5" />
            Cache {cacheInfo ? `(${cacheInfo.totalFiles})` : ''}
          </button>
        </motion.div>

        {/* Cache Status Panel */}
        <AnimatePresence>
          {showCacheStatus && cacheInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Audio Cache</h3>
                <button
                  onClick={clearCache}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{cacheInfo.totalFiles}</div>
                  <div className="text-sm text-purple-300">Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatFileSize(cacheInfo.totalSize)}</div>
                  <div className="text-sm text-purple-300">Total Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{lines.length}</div>
                  <div className="text-sm text-purple-300">Total Lines</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.round((cacheInfo.totalFiles / (lines.length * 6)) * 100)}%
                  </div>
                  <div className="text-sm text-purple-300">Cached</div>
                </div>
              </div>

              <div className="text-xs text-purple-400">
                Audio files are cached locally to avoid repeated API calls and improve performance.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Lines */}
        <div className="space-y-4">
          <AnimatePresence>
            {lines.map((line, index) => (
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
                      disabled={line.isLoading}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        line.speaker === 'А'
                          ? 'bg-pink-700 hover:bg-pink-800'
                          : 'bg-blue-700 hover:bg-blue-800'
                      } ${line.isLoading ? 'opacity-50' : ''}`}
                    >
                      {line.isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : playingId === line.id ? (
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
                  {line.audioUrl && (
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
                  )}
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
          <p>Professional Voice Synthesis</p>
          <p className="mt-1 text-purple-400">
            Click on any line to hear it spoken, or generate all audio and play
            the full conversation
          </p>
        </motion.div>
      </div>
    </div>
  );
}
