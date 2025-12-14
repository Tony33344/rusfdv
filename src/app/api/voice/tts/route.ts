import { NextResponse } from "next/server";
import { textToSpeech } from "@/lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const { text, voiceId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      // Return a mock response for development
      return NextResponse.json(
        { 
          error: "ElevenLabs API key not configured",
          message: "Please add ELEVENLABS_API_KEY to your .env file",
          demo: true 
        },
        { status: 503 }
      );
    }

    const resolvedVoiceId = voiceId ?? process.env.ELEVENLABS_VOICE_ID;
    if (!resolvedVoiceId) {
      return NextResponse.json(
        {
          error: "ElevenLabs voice is not configured",
          message: "Please add ELEVENLABS_VOICE_ID to your .env.local (or pass voiceId)",
          demo: true,
        },
        { status: 503 }
      );
    }

    const audioBuffer = await textToSpeech({ text, voiceId: resolvedVoiceId });

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
