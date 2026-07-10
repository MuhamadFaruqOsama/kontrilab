import { NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai.service";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const insights = await AIService.analyzeDiscussion(sessionId);
    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
