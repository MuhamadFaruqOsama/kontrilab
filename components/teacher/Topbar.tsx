"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";

export default function Topbar() {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-5 text-ktr-text-secondary">Semester Genap 2026</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative inline-flex size-11 cursor-pointer items-center justify-center rounded-[14px] border border-ktr-border-light bg-white text-ktr-text-secondary transition-colors hover:bg-ktr-surface-soft" aria-label="Notifikasi">
          <HugeiconsIcon icon={Notification03Icon} size={20} />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-ktr-primary" />
        </button>

        <div className="size-10 overflow-hidden rounded-[14px] ring-1 ring-ktr-border-light transition-all hover:ring-ktr-border-input">
          <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar pengguna" width={40} height={40} className="size-full object-cover" unoptimized />
        </div>
      </div>
    </div>
  );
}
