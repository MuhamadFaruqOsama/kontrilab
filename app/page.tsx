import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-ktr-neutral-1000 text-foreground sm:py-6">
      <section className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-ktr-surface-bg-app sm:rounded-[32px]">

        <div className="absolute inset-x-0 top-0 h-full w-full bg-[url('/vectors/student-onboarding.svg')] bg-cover bg-top" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-white via-white/95 to-white/0" />

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-4 pb-6 pt-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="text-[28px] font-bold leading-ktr-tight text-ktr-primary sm:text-[32px]">
                Belajar Lebih Kompak, Berkarya Lebih Berdampak
              </h1>
              <p className="max-w-[330px] text-base leading-ktr-relaxed text-ktr-text-tertiary">
                Semua kontribusi tercatat agar kerja sama terasa lebih adil dan transparan.
              </p>
            </div>

            <Link
              href="/login"
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-ktr-primary px-4 text-base font-medium text-white shadow-[0_12px_24px_rgba(87,193,133,0.28)] hover:bg-ktr-primary-hover"
            >
              Mulai Sekarang
              <HugeiconsIcon icon={ArrowRight02Icon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </Link>

            <p className="text-center text-sm text-ktr-text-secondary">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-ktr-primary-dark hover:text-ktr-primary-hover">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
