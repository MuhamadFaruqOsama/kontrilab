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
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ktr-text-secondary">
        <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={1.5} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-[10px] border border-ktr-border-light bg-white py-1.5 pl-10 pr-3.5 text-sm text-ktr-text-primary transition-[border-color] placeholder:text-ktr-text-secondary hover:border-ktr-border-input focus:border-ktr-text-primary focus:outline-none focus:ring-3 focus:ring-ktr-text-primary/10"
      />
    </div>
  );
}
