"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AppFormField } from "@/components/ui/app-form-field";
import { publicAppConfig } from "@/lib/env";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const parsed = forgotPasswordSchema.safeParse({ email });

    if (!parsed.success) {
      const message = getFirstZodError(parsed.error);
      setError(message);
      toast.warning("Email belum valid", { description: message });
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });
    const result = (await response.json()) as { message?: string };
    setIsSubmitting(false);

    if (!response.ok) {
      const message = result.message || "Reset password belum bisa dikirim.";
      setError(message);
      toast.danger("Link reset belum terkirim", { description: message });
      return;
    }

    setMessage("Instruksi reset password sudah dikirim ke emailmu.");
    toast.success("Link reset terkirim", { description: "Cek emailmu untuk membuat password baru." });
  }

  return (
    <div className="flex min-h-full flex-col">
      <div>
        <div className="space-y-3">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Reset Password</h1>
          <p className="max-w-[360px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Masukkan email akun {publicAppConfig.name}, lalu kami kirim link untuk membuat password baru.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <AppFormField label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Masukkan email aktifmu" />

          {error ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-project-need-attention">{error}</p> : null}
          {message ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-primary-dark">{message}</p> : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-[10px] bg-ktr-primary text-white hover:bg-ktr-primary-hover">
            {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>
      </div>

      <div className="mt-auto pt-10 text-center text-[14px] text-ktr-text-primary">
        Ingat password?{" "}
        <Link href="/login" className="font-medium text-ktr-primary hover:text-ktr-primary-hover">
          Masuk
        </Link>
      </div>
    </div>
  );
}