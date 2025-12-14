import { NextResponse } from "next/server";
import { getPronunciationFeedback } from "@/lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const { expected, transcribed } = await request.json();

    if (!expected || !transcribed) {
      return NextResponse.json(
        { error: "Expected and transcribed text are required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock feedback for development
      return NextResponse.json({
        score: 75,
        feedback: "Good attempt! Keep practicing. (Demo mode - add OPENAI_API_KEY for real feedback)",
        corrections: [],
        demo: true,
      });
    }

    const feedback = await getPronunciationFeedback(expected, transcribed);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
