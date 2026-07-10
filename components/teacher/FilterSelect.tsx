"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  defaultValue?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * A styled <select> wrapper that uses a consistent visual style
 * matching the KontriLab design system instead of browser defaults.
 */
export default function FilterSelect({
  options,
  defaultValue,
  className = "",
  ariaLabel,
}: FilterSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        defaultValue={defaultValue}
        aria-label={ariaLabel}
        className="appearance-none w-full rounded-lg border border-ktr-border-light bg-ktr-surface-card py-2 pl-3 pr-8 text-sm text-ktr-text-primary focus:border-ktr-primary focus:outline-none focus:ring-1 focus:ring-ktr-primary transition-colors cursor-pointer hover:border-ktr-border-active"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ktr-text-tertiary">
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
      </span>
    </div>
  );
}
