import { NextResponse } from "next/server";

import { AppRole } from "@/lib/auth/session";
import { appConfig, getAppUrl } from "@/lib/env";
import { sendVerificationEmail } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { registerRequestSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = registerRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ message: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const { username, email, password } = parsed.data;
    const redirectTo = `${getAppUrl(new URL(request.url).origin)}/login`;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        redirectTo,
        data: {
          username,
          name: username,
          role: AppRole.SISWA,
          appName: appConfig.name,
        },
      },
    });

    const actionUrl = data.properties?.action_link;

    if (error || !actionUrl) {
      return NextResponse.json({ message: error?.message || "Link verifikasi belum bisa dibuat." }, { status: 400 });
    }

    await sendVerificationEmail({ to: email, username, actionUrl });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registrasi belum bisa diproses.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
