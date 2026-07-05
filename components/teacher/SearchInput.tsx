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
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-default-400">
        <HugeiconsIcon icon={Search01Icon} size={16} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-default-200 bg-content1 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors hover:border-default-300"
      />
    </div>
  );
}
