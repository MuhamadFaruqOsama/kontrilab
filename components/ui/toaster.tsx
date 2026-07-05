"use client";

import { ToastProvider, Toast, ToastCloseButton, ToastContent, ToastDescription, ToastIndicator, ToastTitle } from "@heroui/react/toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const variantIcon = {
  success: CheckmarkCircle02Icon,
  danger: Alert02Icon,
  warning: Alert02Icon,
  info: InformationCircleIcon,
  accent: InformationCircleIcon,
  default: InformationCircleIcon,
} as const;

const variantClass = {
  success: "text-ktr-primary bg-ktr-primary-soft",
  danger: "text-red-500 bg-red-50",
  warning: "text-amber-500 bg-amber-50",
  info: "text-ktr-info bg-blue-50",
  accent: "text-ktr-info bg-blue-50",
  default: "text-ktr-text-secondary bg-ktr-surface-soft",
} as const;

function Toaster() {
  return (
    <ToastProvider
      placement="top"
      width="calc(100vw - 32px)"
      maxVisibleToasts={3}
      gap={8}
      className="pointer-events-none fixed left-1/2 top-4 z-50 w-[calc(100vw-32px)] max-w-[398px] -translate-x-1/2 outline-none"
    >
      {({ toast }) => {
        const content = toast.content ?? {};
        const variant = content.variant ?? "default";
        const Icon = variantIcon[variant];

        return (
          <Toast
            toast={toast}
            variant={variant}
            className="ktr-toast pointer-events-auto absolute inset-x-0 flex items-center gap-3 rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-3 text-ktr-text-primary outline-none"
          >
            {content.indicator === null ? null : (
              <ToastIndicator className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px]", variantClass[variant])}>
                {content.indicator ?? <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" />}
              </ToastIndicator>
            )}
            <ToastContent className="flex min-w-0 flex-1 flex-col gap-1">
              {content.title ? <ToastTitle className="block text-[14px] font-semibold leading-[20px] text-ktr-text-primary">{content.title}</ToastTitle> : null}
              {content.description ? <ToastDescription className="block text-[12px] font-normal leading-[18px] text-ktr-text-secondary">{content.description}</ToastDescription> : null}
            </ToastContent>
            <ToastCloseButton className="-mr-1 flex size-7 shrink-0 items-center justify-center self-center rounded-[10px] text-ktr-text-tertiary transition-colors hover:bg-ktr-surface-soft hover:text-ktr-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
          </Toast>
        );
      }}
    </ToastProvider>
  );
}

export { Toaster };