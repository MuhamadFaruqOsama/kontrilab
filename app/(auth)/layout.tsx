import Image from "next/image";

import { AppBackButton } from "@/components/ui/app-back-button";
import { publicAppConfig } from "@/lib/env";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white text-foreground sm:bg-ktr-neutral-1000 sm:py-6">
      <main className="ktr-app-shell mx-auto flex min-h-dvh w-full flex-col overflow-hidden bg-white text-ktr-text-primary rounded-[12px]">
        <section className="relative h-[270px] shrink-0 overflow-hidden bg-[#60c2e4]">
          <Image
            src="/images/auth-hero.svg"
            alt={`Ilustrasi perjalanan siswa ${publicAppConfig.name}`}
            fill
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            unoptimized
            className="object-cover object-center"
          />
          <AppBackButton href="/" className="absolute left-4 top-8 z-10" />
        </section>

        <section className="relative -mt-8 min-h-0 flex-1 overflow-y-auto rounded-t-[12px] bg-white px-4 pb-8 pt-4">
          {children}
        </section>
      </main>
    </div>
  );
}
