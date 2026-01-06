import { Handler } from '@netlify/functions';
import { ensureCacheDir, isAudioCached, saveAudioToCache, getCachedAudio } from '../../src/lib/audio-cache';

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

const API_KEY = process.env.VOICE_API_KEY || process.env.ELEVENLABS_API_KEY;

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { text, speaker } = JSON.parse(event.body || '{}');

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    if (!speaker || (speaker !== 'А' && speaker !== 'Б')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid speaker' }),
      };
    }

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Voice API key not configured' }),
      };
    }

    const voiceId = event.queryStringParameters?.voiceId || VOICE_OPTIONS[speaker as 'А' | 'Б'][0].id;

    // For static export, we can't use server-side file system
    // So we'll generate audio on-demand without caching

    console.log('TTS Request:', { text: text.substring(0, 50) + '...', speaker, voiceId });

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
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to generate speech', details: errorText }),
      };
    }

    const audioBuffer = await response.arrayBuffer();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'X-Cache': 'MISS',
      },
      body: Buffer.from(audioBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('TTS API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
