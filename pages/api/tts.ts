import { NextApiRequest, NextApiResponse } from 'next';

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

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add static export directive
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, speaker } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!speaker || (speaker !== 'А' && speaker !== 'Б')) {
      return res.status(400).json({ error: 'Invalid speaker' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'Voice API key not configured' });
    }

    const voiceId = (req.query.voiceId as string) || VOICE_OPTIONS[speaker as 'А' | 'Б'][0].id;

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
      return res.status(response.status).json({ 
        error: 'Failed to generate speech', 
        details: errorText 
      });
    }

    const audioBuffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    res.setHeader('X-Cache', 'MISS');
    
    return res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
