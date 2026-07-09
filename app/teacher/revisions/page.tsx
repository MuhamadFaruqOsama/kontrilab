"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  EyeIcon, 
  FilterIcon,
  RefreshIcon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";

const mockRevisions = [
  { id: 1, project: "Aplikasi Kas Sederhana", group: "Kelompok 4", note: "Tambahkan fitur export PDF dan perbaiki UI form transaksi.", deadline: "2026-07-25", status: "Sedang Diperbaiki" },
  { id: 2, project: "Landing Page UMKM", group: "Kelompok 2", note: "Logo belum responsif di mobile view.", deadline: "2026-07-16", status: "Dikirim Ulang" },
  { id: 3, project: "Website Profil Sekolah", group: "Kelompok 3", note: "Lengkapi data dummy di halaman galeri.", deadline: "2026-07-10", status: "Selesai" },
];

export default function RevisionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Revisi Proyek</h1>
      </div>

      {/* Filters (No border frame) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2">
        {/* Search Bar - di kiri */}
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Cari proyek atau kelompok..." />
        </div>

        {/* Filters - di kanan */}
        <div className="flex w-full sm:w-auto flex-wrap items-center justify-end gap-3">
          <FilterSelect
            className="w-44"
            ariaLabel="Filter Proyek"
            defaultValue="all-projects"
            options={[
              { value: "all-projects", label: "Semua Proyek" },
              { value: "Aplikasi Kas Sederhana", label: "Aplikasi Kas Sederhana" },
              { value: "Landing Page UMKM", label: "Landing Page UMKM" },
            ]}
          />
          <FilterSelect
            className="w-40"
            ariaLabel="Filter Status"
            defaultValue="all-status"
            options={[
              { value: "all-status", label: "Semua Status" },
              { value: "Sedang Diperbaiki", label: "Sedang Diperbaiki" },
              { value: "Dikirim Ulang", label: "Dikirim Ulang" },
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
                <th className="px-6 py-4 font-medium w-1/3">Catatan Revisi</th>
                <th className="px-6 py-4 font-medium">Deadline Revisi</th>
                <th className="px-6 py-4 text-center font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-100">
              {mockRevisions.map((rev) => (
                <tr key={rev.id} className="hover:bg-default-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{rev.project}</td>
                  <td className="px-6 py-4 text-default-500">{rev.group}</td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-2 text-xs text-default-500">{rev.note}</p>
                  </td>
                  <td className="px-6 py-4 text-default-500">{rev.deadline}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={rev.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rev.status === "Dikirim Ulang" ? (
                        <Link 
                          href={`/teacher/tinjauan/${rev.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-warning/10 px-4 text-xs font-medium text-warning hover:bg-warning/20 transition-colors"
                        >
                          <HugeiconsIcon icon={RefreshIcon} size={14} className="mr-1.5" />
                          Tinjau Ulang
                        </Link>
                      ) : (
                        <Link 
                          href="/teacher/projects/1/groups/1"
                          className="p-2 inline-flex text-default-500 hover:text-primary hover:bg-primary-50 rounded-md transition-colors"
                          title="Lihat Progres Grup"
                        >
                          <HugeiconsIcon icon={EyeIcon} size={16} />
                        </Link>
                      )}
                    </div>
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
