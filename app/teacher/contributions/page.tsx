"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  EyeIcon, 
  FilterIcon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";

const mockContributions = [
  { id: 1, name: "Bima Aditya Pratama", project: "Website Profil Sekolah", group: "Kelompok 1", discussion: 15, progress: 2, attachments: 1, peerAss: "Selesai", status: "Tercatat Baik", projectId: 1, groupId: 1 },
  { id: 2, name: "Raka Maulana Yusuf", project: "Website Profil Sekolah", group: "Kelompok 1", discussion: 12, progress: 1, attachments: 1, peerAss: "Selesai", status: "Tercatat Baik", projectId: 1, groupId: 1 },
  { id: 3, name: "Nadia Safira Lestari", project: "Website Profil Sekolah", group: "Kelompok 1", discussion: 5, progress: 0, attachments: 0, peerAss: "Selesai", status: "Cukup Terlihat", projectId: 1, groupId: 1 },
  { id: 4, name: "Alya Putri Ramadhani", project: "Landing Page UMKM", group: "Kelompok 2", discussion: 8, progress: 3, attachments: 2, peerAss: "Belum", status: "Perlu Ditinjau", projectId: 2, groupId: 2 },
];

export default function ContributionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Distribusi Kontribusi</h1>
        </div>
      </div>

      {/* Contribution Status Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-success-200 bg-success-50 p-4">
          <p className="text-sm font-medium text-success-800">Tercatat Baik</p>
          <p className="text-3xl font-bold font-heading mt-2 text-success-700">45</p>
        </div>
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
          <p className="text-sm font-medium text-primary-800">Cukup Terlihat</p>
          <p className="text-3xl font-bold font-heading mt-2 text-primary-700">24</p>
        </div>
        <div className="rounded-xl border border-warning-200 bg-warning-50 p-4">
          <p className="text-sm font-medium text-warning-800">Perlu Ditinjau</p>
          <p className="text-3xl font-bold font-heading mt-2 text-warning-700">12</p>
        </div>
        <div className="rounded-xl border border-default-200 bg-default-50 p-4">
          <p className="text-sm font-medium text-default-800">Belum Cukup Data</p>
          <p className="text-3xl font-bold font-heading mt-2 text-default-700">3</p>
        </div>
      </div>

      {/* Filters (No border frame) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2">
        {/* Search Bar - di kiri */}
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Cari siswa atau proyek..." />
        </div>

        {/* Filters - di kanan */}
        <div className="flex w-full sm:w-auto flex-wrap items-center justify-end gap-3">
          <FilterSelect
            className="w-36"
            ariaLabel="Filter Kelas"
            defaultValue="all-classes"
            options={[
              { value: "all-classes", label: "Semua Kelas" },
              { value: "XII RPL 1", label: "XII RPL 1" },
            ]}
          />
          <FilterSelect
            className="w-44"
            ariaLabel="Filter Proyek"
            defaultValue="all-projects"
            options={[
              { value: "all-projects", label: "Semua Proyek" },
              { value: "Website Profil Sekolah", label: "Website Profil Sekolah" },
            ]}
          />
          <FilterSelect
            className="w-40"
            ariaLabel="Filter Status"
            defaultValue="all-status"
            options={[
              { value: "all-status", label: "Semua Status" },
              { value: "Tercatat Baik", label: "Tercatat Baik" },
              { value: "Perlu Ditinjau", label: "Perlu Ditinjau" },
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
                <th className="px-6 py-4 font-medium">Nama Siswa</th>
                <th className="px-6 py-4 font-medium">Proyek</th>
                <th className="px-6 py-4 font-medium">Kelompok</th>
                <th className="px-6 py-4 text-center font-medium">Diskusi</th>
                <th className="px-6 py-4 text-center font-medium">Progress</th>
                <th className="px-6 py-4 text-center font-medium">Lampiran</th>
                <th className="px-6 py-4 text-center font-medium">Peer Ass.</th>
                <th className="px-6 py-4 text-center font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-100">
              {mockContributions.map((c) => (
                <tr key={c.id} className="hover:bg-default-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-default-500">{c.project}</td>
                  <td className="px-6 py-4 text-default-500">{c.group}</td>
                  <td className="px-6 py-4 text-center text-default-500">{c.discussion}</td>
                  <td className="px-6 py-4 text-center text-default-500">{c.progress}</td>
                  <td className="px-6 py-4 text-center text-default-500">{c.attachments}</td>
                  <td className="px-6 py-4 text-center text-default-500">{c.peerAss}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/teacher/students/${c.id}`} className="p-2 inline-flex text-default-500 hover:text-primary hover:bg-primary-50 rounded-md transition-colors" title="Lihat Detail Siswa">
                        <HugeiconsIcon icon={EyeIcon} size={16} />
                      </Link>
                      <Link href={`/teacher/projects/${c.projectId}/groups/${c.groupId}`} className="p-2 inline-flex text-default-500 hover:text-primary hover:bg-primary-50 rounded-md transition-colors" title="Lihat Detail Kelompok">
                        <HugeiconsIcon icon={UserGroupIcon} size={16} />
                      </Link>
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
