import { NextResponse } from "next/server";
import { getStudentProjectCards } from "@/lib/services/kontrilab-sql.service";

export async function GET() {
  try {
    const projects = await getStudentProjectCards();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Student projects API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}