import Image from "next/image";

import { AppBackButton } from "@/components/ui/app-back-button";

export function EmailConfirmationView({ email }: { email: string }) {
  return (
    <div className="flex min-h-full flex-col px-0 pb-4 pt-2">
      <AppBackButton href="/register" className="border-transparent px-0" />

      <section className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
        <div className="relative mb-12 h-[232px] w-[232px]">
          <Image
            src="/images/email-confirmation.svg"
            alt="Ilustrasi email konfirmasi terkirim"
            fill
            priority
            unoptimized
            sizes="232px"
            className="object-contain"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-[24px] font-semibold leading-ktr-tight text-ktr-text-primary">Cek Emailmu, Ya!</h1>
          <p className="mx-auto max-w-[260px] text-[14px] leading-ktr-relaxed text-ktr-text-secondary">
            Kami sudah mengirim link verifikasi ke email yang kamu daftarkan.
          </p>
        </div>

        <a
          href="mailto:"
          className="mt-7 flex h-12 w-[202px] items-center justify-center rounded-[10px] bg-ktr-primary px-4 text-base font-medium text-white hover:bg-ktr-primary-hover"
          aria-label={`Buka aplikasi email untuk ${email}`}
        >
          Buka Email
        </a>
      </section>
    </div>
  );
}
