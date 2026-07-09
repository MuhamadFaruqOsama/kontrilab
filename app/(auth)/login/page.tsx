"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AppFormField } from "@/components/ui/app-form-field";
import { publicAppConfig } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";
import { getFriendlyAuthError } from "@/lib/copy/auth";
import { loginSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      const message = getFirstZodError(parsed.error);
      setError(message);
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
    setIsSubmitting(false);

    if (signInError) {
      const message = getFriendlyAuthError(signInError.message);
      setError(message);
      return;
    }

    document.cookie = "kontrilab-auth=1; path=/; max-age=604800; samesite=lax";
    toast.success("Masuk berhasil", { description: "Selamat datang kembali. Yuk lanjutkan progres kelompokmu." });
    const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
    router.push(redirectTo || "/student");
  }

  return (
    <div className="flex min-h-full flex-col">
      <div>
        <div className="space-y-3">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Selamat Datang Kembali</h1>
          <p className="max-w-[360px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Masuk untuk melanjutkan proyek, diskusi, dan catatan progres kelompokmu di {publicAppConfig.name}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <AppFormField
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Masukkan email aktifmu"
          />

          <div className="space-y-3">
            <AppFormField
              label="Kata Sandi"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-[14px] font-medium text-ktr-primary hover:text-ktr-primary-hover">
                Lupa kata sandi?
              </Link>
            </div>
          </div>

          {error ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-project-need-attention">{error}</p> : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-[10px] bg-ktr-primary text-white hover:bg-ktr-primary-hover">
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>

      <div className="mt-auto pt-10 text-center text-[14px] text-ktr-text-primary">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-ktr-primary hover:text-ktr-primary-hover">
          Daftar
        </Link>
      </div>
    </div>
  );
}