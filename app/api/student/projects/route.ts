import { NextResponse } from "next/server";
import { ProjectService } from "@/lib/services/project.service";

export async function GET(request: Request) {
  try {
    // In a real app, students might only see projects they are invited to or all active ones
    // For now we return all projects without filtering by owner
    const projects = await ProjectService.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
