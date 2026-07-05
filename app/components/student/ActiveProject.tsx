"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const discussions = [
  {
    title: "Pembahasan Konsep Landing Page",
    project: "Landing Page UMKM",
    status: "Sedang Berjalan",
    statusClass: "text-ktr-info",
    messages: "4 pesan",
    time: "Terakhir 10 menit lalu",
    href: "/student/discussions/current",
    primary: true,
  },
];

export default function ActiveProject() {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Diskusi Berjalan Saat Ini</h2>
        <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-ktr-primary text-[12px] font-semibold leading-none text-ktr-text-white">
          {discussions.length}
        </span>
      </div>

      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Link
            key={discussion.title}
            href={discussion.href}
            className={cn(
              "block rounded-[20px] border bg-ktr-surface-card p-3 transition-colors hover:border-ktr-primary/40",
              discussion.status === "Sedang Berjalan" ? "active-discussion-card border-ktr-border-light" : "border-ktr-border-light"
            )}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{discussion.title}</h3>
                <p className="mt-1 truncate text-[12px] leading-[18px] text-ktr-text-tertiary">{discussion.project}</p>
              </div>
              <span className={cn("shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px]", discussion.statusClass)}>
                {discussion.status}
              </span>
            </div>

            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-[18px] text-ktr-text-tertiary">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={BubbleChatIcon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                {discussion.messages}
              </span>
              <span className="text-ktr-text-disabled">&bull;</span>
              <span className="flex min-w-0 items-center gap-1.5">
                <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                <span className="truncate">{discussion.time}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
