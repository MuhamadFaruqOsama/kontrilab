"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

/**
 * A styled search input with an integrated search icon.
 * Uses plain HTML with appearance styling consistent with the KontriLab design system.
 */
export default function SearchInput({
  placeholder = "Cari...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ktr-text-tertiary">
        <HugeiconsIcon icon={Search01Icon} size={16} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-ktr-border-light bg-ktr-surface-card py-2 pl-9 pr-3 text-sm text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-primary focus:outline-none focus:ring-1 focus:ring-ktr-primary transition-colors hover:border-ktr-border-active"
      />
    </div>
  );
}
