"use client";

import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

type AppBackButtonProps = {
  href?: string;
  label?: string;
  className?: string;
};

export function AppBackButton({ href, label = "Kembali", className }: AppBackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (href) {
      router.push(href);
      return;
    }

    router.back();
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-ktr-text-primary",
        "hover:bg-ktr-surface-soft focus-visible:border-ktr-border-focus focus-visible:ring-3 focus-visible:ring-ktr-primary/15",
        className,
      )}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={22} strokeWidth={1.9} color="currentColor" aria-hidden="true" />
    </button>
  );
}


