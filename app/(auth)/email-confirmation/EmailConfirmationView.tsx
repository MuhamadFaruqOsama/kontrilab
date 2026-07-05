"use client";

import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { AppBackButton } from "@/components/ui/app-back-button";
import { toast } from "@/components/ui/toast";

export function EmailConfirmationView({ email, onBack }: { email: string; onBack?: () => void }) {
  return (
    <div className="flex min-h-full flex-col px-0 pb-4 pt-2">
      <AppBackButton href="/register" onClick={onBack} className="px-0" />

      <section className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
        <div className="mb-12 h-[232px] w-[232px] overflow-hidden rounded-[20px]">
          <DotLottieReact
            src="https://lottie.host/d1ae927a-e320-4321-a789-ead189c7b934/JyKi76TThp.lottie"
            loop
            autoplay
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Cek Emailmu, Ya!</h1>
          <p className="mx-auto max-w-[260px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Kami sudah mengirim link verifikasi ke email yang kamu daftarkan.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-7 flex h-12 w-[202px] items-center justify-center rounded-[10px] bg-ktr-primary px-4 text-base font-medium text-white hover:bg-ktr-primary-hover"
          aria-label={`Masuk setelah konfirmasi email untuk ${email}`}
          onClick={() => toast.info("Lanjut masuk", { description: "Gunakan akun yang sudah kamu verifikasi." })}
        >
          Masuk Sekarang
        </Link>
      </section>
    </div>
  );
}
