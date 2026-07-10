"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AppFormField } from "@/components/ui/app-form-field";
import { publicAppConfig } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { getFirstZodError } from "@/lib/validation/zod";
import { getFriendlyAuthError } from "@/lib/copy/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!parsed.success) {
      const message = getFirstZodError(parsed.error);
      setError(message);
      toast.warning("Kata sandi belum valid", { description: message });
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: parsed.data.password });
    setIsSubmitting(false);

    if (updateError) {
      const message = getFriendlyAuthError(updateError.message || "Kata sandi belum bisa diperbarui. Buka ulang link reset dari email.");
      setError(message);
      toast.danger("Kata sandi belum diperbarui", { description: message });
      return;
    }

    setMessage("Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.");
    toast.success("Kata sandi diperbarui", { description: "Silakan masuk dengan kata sandi barumu." });
  }

  return (
    <div className="flex min-h-full flex-col">
      <div>
        <div className="space-y-3">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Buat Kata Sandi Baru</h1>
          <p className="max-w-[360px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Masukkan kata sandi baru untuk akun {publicAppConfig.name}. Link reset hanya berlaku dari email yang kamu terima.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <AppFormField label="Kata Sandi Baru" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Buat kata sandi baru" />
          <AppFormField label="Konfirmasi Kata Sandi" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ulangi kata sandi baru" />

          {error ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-project-need-attention">{error}</p> : null}
          {message ? <p className="text-[13px] font-medium leading-ktr-relaxed text-ktr-primary-dark">{message}</p> : null}

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-[10px] bg-ktr-primary text-ktr-text-white hover:bg-ktr-primary-hover">
            {isSubmitting ? "Memproses..." : "Simpan Kata Sandi"}
          </Button>
        </form>
      </div>

      <div className="mt-auto pt-10 text-center text-[14px] text-ktr-text-primary">
        Sudah selesai?{" "}
        <Link href="/login" className="font-medium text-ktr-primary hover:text-ktr-primary-hover">
          Masuk
        </Link>
      </div>
    </div>
  );
}