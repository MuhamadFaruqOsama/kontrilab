"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { HeadphonesIcon } from "@hugeicons/core-free-icons";

export const STUDENT_HAS_ACTIVE_DISCUSSION = true;

export default function MinimizedCallUI() {
  // In a real app, you would determine if there's an active call from global state.
  // For this mockup, we'll assume there's an active discussion.
  const isActive = STUDENT_HAS_ACTIVE_DISCUSSION;

  if (!isActive) return null;

  return (
    <div className="fixed inset-x-0 bottom-[80px] z-30 mx-auto w-full max-w-[430px] px-4 pb-2">
      <Link
        href="/student/discussions/current"
        className="flex items-center justify-between rounded-[16px] bg-ktr-primary px-4 py-3 text-ktr-text-white shadow-lg transition-transform hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-full bg-white/20">
            <div className="absolute inset-0 animate-pulse rounded-full bg-white/30" />
            <HugeiconsIcon icon={HeadphonesIcon} size={20} className="relative text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-white/80">Diskusi Berjalan</span>
            <span className="line-clamp-1 text-[14px] font-semibold leading-tight text-white">
              Landing Page UMKM
            </span>
          </div>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
          <span className="text-xs font-bold text-white">1:04</span>
        </div>
      </Link>
    </div>
  );
}