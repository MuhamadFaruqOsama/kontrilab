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
        className="appearance-none w-full rounded-lg border border-default-200 bg-content1 py-2 pl-3 pr-8 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer hover:border-default-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-default-400">
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
      </span>
    </div>
  );
}
