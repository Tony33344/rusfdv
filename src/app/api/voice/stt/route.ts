import { NextResponse } from "next/server";
import { speechToText } from "@/lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured",
          message: "Please add OPENAI_API_KEY to your .env file for speech recognition",
          demo: true,
          transcription: "" 
        },
        { status: 503 }
      );
    }

    const transcription = await speechToText(audioFile);

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
