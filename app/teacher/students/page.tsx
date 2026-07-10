"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, EyeIcon } from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";

const mockStudents = [
  { id: 1, name: "Bima Aditya Pratama", class: "XII RPL 1", project: "Website Profil Sekolah", group: "Kelompok 1", progress: "2 unggahan", peerAss: "Selesai", status: "Tercatat Baik" },
  { id: 2, name: "Raka Maulana Yusuf", class: "XII RPL 1", project: "Website Profil Sekolah", group: "Kelompok 1", progress: "1 unggahan", peerAss: "Selesai", status: "Tercatat Baik" },
  { id: 3, name: "Nadia Safira Lestari", class: "XII RPL 1", project: "Website Profil Sekolah", group: "Kelompok 1", progress: "0 unggahan", peerAss: "Selesai", status: "Cukup Terlihat" },
  { id: 4, name: "Alya Putri Ramadhani", class: "XI Desain Web", project: "Landing Page UMKM", group: "Kelompok 2", progress: "3 unggahan", peerAss: "Belum", status: "Perlu Ditinjau" },
  { id: 5, name: "Dimas Fajar Nugroho", class: "XI Desain Web", project: "Landing Page UMKM", group: "Kelompok 2", progress: "0 unggahan", peerAss: "Selesai", status: "Belum Cukup Data" },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-ktr-text-primary tracking-tight">Siswa</h1>
      </div>

      {/* Filters (No border frame) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2">
        {/* Search Bar - di kiri */}
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Cari nama siswa..." />
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
              { value: "XI Desain Web", label: "XI Desain Web" },
            ]}
          />
          <FilterSelect
            className="w-44"
            ariaLabel="Filter Proyek"
            defaultValue="all-projects"
            options={[
              { value: "all-projects", label: "Semua Proyek" },
              { value: "Website Profil Sekolah", label: "Website Profil Sekolah" },
              { value: "Landing Page UMKM", label: "Landing Page UMKM" },
            ]}
          />
          <FilterSelect
            className="w-40"
            ariaLabel="Filter Status"
            defaultValue="all-status"
            options={[
              { value: "all-status", label: "Semua Status" },
              { value: "Tercatat Baik", label: "Tercatat Baik" },
              { value: "Cukup Terlihat", label: "Cukup Terlihat" },
              { value: "Perlu Ditinjau", label: "Perlu Ditinjau" },
            ]}
          />
          <Button variant="outline" className="border-ktr-border-light shadow-none px-3 min-w-10 h-10">
            <HugeiconsIcon icon={FilterIcon} size={18} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-none border border-ktr-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-ktr-surface-soft text-ktr-text-tertiary font-medium border-b border-ktr-border-light">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Siswa</th>
                <th className="px-6 py-4 font-medium">Kelas</th>
                <th className="px-6 py-4 font-medium">Proyek Aktif</th>
                <th className="px-6 py-4 font-medium">Kelompok</th>
                <th className="px-6 py-4 text-center font-medium">Progres</th>
                <th className="px-6 py-4 text-center font-medium">Peer Ass.</th>
                <th className="px-6 py-4 text-center font-medium">Status Kontribusi</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ktr-border-light">
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-ktr-surface-soft/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-ktr-text-primary">{student.name}</td>
                  <td className="px-6 py-4 text-ktr-text-tertiary">{student.class}</td>
                  <td className="px-6 py-4 text-ktr-text-tertiary">{student.project}</td>
                  <td className="px-6 py-4 text-ktr-text-tertiary">{student.group}</td>
                  <td className="px-6 py-4 text-center text-ktr-text-tertiary">{student.progress}</td>
                  <td className="px-6 py-4 text-center text-ktr-text-tertiary">{student.peerAss}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/teacher/students/${student.id}`} className="p-2 inline-flex text-ktr-text-tertiary hover:text-ktr-primary hover:bg-ktr-primary-soft rounded-md transition-colors" title="Lihat Detail">
                      <HugeiconsIcon icon={EyeIcon} size={16} />
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
