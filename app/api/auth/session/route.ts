import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { AppRole, isAppRole } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const accessToken = typeof body?.accessToken === "string" ? body.accessToken.trim() : "";

    if (!accessToken) {
      return NextResponse.json({ message: "Token autentikasi wajib dikirim." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const user = data.user;
    if (!user) {
      return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
    }

    const roleCandidate = user.app_metadata?.role ?? user.user_metadata?.role;
    const role = isAppRole(roleCandidate) ? (roleCandidate as AppRole) : AppRole.SISWA;

    return NextResponse.json({
      userId: user.id,
      email: user.email ?? "",
      role,
      name: typeof user.user_metadata?.name === "string" ? user.user_metadata.name : typeof user.user_metadata?.username === "string" ? user.user_metadata.username : "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sesi belum bisa diproses.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
