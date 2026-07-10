"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mic01Icon, MicOff01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";

export const STUDENT_HAS_ACTIVE_DISCUSSION = true;

export default function MinimizedCallUI() {
  const [muted, setMuted] = useState(false);
  const isActive = STUDENT_HAS_ACTIVE_DISCUSSION;

  if (!isActive) return null;

  return (
    <div className="fixed inset-x-0 bottom-[80px] z-30 mx-auto w-full max-w-[430px] px-4 pb-2">
      <div className="flex items-center gap-3 rounded-[16px] bg-ktr-primary px-4 py-3 text-ktr-text-white shadow-[0_18px_38px_rgba(87,193,134,0.34)] transition-transform hover:scale-[1.01]">
        <Link href="/student/discussions/current#call" className="flex min-w-0 flex-1 items-center gap-3">
          <Image src="/icons/panggilan-card.svg" alt="" width={38} height={38} aria-hidden="true" className="size-[38px] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-[20px] text-ktr-text-white">Landing Page UMKM</p>
            <p className="truncate text-[12px] font-medium leading-4 text-ktr-text-white/75">Kelompok 1</p>
          </div>
          <span className="shrink-0 text-[16px] font-semibold leading-6 tabular-nums text-ktr-text-white">1:04</span>
        </Link>
        <button
          type="button"
          aria-label={muted ? "Nyalakan mikrofon" : "Matikan mikrofon"}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-ktr-text-white transition-colors hover:bg-ktr-text-white/12 active:bg-ktr-text-white/18"
          onClick={() => setMuted((value) => !value)}
        >
          <HugeiconsIcon icon={muted ? MicOff01Icon : Mic01Icon} size={21} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}