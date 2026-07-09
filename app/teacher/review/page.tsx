"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  EyeIcon, 
  FilterIcon 
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";

const mockSubmissions = [
  { id: 1, project: "Website Profil Sekolah", group: "Kelompok 1", submitDate: "2026-07-18", finalResult: "school-profile.zip", status: "Menunggu Tinjauan" },
  { id: 2, project: "Landing Page UMKM", group: "Kelompok 2", submitDate: "2026-07-14", finalResult: "https://umkm-landing.vercel.app", status: "Menunggu Tinjauan" },
  { id: 3, project: "Aplikasi Kas Sederhana", group: "Kelompok 4", submitDate: "2026-07-12", finalResult: "app-kas-v2.apk", status: "Revisi" },
];

export default function TinjauanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Tinjau Proyek</h1>
      </div>

      {/* Filters (No border frame) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2">
        {/* Search Bar - diletakkan di kiri */}
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Cari proyek..." />
        </div>

        {/* Filters - diletakkan di kanan */}
        <div className="flex w-full sm:w-auto flex-wrap items-center justify-end gap-3">
          <FilterSelect
            className="w-40"
            ariaLabel="Filter Proyek"
            defaultValue="all-projects"
            options={[
              { value: "all-projects", label: "Semua Proyek" },
              { value: "Website Profil Sekolah", label: "Website Profil Sekolah" },
              { value: "Landing Page UMKM", label: "Landing Page UMKM" },
            ]}
          />
          <FilterSelect
            className="w-48"
            ariaLabel="Filter Status"
            defaultValue="all-status"
            options={[
              { value: "all-status", label: "Semua Status Tinjauan" },
              { value: "Menunggu Tinjauan", label: "Menunggu Tinjauan" },
              { value: "Revisi", label: "Revisi" },
              { value: "Selesai", label: "Selesai" },
            ]}
          />
          <Button variant="outline" className="border-default-200 shadow-none px-3 min-w-10 h-10">
            <HugeiconsIcon icon={FilterIcon} size={18} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-none border border-default-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-default-50 text-default-500 font-medium border-b border-default-200">
              <tr>
                <th className="px-6 py-4 font-medium">Proyek</th>
                <th className="px-6 py-4 font-medium">Kelompok</th>
                <th className="px-6 py-4 font-medium">Tanggal Kirim</th>
                <th className="px-6 py-4 font-medium">Hasil Akhir</th>
                <th className="px-6 py-4 text-center font-medium">Status Tinjauan</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-100">
              {mockSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-default-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{sub.project}</td>
                  <td className="px-6 py-4 text-default-500">{sub.group}</td>
                  <td className="px-6 py-4 text-default-500">{sub.submitDate}</td>
                  <td className="px-6 py-4">
                    {sub.finalResult.startsWith('http') ? (
                      <a href={sub.finalResult} target="_blank" rel="noreferrer" className="text-primary hover:underline">{sub.finalResult}</a>
                    ) : (
                      <span className="text-foreground">{sub.finalResult}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/teacher/tinjauan/${sub.id}`} className="inline-flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                      <HugeiconsIcon icon={EyeIcon} size={14} className="mr-2" />
                      Tinjau Proyek
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
