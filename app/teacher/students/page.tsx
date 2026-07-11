"use client";

import * as React from "react";
import Link from "next/link";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";
import StatusBadge from "@/components/teacher/StatusBadge";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { teacherStudents, type ActivityStatus } from "@/components/teacher/mock-data";

const projectOptions = [
  "Semua Proyek",
  "Website Profil Sekolah",
  "Landing Page UMKM",
  "Poster Kampanye Digital",
].map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));

const statusOptions = [
  "Semua",
  "Sangat Aktif",
  "Aktif",
  "Perlu Perhatian",
  "Tidak Ada Aktivitas Terbaru",
].map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));

const statusOrder: Record<ActivityStatus, number> = {
  "Tidak Ada Aktivitas Terbaru": 0,
  "Perlu Perhatian": 1,
  Aktif: 2,
  "Sangat Aktif": 3,
};

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");
  const [activityFilter, setActivityFilter] = React.useState("semua");
  const [projectFilter, setProjectFilter] = React.useState("semua-proyek");

  const filtered = teacherStudents
    .filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.activeProject.toLowerCase().includes(q);
      const matchActivity =
        activityFilter === "semua" ||
        s.status.toLowerCase().replaceAll(" ", "-") === activityFilter;
      const matchProject =
        projectFilter === "semua-proyek" ||
        s.activeProject.toLowerCase().replaceAll(" ", "-") === projectFilter;
      return matchSearch && matchActivity && matchProject;
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const needAttention = filtered.filter(
    (s) => s.status === "Perlu Perhatian" || s.status === "Tidak Ada Aktivitas Terbaru"
  ).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
          Siswa
        </h1>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Cari nama siswa"
          className="w-full lg:max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <FilterSelect
            className="w-full sm:w-52"
            ariaLabel="Filter aktivitas"
            defaultValue="semua"
            options={statusOptions}
            onChange={setActivityFilter}
          />
          <FilterSelect
            className="w-full sm:w-56"
            ariaLabel="Filter proyek"
            defaultValue="semua-proyek"
            options={projectOptions}
            onChange={setProjectFilter}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium text-ktr-text-secondary">
          <span className="font-semibold text-ktr-text-primary">{filtered.length}</span> siswa ditemukan
        </span>
        {needAttention > 0 && (
          <span className="text-xs font-semibold text-ktr-warning">
            {needAttention} perlu perhatian
          </span>
        )}
      </div>

      <Card className="overflow-hidden rounded-[18px] border border-ktr-border-light bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ktr-border-light bg-ktr-surface-soft text-ktr-text-secondary">
              <tr>
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Terakhir Upload</th>
                <th className="px-5 py-3 font-semibold">Feedback</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ktr-border-light">
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-white"
                >
                  <td className="px-5 py-4 font-semibold text-ktr-text-primary">{student.name}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-5 py-4 text-ktr-text-secondary">{student.latestUpload}</td>
                  <td className="px-5 py-4 text-ktr-text-secondary">{student.feedbackResponse}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[10px] border border-ktr-border-light px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input hover:bg-ktr-primary-light active:scale-[0.995]"
                    >
                      Lihat detail
                      <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={1.5} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ktr-text-secondary">
                    Tidak ada siswa yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
