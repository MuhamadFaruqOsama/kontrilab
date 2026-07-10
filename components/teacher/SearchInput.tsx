"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ placeholder = "Cari...", className = "", value, onChange }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ktr-text-secondary">
        <HugeiconsIcon icon={Search01Icon} size={17} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-[14px] border border-ktr-border-light bg-white py-2 pl-11 pr-4 text-sm text-ktr-text-primary transition-[border-color] placeholder:text-ktr-text-secondary hover:border-ktr-border-input focus:border-ktr-primary focus:outline-none focus:ring-3 focus:ring-ktr-primary/15"
      />
    </div>
  );
}
