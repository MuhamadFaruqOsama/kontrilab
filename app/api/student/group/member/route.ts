import { NextRequest, NextResponse } from "next/server";
import { promoteStudentGroupMember, removeStudentGroupMember } from "@/lib/services/kontrilab-sql.service";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Student group member API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body?.memberId !== "string" && typeof body?.memberId !== "number") {
      return NextResponse.json({ error: "ID anggota wajib dikirim." }, { status: 400 });
    }
    const overview = await promoteStudentGroupMember(String(body.memberId));
    return NextResponse.json(overview);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID anggota wajib dikirim." }, { status: 400 });
    const overview = await removeStudentGroupMember(id);
    return NextResponse.json(overview);
  } catch (error) {
    return errorResponse(error);
  }
}
