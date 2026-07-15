import { NextRequest, NextResponse } from "next/server";
import {
  createStudentDiscussion,
  finishStudentDiscussion,
  getActiveStudentDiscussion,
  saveStudentDiscussionChat,
} from "@/lib/services/kontrilab-sql.service";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Student discussions API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const discussion = await getActiveStudentDiscussion();
    return NextResponse.json(discussion);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const discussion = await createStudentDiscussion({
      title: body?.title,
      topic: body?.topic,
      initialNote: body?.initialNote,
    });
    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body?.action ?? "message");
    const discussion = action === "finish"
      ? await finishStudentDiscussion({ discussionId: body?.discussionId, summary: body?.summary })
      : await saveStudentDiscussionChat({ discussionId: body?.discussionId, message: body?.message });
    return NextResponse.json(discussion);
  } catch (error) {
    return errorResponse(error);
  }
}