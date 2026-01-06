import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json(
        { error: 'Failed to generate speech', details: errorText },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
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

export { VOICE_OPTIONS };
