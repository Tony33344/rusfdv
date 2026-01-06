'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const voiceCombinations = [
  {
    path: '/conversation-sarah-daniel',
    femaleVoice: 'Sarah',
    maleVoice: 'Daniel',
    description: 'Warm female voice with clear male voice',
    femaleColor: 'bg-pink-500',
    maleColor: 'bg-blue-500'
  },
  {
    path: '/conversation-rachel-daniel',
    femaleVoice: 'Rachel',
    maleVoice: 'Daniel',
    description: 'Professional female voice with clear male voice',
    femaleColor: 'bg-pink-500',
    maleColor: 'bg-blue-500'
  },
  {
    path: '/conversation-sarah-sam',
    femaleVoice: 'Sarah',
    maleVoice: 'Sam',
    description: 'Warm female voice with casual male voice',
    femaleColor: 'bg-pink-500',
    maleColor: 'bg-blue-500'
  },
  {
    path: '/conversation-rachel-sam',
    femaleVoice: 'Rachel',
    maleVoice: 'Sam',
    description: 'Professional female voice with casual male voice',
    femaleColor: 'bg-pink-500',
    maleColor: 'bg-blue-500'
  }
];

export default function ConversationIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
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
            Choose Your Voice Combination
          </p>
          <p className="mt-2 text-purple-300">
            All conversations work offline with pre-generated audio
          </p>
        </motion.div>

        {/* Voice Combination Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {voiceCombinations.map((combo, index) => (
            <motion.div
              key={combo.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={combo.path}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                  {/* Voice Indicators */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full ${combo.femaleColor} mx-auto mb-2`}></div>
                      <div className="text-pink-200 font-medium">{combo.femaleVoice}</div>
                      <div className="text-pink-300 text-sm">Оля</div>
                    </div>
                    <div className="text-purple-300 text-lg">+</div>
                    <div className="text-center">
                      <div className={`w-4 h-4 rounded-full ${combo.maleColor} mx-auto mb-2`}></div>
                      <div className="text-blue-200 font-medium">{combo.maleVoice}</div>
                      <div className="text-blue-300 text-sm">Марк</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-purple-200 text-center mb-4">
                    {combo.description}
                  </p>

                  {/* Play Button */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all group-hover:shadow-lg group-hover:shadow-green-500/25">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Start Conversation
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Developer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-purple-300 text-sm mb-2">
              💡 <strong>For developers:</strong> Use <Link href="/showcase" className="text-purple-200 hover:text-purple-100 underline">/showcase</Link> to generate new audio combinations
            </p>
            <p className="text-purple-400 text-xs">
              All audio files are cached locally for instant offline playback
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-purple-300 text-sm"
        >
          <p>Professional Russian Language Learning</p>
          <p className="mt-1 text-purple-400">
            Select your preferred voice combination and start practicing
          </p>
        </motion.div>
      </div>
    </div>
  );
}
