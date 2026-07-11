import { NextRequest, NextResponse } from "next/server";
import {
  createTeacherProject,
  deleteTeacherProject,
  duplicateTeacherProject,
  getTeacherProjectCards,
  updateTeacherProject,
} from "@/lib/services/kontrilab-sql.service";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Teacher projects API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const projects = await getTeacherProjectCards();
    return NextResponse.json(projects);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projects = typeof body?.duplicateFromId === "string" || typeof body?.duplicateFromId === "number"
      ? await duplicateTeacherProject(String(body.duplicateFromId))
      : await createTeacherProject({
          title: body?.title,
          className: body?.className,
          description: body?.description,
          dueDate: body?.dueDate,
        });
    return NextResponse.json(projects, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body?.id;
    if (typeof id !== "string" && typeof id !== "number") {
      return NextResponse.json({ error: "ID proyek wajib dikirim." }, { status: 400 });
    }

    const projects = await updateTeacherProject(String(id), {
      title: body?.title,
      className: body?.className,
      description: body?.description,
      dueDate: body?.dueDate,
    });
    return NextResponse.json(projects);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID proyek wajib dikirim." }, { status: 400 });
    const projects = await deleteTeacherProject(id);
    return NextResponse.json(projects);
  } catch (error) {
    return errorResponse(error);
  }
}
