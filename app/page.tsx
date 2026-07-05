import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

import { publicAppConfig } from "@/lib/env";

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-ktr-surface-bg-app text-foreground sm:bg-ktr-neutral-1000 sm:py-6">
      <section className="relative ktr-app-shell mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-ktr-surface-bg-app rounded-[12px]">
        <Image
          src="/images/onboarding-hero.svg"
          alt={`Ilustrasi siswa siap memulai proyek ${publicAppConfig.name}`}
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          unoptimized
          className="object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-white via-white/98 via-75% to-white/0 backdrop-blur-[0.5px]" />

        <div className="relative z-10 flex min-h-dvh flex-col justify-end px-4 pb-6 pt-10">
          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="text-[28px] font-semibold leading-ktr-tight text-ktr-primary sm:text-[32px]">
                Belajar Lebih Kompak, Berkarya Lebih Berdampak
              </h1>
              <p className="max-w-[330px] text-base leading-ktr-relaxed text-ktr-text-tertiary">
                Semua kontribusi tercatat agar kerja sama terasa lebih adil dan transparan.
              </p>
            </div>

            <Link
              href="/register"
              className="flex h-[48px] w-full items-center justify-center gap-3 rounded-[12px] bg-ktr-primary px-4 text-base font-medium text-white hover:bg-ktr-primary-hover"
            >
              Mulai Sekarang
              <HugeiconsIcon icon={ArrowRight02Icon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
