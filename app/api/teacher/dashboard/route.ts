import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DashboardService } from "@/lib/services/dashboard.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester") || undefined;
    
    // In a real app, get teacherId from auth session
    // For now we use a dummy teacher ID or fetch the first teacher
    const firstTeacher = await prisma.user.findFirst({
      where: { role: "TEACHER" }
    });

    if (!firstTeacher) {
      return NextResponse.json({ error: "No teacher found" }, { status: 404 });
    }

    const stats = await DashboardService.getTeacherDashboardStats(firstTeacher.id, semester);
    const projects = await DashboardService.getTeacherProjects(firstTeacher.id);
    const followUps = await DashboardService.getFollowUps(firstTeacher.id);

    return NextResponse.json({
      stats,
      projects,
      followUps,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
