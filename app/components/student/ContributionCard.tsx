"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Flag01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export default function ContributionCard() {
  return (
    <section className="relative mb-6 overflow-hidden rounded-[14px] bg-ktr-primary px-5 py-[18px] text-ktr-text-white">
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
        <button
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-[4px] border-ktr-accent-lime bg-ktr-surface-card text-ktr-primary"
          type="button"
          aria-label="Lihat kontribusi hari ini"
          onClick={() =>
            toast.success("Kontribusi dibuka", {
              description: "Feedback aksi sudah disiapkan untuk siswa.",
            })
          }
        >
          <HugeiconsIcon icon={ArrowRight02Icon} size={20} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
