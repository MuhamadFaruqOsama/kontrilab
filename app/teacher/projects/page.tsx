"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert01Icon,
  ArchiveIcon,
  Calendar03Icon,
  CheckListIcon,
  Copy01Icon,
  Edit01Icon,
  Folder01Icon,
  MoreVerticalCircle01Icon,
  PlusSignIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@heroui/react/card";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { teacherProjects } from "@/components/teacher/mock-data";

export default function ProjectsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("semua");
  const [archiveTarget, setArchiveTarget] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = teacherProjects.filter((p) => {
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.className.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "semua" ||
      (statusFilter === "aktif" && p.status === "Aktif") ||
      (statusFilter === "akan-datang" && p.status === "Akan Datang") ||
      (statusFilter === "selesai" && p.status === "Selesai") ||
      (statusFilter === "diarsipkan" && p.status === "Diarsipkan");
    return matchSearch && matchStatus;
  });

  function handleArchiveConfirm() {
    toast.success("Proyek diarsipkan", {
      description: `Proyek "${archiveTarget}" berhasil diarsipkan.`,
    });
    setArchiveTarget(null);
  }

  function handleDuplicate(name: string) {
    toast.success("Proyek diduplikat", {
      description: `Salinan "${name}" telah dibuat. Edit sesuai kebutuhan.`,
    });
  }

  return (
    <>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
              Proyek
            </h1>
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">
              Kelola semua proyek pembelajaran berbasis tugas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] bg-ktr-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover active:scale-[0.995]"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} />
            Buat Proyek
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            placeholder="Cari proyek atau kelas..."
            className="w-full lg:max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              className="w-40"
              ariaLabel="Filter status"
              defaultValue="semua"
              options={["Semua", "Aktif", "Akan Datang", "Selesai", "Diarsipkan"].map((label) => ({
                value: label.toLowerCase().replaceAll(" ", "-"),
                label,
              }))}
              onChange={(v) => setStatusFilter(v)}
            />
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-secondary">
          <span className="font-semibold text-ktr-text-primary">{filtered.length}</span>
          <span>proyek ditemukan</span>
          {filtered.some((p) => p.pendingUploadReviews + p.pendingFinalReviews > 0) && (
            <>
              <span className="mx-1 text-ktr-border-input">·</span>
              <span className="font-semibold text-ktr-warning">
                {filtered.reduce((t, p) => t + p.pendingUploadReviews + p.pendingFinalReviews, 0)}{" "}
                review tertunda
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onArchive={() => setArchiveTarget(project.name)}
              onDuplicate={() => handleDuplicate(project.name)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-ktr-border-light bg-ktr-surface-soft py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-[14px] bg-ktr-primary-light text-ktr-primary">
                <HugeiconsIcon icon={Folder01Icon} size={22} />
              </span>
              <p className="text-sm font-medium text-ktr-text-secondary">
                Tidak ada proyek yang cocok.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Archive confirm */}
      <ConfirmModal
        open={archiveTarget !== null}
        onOpenChange={(o) => !o && setArchiveTarget(null)}
        title="Arsipkan proyek ini?"
        description={`Proyek "${archiveTarget}" akan disembunyikan dari daftar aktif. Kamu bisa membatalkannya kapan saja.`}
        confirmText="Arsipkan"
        tone="danger"
        onConfirm={handleArchiveConfirm}
      />

      {/* Create project modal placeholder */}
      <ConfirmModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Buat Proyek Baru"
        description="Fitur pembuatan proyek lengkap akan tersedia di halaman ini. Untuk saat ini, arahkan ke form pembuatan proyek."
        confirmText="Buka Form"
        onConfirm={() => {
          setCreateOpen(false);
          toast.success("Mengarahkan ke form proyek…");
        }}
      />
    </>
  );
}

function ProjectCard({
  project,
  onArchive,
  onDuplicate,
}: {
  project: (typeof teacherProjects)[number];
  onArchive: () => void;
  onDuplicate: () => void;
}) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pendingReviews = project.pendingUploadReviews + project.pendingFinalReviews;

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <Card className="group rounded-[18px] border border-ktr-border-light bg-white transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.998]">
      <Card.Content className="relative p-5">
        <Link
          href={`/teacher/projects/${project.id}`}
          className="absolute inset-0 cursor-pointer rounded-[18px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ktr-primary/20"
          aria-label={`Lihat detail ${project.name}`}
        />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-ktr-primary-light text-ktr-text-primary">
              <HugeiconsIcon icon={Folder01Icon} size={21} strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-heading text-base font-semibold text-ktr-text-primary">
                {project.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{project.className}</p>
            </div>
          </div>

          <div ref={menuRef} className="pointer-events-auto relative">
            <button
              type="button"
              aria-label="Aksi proyek"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-[12px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft focus-visible:outline-none active:scale-[0.995]"
            >
              <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={18} strokeWidth={1.5} />
            </button>

            {moreOpen && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] z-30 w-44 rounded-[16px] border border-ktr-border-light bg-white p-1.5"
                role="menu"
              >
                <ProjectMenuItem
                  icon={Edit01Icon}
                  label="Edit"
                  onClick={() => {
                    setMoreOpen(false);
                    toast.success("Mode edit dibuka");
                  }}
                />
                <ProjectMenuItem
                  icon={Copy01Icon}
                  label="Duplikat"
                  onClick={() => {
                    setMoreOpen(false);
                    onDuplicate();
                  }}
                />
                <ProjectMenuItem
                  icon={ArchiveIcon}
                  label="Arsipkan"
                  onClick={() => {
                    setMoreOpen(false);
                    onArchive();
                  }}
                  danger
                />
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-6 space-y-3 text-sm font-medium">
          <InfoRow
            icon={CheckListIcon}
            label="Status"
            value={project.status}
            valueClassName={statusClassName(project.status)}
          />
          <InfoRow icon={Calendar03Icon} label="Deadline" value={project.finalDeadline} />
          <InfoRow
            icon={UserMultiple02Icon}
            label="Kelompok"
            value={`${project.groups} kelompok · ${project.students} siswa`}
          />
          <InfoRow
            icon={CheckListIcon}
            label="Review"
            value={pendingReviews > 0 ? `${pendingReviews} tertunda` : "Tidak ada"}
            valueClassName={pendingReviews > 0 ? "text-ktr-warning" : undefined}
          />
          <InfoRow
            icon={Alert01Icon}
            label="Perhatian"
            value={
              project.inactiveGroups > 0
                ? `${project.inactiveGroups} kelompok pasif`
                : "Aman"
            }
            valueClassName={project.inactiveGroups > 0 ? "text-ktr-warning" : "text-ktr-success"}
          />
        </div>

        {project.announcement && (
          <div className="pointer-events-none relative z-0 mt-5 rounded-[14px] bg-ktr-surface-soft px-4 py-3">
            <p className="text-xs font-medium leading-5 text-ktr-text-secondary">
              📌 {project.announcement}
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

function statusClassName(status: string) {
  if (status === "Aktif" || status === "Selesai") return "text-ktr-success";
  if (status === "Akan Datang") return "text-ktr-info";
  return "text-ktr-text-secondary";
}

function ProjectMenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 text-left text-sm font-semibold transition-colors hover:bg-ktr-surface-soft ${danger ? "text-ktr-project-need-attention" : "text-ktr-text-primary"}`}
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} aria-hidden="true" />
      {label}
    </button>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5 text-ktr-text-secondary">
        <HugeiconsIcon icon={icon} size={17} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </div>
      <span className={`shrink-0 text-right font-semibold ${valueClassName ?? "text-ktr-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}
