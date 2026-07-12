"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Clock01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import FilterSelect from "@/components/teacher/FilterSelect";
import { finalSubmissions, uploadProgress } from "@/components/teacher/mock-data";

const uploadStatusFilters = [
  { value: "semua", label: "Semua" },
  { value: "belum-direview", label: "Belum Direview" },
  { value: "valid", label: "Valid" },
  { value: "perlu-klarifikasi", label: "Perlu Klarifikasi" },
  { value: "kurang-relevan", label: "Kurang Relevan" },
];

const finalStatusFilters = [
  { value: "semua", label: "Semua" },
  { value: "menunggu-review", label: "Menunggu Review" },
  { value: "perlu-revisi", label: "Perlu Revisi" },
  { value: "disetujui", label: "Disetujui" },
];

export default function ReviewPage() {
  const [search, setSearch] = React.useState("");
  const [uploadFilter, setUploadFilter] = React.useState("semua");
  const [finalFilter, setFinalFilter] = React.useState("semua");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUploads = uploadProgress.filter((item) => {
    const matchSearch = normalizedSearch === "" || item.student.toLowerCase().includes(normalizedSearch) || item.group.toLowerCase().includes(normalizedSearch) || item.summary.toLowerCase().includes(normalizedSearch);
    const matchFilter = uploadFilter === "semua" || item.status.toLowerCase().replaceAll(" ", "-") === uploadFilter;
    return matchSearch && matchFilter;
  });

  const filteredFinals = finalSubmissions.filter((item) => {
    const matchSearch = normalizedSearch === "" || item.group.toLowerCase().includes(normalizedSearch) || item.file.toLowerCase().includes(normalizedSearch);
    const matchFilter = finalFilter === "semua" || item.status.toLowerCase().replaceAll(" ", "-") === finalFilter;
    return matchSearch && matchFilter;
  });

  const pendingCount = uploadProgress.filter((u) => u.status === "Belum Direview").length + finalSubmissions.filter((f) => f.status === "Menunggu Review").length;

  if (loading) return <ReviewPageSkeleton />;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">Review</h1>
        {pendingCount > 0 ? (
          <div className="flex items-center gap-2 rounded-[12px] border border-ktr-warning/25 bg-ktr-warning-bg px-4 py-2.5">
            <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={2} className="shrink-0 text-ktr-warning" />
            <span className="text-sm font-semibold text-ktr-warning">{pendingCount} item menunggu review</span>
          </div>
        ) : null}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ktr-text-secondary">
          <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={2} />
        </span>
        <input
          type="text"
          placeholder="Cari siswa, kelompok, atau ringkasan..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 w-full max-w-md rounded-[10px] border border-ktr-border-light bg-white py-1.5 pl-10 pr-3.5 text-sm text-ktr-text-primary placeholder:text-ktr-text-secondary hover:border-ktr-border-input focus:border-ktr-text-primary focus:outline-none"
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <ReviewColumn title="Upload Progress" count={filteredUploads.length} filter={<FilterSelect className="w-48" ariaLabel="Filter upload" defaultValue="semua" options={uploadStatusFilters} onChange={setUploadFilter} />}>
          {filteredUploads.length > 0 ? (
            filteredUploads.map((item) => (
              <Link key={item.id} href={`/teacher/review/${item.id}`} className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ktr-surface-soft/40 active:scale-[0.998]">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-ktr-text-primary">{item.student}</p>
                    {item.status === "Valid" ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} strokeWidth={2} className="shrink-0 text-ktr-success" /> : null}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-ktr-text-secondary">
                    <span>{item.group}</span><DotSeparator /><span>{item.evidenceType}</span><DotSeparator /><span>{item.time}</span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-ktr-text-tertiary">{item.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-xs font-semibold text-ktr-text-primary">Buka</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">Tidak ada upload yang cocok.</div>
          )}
        </ReviewColumn>

        <ReviewColumn title="Submit Final" count={filteredFinals.length} filter={<FilterSelect className="w-48" ariaLabel="Filter submit" defaultValue="semua" options={finalStatusFilters} onChange={setFinalFilter} />}>
          {filteredFinals.length > 0 ? (
            filteredFinals.map((item) => (
              <Link key={item.id} href={`/teacher/review/${item.id}`} className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ktr-surface-soft/40 active:scale-[0.998]">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ktr-text-primary">{item.group}</p>
                  <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">{item.file}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ktr-text-tertiary"><span>{item.submittedAt}</span><DotSeparator /><span>{item.members}</span></p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-xs font-semibold text-ktr-text-primary">Buka</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">Tidak ada submit final yang cocok.</div>
          )}
        </ReviewColumn>
      </section>
    </div>
  );
}

function ReviewColumn({ title, count, filter, children }: { title: string; count: number; filter: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">{title}</h2>
          <span className="text-xs font-semibold text-ktr-text-primary">{count} item</span>
        </div>
        {filter}
      </div>
      <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
        <Card.Content className="divide-y divide-ktr-border-light p-0">{children}</Card.Content>
      </Card>
    </div>
  );
}

function DotSeparator() {
  return <span className="size-1 rounded-full bg-ktr-text-tertiary/35" aria-hidden="true" />;
}

function ReviewPageSkeleton() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="teacher-skeleton h-9 w-32" />
        <div className="teacher-skeleton h-10 w-56" />
      </div>
      <div className="teacher-skeleton h-10 w-full max-w-md" />
      <section className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, panel) => (
          <div key={panel} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="teacher-skeleton h-7 w-40" />
              <div className="teacher-skeleton h-10 w-48" />
            </div>
            <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((__, row) => (
                  <div key={row} className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="teacher-skeleton h-5 w-40" />
                      <div className="teacher-skeleton mt-2 h-4 w-64" />
                    </div>
                    <div className="teacher-skeleton h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

