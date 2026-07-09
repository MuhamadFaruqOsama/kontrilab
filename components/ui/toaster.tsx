"use client";

import * as React from "react";
import { ToastProvider, Toast, ToastCloseButton, ToastContent, ToastDescription, ToastIndicator, ToastTitle, toast as toastApi } from "@heroui/react/toast";
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
  danger: "text-ktr-project-need-attention bg-ktr-project-need-attention-bg",
  warning: "text-ktr-warning bg-ktr-warning-bg",
  info: "text-ktr-info bg-ktr-info-bg",
  accent: "text-ktr-info bg-ktr-info-bg",
  default: "text-ktr-text-secondary bg-ktr-surface-soft",
} as const;

type AppToast = React.ComponentProps<typeof Toast>["toast"];

function ToastItem({ queuedToast }: { queuedToast: AppToast }) {
  const content = queuedToast.content ?? {};
  const variant = (content.variant ?? "default") as keyof typeof variantIcon;
  const Icon = variantIcon[variant];

  React.useEffect(() => {
    if (!queuedToast.timeout) return;
    const timeoutId = window.setTimeout(() => toastApi.close(String(queuedToast.key)), queuedToast.timeout);
    return () => window.clearTimeout(timeoutId);
  }, [queuedToast.key, queuedToast.timeout]);

  return (
    <Toast
      toast={queuedToast}
      variant={variant}
      className="ktr-toast pointer-events-auto absolute inset-x-0 flex items-center gap-3 rounded-[18px] border border-ktr-border-light bg-ktr-surface-card p-3 text-ktr-text-primary shadow-[0_16px_42px_rgba(43,48,51,0.12)] outline-none"
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
}

function Toaster() {
  return (
    <ToastProvider
      placement="top"
      width="calc(100vw - 32px)"
      maxVisibleToasts={3}
      gap={8}
      className="pointer-events-none fixed left-1/2 top-4 z-50 w-[calc(100vw-32px)] max-w-[398px] -translate-x-1/2 outline-none"
    >
      {({ toast }) => <ToastItem queuedToast={toast} />}
    </ToastProvider>
  );
}

export { Toaster };
