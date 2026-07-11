"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogoutSquare01Icon } from "@hugeicons/core-free-icons";

export default function Topbar() {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="size-10 overflow-hidden rounded-[10px] ring-1 ring-ktr-border-light">
          <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Foto profil guru" width={40} height={40} className="size-full object-cover" unoptimized />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-5 text-ktr-text-primary">Guru KontriLab</p>
          <p className="truncate text-xs font-medium leading-4 text-ktr-text-secondary">Koordinator proyek</p>
        </div>
      </div>

      <button className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-ktr-border-light bg-white px-3.5 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input" aria-label="Keluar">
        <HugeiconsIcon icon={LogoutSquare01Icon} size={18} strokeWidth={1.5} />
        <span className="hidden sm:inline">Keluar</span>
      </button>
    </div>
  );
}
