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

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUploads = uploadProgress.filter((item) => {
    const matchSearch =
      normalizedSearch === "" ||
      item.student.toLowerCase().includes(normalizedSearch) ||
      item.group.toLowerCase().includes(normalizedSearch) ||
      item.summary.toLowerCase().includes(normalizedSearch);
    const matchFilter =
      uploadFilter === "semua" ||
      item.status.toLowerCase().replaceAll(" ", "-") === uploadFilter;
    return matchSearch && matchFilter;
  });

  const filteredFinals = finalSubmissions.filter((item) => {
    const matchSearch =
      normalizedSearch === "" ||
      item.group.toLowerCase().includes(normalizedSearch) ||
      item.file.toLowerCase().includes(normalizedSearch);
    const matchFilter =
      finalFilter === "semua" ||
      item.status.toLowerCase().replaceAll(" ", "-") === finalFilter;
    return matchSearch && matchFilter;
  });

  const pendingCount =
    uploadProgress.filter((u) => u.status === "Belum Direview").length +
    finalSubmissions.filter((f) => f.status === "Menunggu Review").length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
            Review
          </h1>
          <p className="mt-1 text-sm font-medium text-ktr-text-secondary">
            Tinjau bukti kerja siswa dan hasil akhir kelompok.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-[14px] border border-ktr-warning/25 bg-ktr-warning-bg px-4 py-2.5">
            <HugeiconsIcon icon={Clock01Icon} size={16} className="shrink-0 text-ktr-warning" />
            <span className="text-sm font-semibold text-[#9a620b]">
              {pendingCount} item menunggu review
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ktr-text-secondary">
          <HugeiconsIcon icon={Search01Icon} size={17} />
        </span>
        <input
          type="text"
          placeholder="Cari siswa, kelompok, atau ringkasan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full max-w-md rounded-[14px] border border-ktr-border-light bg-white py-2 pl-11 pr-4 text-sm text-ktr-text-primary placeholder:text-ktr-text-secondary hover:border-ktr-border-input focus:border-ktr-primary focus:outline-none focus:ring-3 focus:ring-ktr-primary/15"
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        {/* Upload Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                Upload Progress
              </h2>
              <span className="rounded-full bg-ktr-primary-light px-3 py-1 text-xs font-semibold text-ktr-primary">
                {filteredUploads.length} item
              </span>
            </div>
            <FilterSelect
              className="w-48"
              ariaLabel="Filter upload"
              defaultValue="semua"
              options={uploadStatusFilters}
              onChange={setUploadFilter}
            />
          </div>
          <Card className="overflow-hidden rounded-[18px] border border-ktr-border-light bg-white">
            <Card.Content className="divide-y divide-ktr-border-light p-0">
              {filteredUploads.length > 0 ? (
                filteredUploads.map((item) => (
                  <Link
                    key={item.id}
                    href={`/teacher/review/${item.id}`}
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ktr-surface-soft/70 active:scale-[0.998]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-ktr-text-primary">{item.student}</p>
                        {item.status === "Valid" && (
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="shrink-0 text-ktr-success" />
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">
                        {item.group} · {item.evidenceType} · {item.time}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-ktr-text-tertiary">{item.summary}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-xs font-semibold text-ktr-primary">Buka →</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">
                  Tidak ada upload yang cocok.
                </div>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Submit Final */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                Submit Final
              </h2>
              <span className="rounded-full bg-ktr-primary-light px-3 py-1 text-xs font-semibold text-ktr-primary">
                {filteredFinals.length} item
              </span>
            </div>
            <FilterSelect
              className="w-48"
              ariaLabel="Filter submit"
              defaultValue="semua"
              options={finalStatusFilters}
              onChange={setFinalFilter}
            />
          </div>
          <Card className="overflow-hidden rounded-[18px] border border-ktr-border-light bg-white">
            <Card.Content className="divide-y divide-ktr-border-light p-0">
              {filteredFinals.length > 0 ? (
                filteredFinals.map((item) => (
                  <Link
                    key={item.id}
                    href={`/teacher/review/${item.id}`}
                    className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-ktr-surface-soft/70 active:scale-[0.998]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ktr-text-primary">{item.group}</p>
                      <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">
                        {item.file}
                      </p>
                      <p className="mt-1 text-xs text-ktr-text-tertiary">{item.submittedAt} · {item.members}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-xs font-semibold text-ktr-primary">Buka →</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">
                  Tidak ada submit final yang cocok.
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  );
}
