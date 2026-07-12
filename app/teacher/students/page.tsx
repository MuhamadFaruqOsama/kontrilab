"use client";

import * as React from "react";
import Link from "next/link";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";
import StatusBadge from "@/components/teacher/StatusBadge";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { teacherStudents, type ActivityStatus } from "@/components/teacher/mock-data";

const semesterOptions = [
  "Semester Genap 2026",
  "Semester Ganjil 2025",
  "Semester Genap 2025",
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

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [activityFilter, setActivityFilter] = React.useState("semua");
  const [semesterFilter, setSemesterFilter] = React.useState("semester-genap-2026");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleActivityFilterChange = (value: string) => {
    setActivityFilter(value);
    setPage(1);
  };

  const selectedSemesterLabel = semesterOptions.find((option) => option.value === semesterFilter)?.label ?? "Semester";

  const filtered = teacherStudents
    .filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch = q === "" || s.name.toLowerCase().includes(q) || s.activeProject.toLowerCase().includes(q);
      const matchActivity = activityFilter === "semua" || s.status.toLowerCase().replaceAll(" ", "-") === activityFilter;
      return matchSearch && matchActivity;
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const needAttention = filtered.filter((s) => s.status === "Perlu Perhatian" || s.status === "Tidak Ada Aktivitas Terbaru").length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleStudents = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, filtered.length);

  function handleExportCsv() {
    const headers = ["Nama", "Status", "Terakhir Upload", "Feedback", "Semester"];
    const rows = filtered.map((student) => [student.name, student.status, student.latestUpload, student.feedbackResponse, selectedSemesterLabel]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `siswa-${semesterFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <StudentsPageSkeleton />;

  return (
    <div className="space-y-7">
      <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">Siswa</h1>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput className="w-full lg:max-w-sm" placeholder="Cari nama siswa" value={search} onChange={handleSearchChange} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <FilterSelect className="w-full sm:w-44" ariaLabel="Filter aktivitas" defaultValue="semua" options={statusOptions} onChange={handleActivityFilterChange} />
          <FilterSelect className="w-full sm:w-56" ariaLabel="Pilih semester export" defaultValue="semester-genap-2026" options={semesterOptions} onChange={setSemesterFilter} />
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex h-10 w-auto shrink-0 cursor-pointer items-center justify-center gap-2 self-start whitespace-nowrap rounded-[10px] border border-ktr-text-primary bg-ktr-text-primary px-4 text-sm font-semibold text-ktr-text-white transition-colors hover:bg-ktr-text-primary/95 active:scale-[0.997] sm:self-auto"
          >
            <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={2} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-medium text-ktr-text-secondary"><span className="font-semibold text-ktr-text-primary">{filtered.length}</span> siswa ditemukan</span>
        {needAttention > 0 ? (
          <>
            <span className="size-1 rounded-full bg-ktr-text-tertiary/35" aria-hidden="true" />
            <span className="font-semibold text-ktr-warning">{needAttention} perlu perhatian</span>
          </>
        ) : null}
      </div>

      <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
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
              {visibleStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-4 font-semibold text-ktr-text-primary">{student.name}</td>
                  <td className="px-5 py-4"><StatusBadge status={student.status} /></td>
                  <td className="px-5 py-4 text-ktr-text-secondary">{student.latestUpload}</td>
                  <td className="px-5 py-4 text-ktr-text-secondary">{student.feedbackResponse}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/teacher/students/${student.id}`} className="inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-[10px] border border-ktr-border-light px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input active:scale-[0.995]">
                      Lihat detail
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ktr-text-secondary">Tidak ada siswa yang cocok dengan pencarian.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-ktr-text-secondary">
          Menampilkan <span className="font-semibold text-ktr-text-primary">{rangeStart}-{rangeEnd}</span> dari <span className="font-semibold text-ktr-text-primary">{filtered.length}</span> siswa
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] px-1 text-sm font-semibold text-ktr-text-primary transition-colors hover:text-ktr-text-secondary disabled:cursor-not-allowed disabled:text-ktr-text-disabled">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={pageNumber === currentPage ? "inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-ktr-text-primary bg-ktr-text-primary text-sm font-semibold text-ktr-text-white" : "inline-flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input"}>
                {pageNumber}
              </button>
            );
          })}
          <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] px-1 text-sm font-semibold text-ktr-text-primary transition-colors hover:text-ktr-text-secondary disabled:cursor-not-allowed disabled:text-ktr-text-disabled">
            Berikutnya
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentsPageSkeleton() {
  return (
    <div className="space-y-7">
      <div className="teacher-skeleton h-9 w-28" />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="teacher-skeleton h-10 w-full lg:max-w-sm" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="teacher-skeleton h-10 w-full sm:w-44" />
          <div className="teacher-skeleton h-10 w-full sm:w-56" />
          <div className="teacher-skeleton h-10 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="teacher-skeleton h-5 w-36" />
        <div className="teacher-skeleton size-1 rounded-full" />
        <div className="teacher-skeleton h-5 w-28" />
      </div>
      <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
        <div className="border-b border-ktr-border-light bg-ktr-surface-soft px-5 py-4">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_120px] gap-6">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="teacher-skeleton h-4 w-24" />)}
          </div>
        </div>
        <div className="divide-y divide-ktr-border-light px-5">
          {Array.from({ length: PAGE_SIZE }).map((_, row) => (
            <div key={row} className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_120px] items-center gap-6 py-4">
              <div className="teacher-skeleton h-5 w-32" />
              <div className="teacher-skeleton h-4 w-28" />
              <div className="teacher-skeleton h-4 w-24" />
              <div className="teacher-skeleton h-4 w-36" />
              <div className="teacher-skeleton ml-auto h-9 w-28" />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="teacher-skeleton h-5 w-52" />
        <div className="flex items-center gap-2">
          <div className="teacher-skeleton h-9 w-28" />
          <div className="teacher-skeleton size-9" />
          <div className="teacher-skeleton size-9" />
          <div className="teacher-skeleton h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

