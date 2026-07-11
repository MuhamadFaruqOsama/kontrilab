import { NextRequest, NextResponse } from "next/server";
import { createStudentProgress } from "@/lib/services/kontrilab-sql.service";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Student group progress API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const overview = await createStudentProgress({
      description: body?.description,
      document: body?.document,
    });
    return NextResponse.json(overview, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
