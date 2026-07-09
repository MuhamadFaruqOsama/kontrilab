import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/env";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = forgotPasswordSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ message: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const { email } = parsed.data;
    const redirectTo = `${getAppUrl(new URL(request.url).origin)}/reset-kata sandi`;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo,
      },
    });

    const actionUrl = data.properties?.action_link;

    if (!error && actionUrl) {
      await sendPasswordResetEmail({ to: email, actionUrl });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Instruksi reset kata sandi belum bisa dikirim.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
