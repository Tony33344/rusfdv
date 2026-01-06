import { NextRequest, NextResponse } from 'next/server';
import { ensureCacheDir, isAudioCached, saveAudioToCache, getCachedAudio, getAudioUrl } from '@/lib/audio-cache';

const API_KEY = process.env.VOICE_API_KEY || process.env.ELEVENLABS_API_KEY;

// Voice options for different speakers
const VOICE_OPTIONS = {
  'А': [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' }
  ],
  'Б': [
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Sam' }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { text, speaker } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!speaker || (speaker !== 'А' && speaker !== 'Б')) {
      return NextResponse.json({ error: 'Invalid speaker' }, { status: 400 });
    }

    // Type guard to ensure speaker is of type 'А' | 'Б'
    const validSpeaker: 'А' | 'Б' = speaker;

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Voice API key not configured' },
        { status: 500 }
      );
    }

    const voiceId = request.nextUrl.searchParams.get('voiceId') || VOICE_OPTIONS[validSpeaker][0].id;

    // Ensure cache directory exists
    ensureCacheDir();

    console.log('TTS Request:', { text: text.substring(0, 50) + '...', speaker, voiceId });

    // Check if audio is already cached
    if (isAudioCached(validSpeaker, voiceId, text)) {
      console.log('Audio found in cache, serving from disk');
      const cachedAudio = getCachedAudio(validSpeaker, voiceId, text);
      if (cachedAudio) {
        return new NextResponse(new Uint8Array(cachedAudio), {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': cachedAudio.length.toString(),
            'X-Cache': 'HIT',
          },
        });
      }
    }

    console.log('Generating new audio from API');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voice API error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { error: 'Failed to generate speech', details: errorText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Save to cache
    saveAudioToCache(validSpeaker, voiceId, text, audioBuffer);
    console.log('Audio saved to cache');

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export voice options for frontend
export { VOICE_OPTIONS };
