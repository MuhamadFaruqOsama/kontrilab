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
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  showCloseButton?: boolean;
}) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const dragStartY = React.useRef<number | null>(null);
  const dragDistance = React.useRef(0);

  function resetDrag() {
    dragStartY.current = null;
    dragDistance.current = 0;
    if (contentRef.current) {
      contentRef.current.style.removeProperty("transform");
      contentRef.current.style.removeProperty("transition");
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragStartY.current = event.clientY;
    dragDistance.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartY.current === null || !contentRef.current) {
      return;
    }

    dragDistance.current = Math.max(0, event.clientY - dragStartY.current);
    contentRef.current.style.transition = "none";
    contentRef.current.style.transform = `translateY(${dragDistance.current}px)`;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (dragDistance.current > 72) {
      closeRef.current?.click();
      resetDrag();
      return;
    }

    if (contentRef.current) {
      contentRef.current.style.transition = "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      contentRef.current.style.transform = "";
    }
    window.setTimeout(resetDrag, 190);
  }

  return (
    <BottomSheetPortal>
      <BottomSheetOverlay />
      <Dialog.Content
        ref={contentRef}
        data-slot="bottom-sheet-content"
        className={cn("ktr-bottom-sheet-content", className)}
        {...props}
      >
        <div
          className="mx-auto mb-3 h-1 w-[72px] touch-none rounded-full bg-ktr-border-light"
          role="button"
          tabIndex={0}
          aria-label="Geser ke bawah untuk menutup"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={resetDrag}
        />
        {children}
        <Dialog.Close ref={closeRef} className="sr-only">
          Tutup
        </Dialog.Close>
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
      className={cn("mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2", className)}
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


