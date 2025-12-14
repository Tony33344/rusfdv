const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Default voice can be configured via environment variables.
// If not set, the caller must pass a voiceId.
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoiceInfo {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
}

export async function textToSpeech(options: TextToSpeechOptions): Promise<ArrayBuffer> {
  const {
    text,
    voiceId,
    modelId = "eleven_multilingual_v2",
    stability = 0.5,
    similarityBoost = 0.75,
  } = options;

  const resolvedVoiceId = voiceId ?? DEFAULT_VOICE_ID;

  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  if (!resolvedVoiceId) {
    throw new Error("ELEVENLABS_VOICE_ID is not configured and no voiceId was provided");
  }

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${resolvedVoiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return response.arrayBuffer();
}

export async function getVoices(): Promise<VoiceInfo[]> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch voices");
  }

  const data = await response.json();
  return data.voices;
}

// Speech-to-text using OpenAI Whisper API
export async function speechToText(audioBlob: Blob): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "ru");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Whisper API error: ${error}`);
  }

  const data = await response.json();
  return data.text;
}

// Pronunciation feedback using GPT-4
export async function getPronunciationFeedback(
  expectedText: string,
  transcribedText: string
): Promise<{
  score: number;
  feedback: string;
  corrections: Array<{ expected: string; heard: string; tip: string }>;
}> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a Russian language pronunciation coach. Compare the expected Russian text with what the student actually said (transcribed). 
          Provide feedback in JSON format with:
          - score: 0-100 (how close the pronunciation was)
          - feedback: Brief encouraging feedback in English
          - corrections: Array of specific corrections needed, each with expected word, heard word, and pronunciation tip
          
          Be encouraging but accurate. Focus on common mistakes for Slovenian/English speakers learning Russian.`,
        },
        {
          role: "user",
          content: `Expected: "${expectedText}"\nTranscribed: "${transcribedText}"`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get pronunciation feedback");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
