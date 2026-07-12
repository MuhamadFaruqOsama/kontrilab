"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function TeacherBackButton({ href, label = "Kembali" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] border border-ktr-border-light bg-white text-ktr-text-primary transition-colors hover:border-ktr-border-input active:scale-[0.995]"
      aria-label={label}
      title={label}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
    </Link>
  );
}
