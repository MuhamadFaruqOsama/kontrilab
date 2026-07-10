"use client";

import * as React from "react";
import { Modal } from "@heroui/react/modal";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "primary" | "danger";
  onConfirm?: () => void;
  children?: React.ReactNode;
};

function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  tone = "primary",
  onConfirm,
  children,
}: ConfirmModalProps) {
  function handleConfirm() {
    onConfirm?.();
    onOpenChange(false);
  }

  return (
    <Modal.Root isOpen={open} onOpenChange={onOpenChange}>
      <Modal.Backdrop
        isDismissable
        className="ktr-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-ktr-neutral-1000/25 px-4 outline-none"
      >
        <Modal.Container placement="center" className="ktr-modal-container w-full max-w-[398px] outline-none">
          <Modal.Dialog className="rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-4 text-ktr-text-primary outline-none">
            <Modal.Header className="space-y-1 pr-8">
              <Modal.Heading className="text-[18px] font-semibold leading-[26px] text-ktr-text-primary">
                {title}
              </Modal.Heading>
              {description ? (
                <p className="text-[13px] font-normal leading-[20px] text-ktr-text-secondary">{description}</p>
              ) : null}
            </Modal.Header>
            {children ? <Modal.Body className="mt-4 text-[14px] font-normal leading-[22px] text-ktr-text-secondary">{children}</Modal.Body> : null}
            <Modal.Footer className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" className="h-11 rounded-[12px] bg-ktr-primary-soft text-[14px] font-medium text-ktr-primary hover:bg-ktr-primary-light" onClick={() => onOpenChange(false)}>
                {cancelText}
              </Button>
              <Button
                type="button"
                className={cn(
                  "h-11 rounded-[12px] text-[14px] font-medium",
                  tone === "danger" ? "bg-ktr-project-need-attention text-ktr-text-white hover:bg-ktr-project-need-attention" : "bg-ktr-primary text-ktr-text-white hover:bg-ktr-primary-hover"
                )}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            </Modal.Footer>
            <Modal.CloseTrigger className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-[10px] text-ktr-text-tertiary transition-colors hover:bg-ktr-surface-soft hover:text-ktr-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}

export { ConfirmModal };
export type { ConfirmModalProps };