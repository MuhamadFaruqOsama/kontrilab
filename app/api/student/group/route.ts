import { NextResponse } from "next/server";
import { getStudentGroupOverview } from "@/lib/services/kontrilab-sql.service";

export async function GET() {
  try {
    const overview = await getStudentGroupOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error("Student group API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
