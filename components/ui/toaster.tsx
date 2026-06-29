"use client";

import { Toaster as SonnerToaster } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "border-ktr-border-light bg-ktr-surface-card text-ktr-text-primary shadow-lg",
          title: "text-sm font-semibold text-ktr-text-primary",
          description: "text-xs text-ktr-text-secondary",
          actionButton: "bg-ktr-primary text-primary-foreground",
          cancelButton: "bg-ktr-surface-soft text-ktr-text-secondary",
        },
      }}
    />
  );
}

export { Toaster };
