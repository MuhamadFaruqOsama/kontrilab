"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Calendar03Icon,
  Flag01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
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

const members = ["var(--ktr-secondary-main)", "var(--ktr-status-warning-main)", "var(--ktr-status-success-main)", "var(--ktr-project-need-attention)"];

export default function ActiveProject() {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Proyek Aktif</h2>
        <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-ktr-primary text-[12px] font-semibold leading-none text-ktr-text-white">
          1
        </span>
      </div>

      <BottomSheet>
        <BottomSheetTrigger asChild>
          <button
            className="relative w-full overflow-hidden rounded-[16px] border border-ktr-border-light bg-ktr-surface-card px-[14px] py-3 text-left"
            type="button"
          >
            <div className="relative flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">
                Website Profil Sekolah
              </h3>
              <p className="pt-0.5 text-right text-[14px] font-medium leading-[20px] text-ktr-text-primary">
                XII - Pemrograman Web
              </p>
            </div>

            <div className="relative mt-2 flex items-center gap-3 text-[14px] leading-[22px]">
              <span className="font-medium text-ktr-text-primary">Kelompok 3</span>
              <span className="flex items-center gap-1 text-[13px] text-ktr-primary">
                <HugeiconsIcon icon={UserGroupIcon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                6 anggota
              </span>
            </div>

            <div className="relative mt-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium leading-4">
                <span className="flex items-center gap-1 text-ktr-primary">
                  <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                  20 Juni 2026
                </span>
                <span className="flex items-center gap-1 text-ktr-info">
                  <HugeiconsIcon icon={Flag01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                  Sedang Berjalan
                </span>
              </div>
              <div className="flex shrink-0 -space-x-2">
                {members.map((color, index) => (
                  <span
                    key={color}
                    className="size-6 rounded-full border border-ktr-surface-card"
                    style={{ background: `linear-gradient(135deg, ${color}, var(--ktr-surface-bg-app))` }}
                    aria-label={`Anggota ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </button>
        </BottomSheetTrigger>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle>Detail Proyek</BottomSheetTitle>
            <BottomSheetDescription>
              Website Profil Sekolah sedang berjalan bersama Kelompok 3. Gunakan area ini nanti untuk detail proyek dari desain final.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <BottomSheetFooter>
            <Button
              className="w-full"
              type="button"
              onClick={() =>
                toast.success("Proyek dibuka", {
                  description: "Detail proyek siswa akan memakai bottom sheet.",
                })
              }
            >
              Lanjutkan Proyek
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </Button>
            <BottomSheetClose asChild>
              <Button className="w-full" variant="outline" type="button">
                Tutup
              </Button>
            </BottomSheetClose>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheet>
    </section>
  );
}
