"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  defaultValue?: string;
  className?: string;
  ariaLabel?: string;
  onChange?: (value: string) => void;
}

export default function FilterSelect({ options, defaultValue, className = "", ariaLabel, onChange }: FilterSelectProps) {
  const initial = options.find((option) => option.value === defaultValue) ?? options[0];
  const [selected, setSelected] = React.useState(initial);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-ktr-border-light bg-white px-3.5 text-left text-sm font-medium text-ktr-text-primary transition-[border-color,transform] hover:border-ktr-border-input focus-visible:outline-none focus-visible:border-ktr-text-primary active:scale-[0.997]"
      >
        <span className="min-w-0 truncate">{selected?.label}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} className={cn("shrink-0 text-ktr-text-primary transition-transform duration-200", open ? "rotate-180" : "rotate-0")} aria-hidden="true" />
      </button>

      {open ? (
        <div className="teacher-dropdown-popover absolute right-0 top-[calc(100%+8px)] z-30 max-h-72 w-full min-w-[13rem] overflow-hidden rounded-[12px] border border-ktr-border-light bg-white p-1" role="listbox">
          {options.map((option) => {
            const active = option.value === selected?.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                  onChange?.(option.value);
                }}
                className={cn(
                  "flex h-9 w-full cursor-pointer items-center rounded-[10px] px-3 text-left text-sm font-medium transition-colors",
                  active ? "text-ktr-text-primary" : "text-ktr-text-tertiary hover:text-ktr-text-primary"
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
