import fs from 'fs';
import path from 'path';

// Audio cache directory
const AUDIO_CACHE_DIR = path.join(process.cwd(), 'public', 'audio-cache');

// Ensure cache directory exists
export function ensureCacheDir() {
  if (!fs.existsSync(AUDIO_CACHE_DIR)) {
    fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
  }
}

// Generate filename for cached audio
export function getAudioFilename(speaker: 'А' | 'Б', voiceId: string, text: string): string {
  // Create a hash of the text to avoid long filenames
  const textHash = Buffer.from(text).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  return `${speaker}_${voiceId}_${textHash}.mp3`;
}

// Get local file path for cached audio
export function getAudioFilePath(speaker: 'А' | 'Б', voiceId: string, text: string): string {
  return path.join(AUDIO_CACHE_DIR, getAudioFilename(speaker, voiceId, text));
}

// Get URL for cached audio (for frontend)
export function getAudioUrl(speaker: 'А' | 'Б', voiceId: string, text: string): string {
  return `/audio-cache/${getAudioFilename(speaker, voiceId, text)}`;
}

// Check if audio is already cached
export function isAudioCached(speaker: 'А' | 'Б', voiceId: string, text: string): boolean {
  return fs.existsSync(getAudioFilePath(speaker, voiceId, text));
}

// Save audio to cache
export function saveAudioToCache(speaker: 'А' | 'Б', voiceId: string, text: string, audioBuffer: ArrayBuffer): void {
  const filePath = getAudioFilePath(speaker, voiceId, text);
  fs.writeFileSync(filePath, Buffer.from(audioBuffer));
}

// Get cached audio buffer
export function getCachedAudio(speaker: 'А' | 'Б', voiceId: string, text: string): Buffer | null {
  const filePath = getAudioFilePath(speaker, voiceId, text);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}
