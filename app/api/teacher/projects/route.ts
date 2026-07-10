import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project.service";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const firstTeacher = await prisma.user.findFirst({ where: { role: "TEACHER" } });
    if (!firstTeacher) return NextResponse.json({ error: "No teacher found" }, { status: 404 });

    const projects = await ProjectService.getProjects(firstTeacher.id);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const firstTeacher = await prisma.user.findFirst({ where: { role: "TEACHER" } });
    if (!firstTeacher) return NextResponse.json({ error: "No teacher found" }, { status: 404 });

    const data = await request.json();
    const newProject = await ProjectService.createProject({
      ...data,
      ownerId: firstTeacher.id
    });
    return NextResponse.json(newProject);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
