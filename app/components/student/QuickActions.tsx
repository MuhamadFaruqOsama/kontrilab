"use client";

import Image from "next/image";
import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { toast } from "@/components/ui/toast";

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

type QuickAction =
  | { title: string; description: string; icon: string; sheet: true }
  | { title: string; description: string; icon: string; href: string };

const quickActions: QuickAction[] = [
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
    href: "/student/discussions/current",
  },
  {
    title: "Kirim Update",
    description: "Catat progres yang sudah kamu kerjakan.",
    icon: "/icons/quick-actions/kirim-update.svg",
    href: "/student/progress/new",
  },
];

function ActionCard({ action }: { action: QuickAction }) {
  return (
    <div className="relative flex h-16 w-full items-center justify-between overflow-hidden rounded-[18px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5 text-left">
      <div className="relative z-10 flex min-w-0 items-center gap-3">
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
      <HugeiconsIcon icon={ArrowRight02Icon} size={20} strokeWidth={1.8} color="currentColor" className="relative z-10 shrink-0 text-ktr-text-primary" aria-hidden="true" />
    </div>
  );
}

export default function QuickActions() {
  return (
    <section className="mb-0">
      <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Aksi Cepat</h2>
      <div className="space-y-2">
        {quickActions.map((action) => {
          if (!("sheet" in action)) {
            return (
              <Link key={action.title} className="block w-full" href={action.href}>
                <ActionCard action={action} />
              </Link>
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
                  className="mt-2 h-11 w-full rounded-[10px] border border-ktr-border-input bg-ktr-surface-card px-3 text-sm outline-none transition-colors focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20"
                  placeholder="Contoh: KTR-2026"
                />
                <BottomSheetFooter>
                  <BottomSheetClose asChild>
                    <Button className="w-full" variant="outline" type="button">
                      Batal
                    </Button>
                  </BottomSheetClose>
                  <Button asChild className="w-full" onClick={() => toast.success("Kode diterima", { description: "Pilih atau buat kelompok untuk melanjutkan.", indicator: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" /> })}>
                    <Link href="/student/projects/group/start">Gabung Proyek</Link>
                  </Button>
                </BottomSheetFooter>
              </BottomSheetContent>
            </BottomSheet>
          );
        })}
      </div>
    </section>
  );
}