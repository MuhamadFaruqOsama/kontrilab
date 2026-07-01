import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Flag01Icon } from "@hugeicons/core-free-icons";

export default function ContributionCard() {
  return (
    <section className="relative mb-6 rounded-[14px] bg-ktr-primary px-5 py-[18px] text-ktr-text-white">
      <p className="flex items-center gap-2 text-[14px] font-medium leading-4 text-ktr-accent-lime">
        <HugeiconsIcon icon={Flag01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
        Kontribusimu Hari Ini
      </p>
      <h2 className="mt-3 max-w-[340px] text-[18px] font-semibold leading-[28px] text-ktr-text-white">
        Keren, kamu sudah mengirim 2 update hari ini!
      </h2>
      <div className="mt-[34px] flex items-center justify-between gap-4">
        <p className="max-w-[285px] text-[15px] font-normal leading-[22px] text-ktr-border-light">
          Lanjutkan progresmu dan bantu kelompok tetap bergerak.
        </p>
        <Link
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-[4px] border-ktr-accent-lime bg-ktr-surface-card text-ktr-primary"
          href="/student/activities/contribution"
          aria-label="Lihat ringkasan kontribusi"
        >
          <HugeiconsIcon icon={ArrowRight02Icon} size={20} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}