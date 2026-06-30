"use client";

import Image from "next/image";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    title: "Gabung Proyek",
    description: "Masukkan kode join dari guru.",
    icon: "/icons/quick-actions/gabung-proyek.svg",
    sheet: true,
  },
  {
    title: "Diskusi Terbaru",
    description: "Lanjutkan obrolan terakhir kelompokmu.",
    icon: "/icons/quick-actions/diskusi-terbaru.svg",
    sheet: false,
  },
  {
    title: "Kirim Update",
    description: "Catat progres yang sudah kamu kerjakan.",
    icon: "/icons/quick-actions/kirim-update.svg",
    sheet: false,
  },
];

function ActionCard({ action }: { action: (typeof quickActions)[number] }) {
  return (
    <div className="flex h-16 w-full items-center justify-between rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5 text-left">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px]">
          <Image src={action.icon} alt="" width={40} height={40} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-medium leading-[22px] text-ktr-text-primary">
            {action.title}
          </span>
          <span className="block truncate text-[14px] font-normal leading-[22px] text-ktr-text-tertiary">
            {action.description}
          </span>
        </span>
      </div>
      <HugeiconsIcon icon={ArrowRight02Icon} size={20} strokeWidth={1.8} color="currentColor" className="shrink-0 text-ktr-text-primary" aria-hidden="true" />
    </div>
  );
}

export default function QuickActions() {
  return (
    <section className="mb-0">
      <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Aksi Cepat</h2>
      <div className="space-y-2">
        {quickActions.map((action) => {
          if (!action.sheet) {
            return (
              <button
                key={action.title}
                className="w-full"
                type="button"
                onClick={() =>
                  toast(action.title, {
                    description: "Feedback aksi siswa memakai toast.",
                  })
                }
              >
                <ActionCard action={action} />
              </button>
            );
          }

          return (
            <BottomSheet key={action.title}>
              <BottomSheetTrigger asChild>
                <button className="w-full" type="button">
                  <ActionCard action={action} />
                </button>
              </BottomSheetTrigger>
              <BottomSheetContent>
                <BottomSheetHeader>
                  <BottomSheetTitle>Gabung Proyek</BottomSheetTitle>
                  <BottomSheetDescription>
                    Masukkan kode join dari guru untuk bergabung ke proyek kelompokmu.
                  </BottomSheetDescription>
                </BottomSheetHeader>
                <label className="mt-5 block text-sm font-medium leading-ktr-snug text-ktr-text-primary" htmlFor="join-code">
                  Kode Proyek
                </label>
                <input
                  id="join-code"
                  className="mt-2 h-11 w-full rounded-lg border border-ktr-border-input bg-ktr-surface-card px-3 text-sm outline-none transition-colors focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20"
                  placeholder="Contoh: KTR-2026"
                />
                <BottomSheetFooter>
                  <BottomSheetClose asChild>
                    <Button
                      className="w-full"
                      type="button"
                      onClick={() =>
                        toast.success("Berhasil bergabung", {
                          description: "Kamu akan masuk ke proyek setelah kode valid.",
                          icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />,
                        })
                      }
                    >
                      Gabung Proyek
                    </Button>
                  </BottomSheetClose>
                  <BottomSheetClose asChild>
                    <Button className="w-full" variant="outline" type="button">
                      Batal
                    </Button>
                  </BottomSheetClose>
                </BottomSheetFooter>
              </BottomSheetContent>
            </BottomSheet>
          );
        })}
      </div>
    </section>
  );
}
