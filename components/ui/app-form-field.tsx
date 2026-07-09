"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeClosedIcon, ViewIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

type AppFormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  helperText?: string;
  error?: string;
  rightSlot?: ReactNode;
};

export const AppFormField = forwardRef<HTMLInputElement, AppFormFieldProps>(function AppFormField(
  { label, helperText, error, className, type = "text", rightSlot, ...props },
  ref,
) {
  const id = useId();
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <label htmlFor={id} className="block space-y-3">
      <span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">{label}</span>
      <span
        className={cn(
          "flex h-11 items-center rounded-[12px] border bg-white px-3.5 text-ktr-text-primary",
          "border-ktr-border-light focus-within:border-ktr-border-focus focus-within:ring-3 focus-within:ring-ktr-primary/12",
          error && "border-ktr-project-need-attention focus-within:border-ktr-project-need-attention focus-within:ring-ktr-project-need-attention/15",
        )}
      >
        <input
          id={id}
          ref={ref}
          type={resolvedType}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-[14px] leading-none outline-none placeholder:text-ktr-text-tertiary",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            onClick={() => setShowPassword((value) => !value)}
            className="ml-2 inline-flex size-8 items-center justify-center rounded-full text-ktr-text-primary hover:bg-ktr-surface-soft"
          >
            <HugeiconsIcon icon={showPassword ? ViewIcon : EyeClosedIcon} size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
          </button>
        ) : (
          rightSlot
        )}
      </span>
      {error ? <p className="text-[12px] font-medium text-ktr-project-need-attention">{error}</p> : null}
      {!error && helperText ? <p className="text-[12px] leading-ktr-relaxed text-ktr-text-tertiary">{helperText}</p> : null}
    </label>
  );
});
