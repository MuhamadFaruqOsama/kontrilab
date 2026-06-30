"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

function BottomSheet({ ...props }: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="bottom-sheet" {...props} />;
}

function BottomSheetTrigger({
  ...props
}: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="bottom-sheet-trigger" {...props} />;
}

function BottomSheetClose({ ...props }: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="bottom-sheet-close" {...props} />;
}

function BottomSheetPortal({ ...props }: React.ComponentProps<typeof Dialog.Portal>) {
  return <Dialog.Portal data-slot="bottom-sheet-portal" {...props} />;
}

function BottomSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="bottom-sheet-overlay"
      className={cn("ktr-bottom-sheet-overlay", className)}
      {...props}
    />
  );
}

function BottomSheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <BottomSheetPortal>
      <BottomSheetOverlay />
      <Dialog.Content
        data-slot="bottom-sheet-content"
        className={cn("ktr-bottom-sheet-content", className)}
        {...props}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ktr-border-active" />
        {children}
        {showCloseButton && (
          <Dialog.Close className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-ktr-text-tertiary transition-colors hover:bg-ktr-surface-soft hover:text-ktr-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            <span className="sr-only">Tutup</span>
          </Dialog.Close>
        )}
      </Dialog.Content>
    </BottomSheetPortal>
  );
}

function BottomSheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn("space-y-1.5 pr-10 text-left", className)}
      {...props}
    />
  );
}

function BottomSheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-footer"
      className={cn("mt-6 flex flex-col gap-2 sm:flex-row", className)}
      {...props}
    />
  );
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="bottom-sheet-title"
      className={cn("text-xl font-semibold leading-ktr-tight text-ktr-text-primary", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="bottom-sheet-description"
      className={cn("text-sm leading-ktr-normal text-ktr-text-secondary", className)}
      {...props}
    />
  );
}

export {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
};


