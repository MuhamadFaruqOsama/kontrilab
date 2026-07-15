import { NextRequest, NextResponse } from "next/server";
import { submitStudentPeerAssessment } from "@/lib/services/kontrilab-sql.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await submitStudentPeerAssessment({
      subjectMemberId: body?.subjectMemberId,
      ratings: body?.ratings,
      note: body?.note,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Student peer assessment API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}