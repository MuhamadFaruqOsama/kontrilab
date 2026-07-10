"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { EmailConfirmationView } from "../email-confirmation/EmailConfirmationView";
import { Button } from "@/components/ui/button";
import { AppFormField } from "@/components/ui/app-form-field";
import { publicAppConfig } from "@/lib/env";
import { registerSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";
import { getFriendlyAuthError } from "@/lib/copy/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const message = getFirstZodError(parsed.error);
      setError(message);
      return;
    }

    const payload = { username: parsed.data.username, email: parsed.data.email, password: parsed.data.password };

    setIsSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      const message = getFriendlyAuthError(result.message);
      setError(message);
      return;
    }
    setPendingEmail(payload.email);
  }

  if (pendingEmail) {
    return <EmailConfirmationView email={pendingEmail} onBack={() => setPendingEmail("")} />;
  }

  return (
    <div className="flex min-h-full flex-col">
      <div>
        <div className="space-y-3">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Mulai Kelola Kontribusimu</h1>
          <p className="max-w-[360px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Buat akun untuk bergabung ke proyek, berdiskusi, dan mencatat progres bersama kelompok di {publicAppConfig.name}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <AppFormField label="Nama" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Masukkan nama lengkapmu" />
          <AppFormField label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Masukkan email aktifmu" />
          <AppFormField label="Kata Sandi" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Buat kata sandi" />
          <AppFormField label="Konfirmasi Kata Sandi" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ulangi kata sandi" />

          {error ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-project-need-attention">{error}</p> : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-[10px] bg-ktr-primary text-ktr-text-white hover:bg-ktr-primary-hover">
            {isSubmitting ? "Memproses..." : "Buat Akun"}
          </Button>
        </form>
      </div>

      <div className="mt-auto pt-10 text-center text-[14px] text-ktr-text-primary">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-ktr-primary hover:text-ktr-primary-hover">
          Masuk
        </Link>
      </div>
    </div>
  );
}