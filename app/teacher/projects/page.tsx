"use client";

import * as React from "react";
import Link from "next/link";
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
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";

type TeacherProjectCard = {
  id: string;
  name: string;
  className: string;
  status: "Aktif" | "Akan Datang" | "Selesai" | "Diarsipkan";
  startDate: string;
  finalDeadline: string;
  dueDateInput: string;
  description: string;
  groups: number;
  students: number;
  individualUploads: number;
  pendingUploadReviews: number;
  pendingFinalReviews: number;
  inactiveGroups: number;
  announcement?: string;
};

type ProjectDraft = {
  id?: string;
  title: string;
  className: string;
  dueDate: string;
  description: string;
};

const emptyDraft: ProjectDraft = {
  title: "",
  className: "",
  dueDate: "",
  description: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<TeacherProjectCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("semua");
  const [archiveTarget, setArchiveTarget] = React.useState<TeacherProjectCard | null>(null);
  const [formMode, setFormMode] = React.useState<"create" | "edit" | null>(null);
  const [draft, setDraft] = React.useState<ProjectDraft>(emptyDraft);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        const response = await fetch("/api/teacher/projects", { cache: "no-store" });
        if (!response.ok) throw new Error("Gagal mengambil data proyek.");
        const data = await response.json();
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) {
          toast.danger("Data proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba muat ulang halaman.",
          });
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = projects.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchSearch = query === "" || p.name.toLowerCase().includes(query) || p.className.toLowerCase().includes(query);
    const matchStatus =
      statusFilter === "semua" ||
      (statusFilter === "aktif" && p.status === "Aktif") ||
      (statusFilter === "akan-datang" && p.status === "Akan Datang") ||
      (statusFilter === "selesai" && p.status === "Selesai") ||
      (statusFilter === "diarsipkan" && p.status === "Diarsipkan");
    return matchSearch && matchStatus;
  });

  function openCreateForm() {
    setDraft(emptyDraft);
    setFormMode("create");
  }

  function openEditForm(project: TeacherProjectCard) {
    setDraft({
      id: project.id,
      title: project.name,
      className: project.className === "Belum ada kelompok" ? "" : project.className,
      dueDate: project.dueDateInput,
      description: project.description,
    });
    setFormMode("edit");
  }

  async function submitProjectForm() {
    const title = draft.title.trim();
    if (!title) {
      toast.danger("Judul proyek wajib diisi");
      return;
    }

    try {
      const response = await fetch("/api/teacher/projects", {
        method: formMode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          title,
          className: draft.className.trim(),
          dueDate: draft.dueDate,
          description: draft.description.trim(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa disimpan.");
      setProjects(Array.isArray(data) ? data : []);
      toast.success(formMode === "edit" ? "Proyek diperbarui" : "Proyek dibuat", {
        description: formMode === "edit" ? "Perubahan tersimpan di Supabase." : "Data proyek baru tersimpan di Supabase.",
      });
    } catch (error) {
      toast.danger("Gagal menyimpan proyek", {
        description: error instanceof Error ? error.message : "Periksa koneksi Supabase lalu coba lagi.",
      });
    }
  }

  async function handleArchiveConfirm() {
    if (!archiveTarget) return;
    try {
      const response = await fetch(`/api/teacher/projects?id=${encodeURIComponent(archiveTarget.id)}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa diarsipkan.");
      setProjects(Array.isArray(data) ? data : []);
      toast.success("Proyek diarsipkan", {
        description: `Proyek "${archiveTarget.name}" sudah dilepas dari daftar aktif Supabase.`,
      });
    } catch (error) {
      toast.danger("Gagal mengarsipkan proyek", {
        description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
      });
    } finally {
      setArchiveTarget(null);
    }
  }

  async function handleDuplicate(project: TeacherProjectCard) {
    try {
      const response = await fetch("/api/teacher/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicateFromId: project.id }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa diduplikat.");
      setProjects(Array.isArray(data) ? data : []);
      toast.success("Proyek diduplikat", {
        description: `Salinan "${project.name}" tersimpan di Supabase.`,
      });
    } catch (error) {
      toast.danger("Gagal menduplikat proyek", {
        description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
      });
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">Proyek</h1>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] bg-ktr-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover active:scale-[0.995]"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} />
            Buat Proyek
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            placeholder="Cari proyek"
            className="w-full lg:max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FilterSelect
            className="w-full lg:w-40"
            ariaLabel="Filter status"
            defaultValue="semua"
            options={["Semua", "Aktif", "Akan Datang", "Selesai", "Diarsipkan"].map((label) => ({
              value: label.toLowerCase().replaceAll(" ", "-"),
              label,
            }))}
            onChange={(v) => setStatusFilter(v)}
          />
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-secondary">
          <span className="font-semibold text-ktr-text-primary">{filtered.length}</span>
          <span>proyek ditemukan</span>
          {filtered.some((p) => p.pendingUploadReviews + p.pendingFinalReviews > 0) && (
            <>
              <span className="mx-1 text-ktr-border-input">-</span>
              <span className="font-semibold text-ktr-warning">
                {filtered.reduce((t, p) => t + p.pendingUploadReviews + p.pendingFinalReviews, 0)} review tertunda
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onArchive={() => setArchiveTarget(project)}
              onDuplicate={() => void handleDuplicate(project)}
              onEdit={() => openEditForm(project)}
            />
          ))}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-ktr-border-light bg-white py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-[14px] text-ktr-text-primary">
                <HugeiconsIcon icon={Folder01Icon} size={22} strokeWidth={1.5} />
              </span>
              <p className="text-sm font-medium text-ktr-text-secondary">Belum ada proyek dari Supabase.</p>
            </div>
          )}
          {loading && (
            <div className="col-span-full rounded-[18px] border border-ktr-border-light bg-white px-5 py-12 text-center text-sm font-medium text-ktr-text-secondary">
              Memuat data proyek...
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Arsipkan proyek ini?"
        description={`Proyek "${archiveTarget?.name ?? ""}" akan dihapus dari daftar aktif beserta data turunannya sesuai relasi Supabase.`}
        confirmText="Arsipkan"
        tone="danger"
        onConfirm={() => void handleArchiveConfirm()}
      />

      <ConfirmModal
        open={formMode !== null}
        onOpenChange={(open) => {
          if (!open) setFormMode(null);
        }}
        title={formMode === "edit" ? "Edit Proyek" : "Buat Proyek"}
        description="Data tersimpan langsung ke Supabase. Isi seperlunya, detail lain bisa dilengkapi nanti."
        confirmText={formMode === "edit" ? "Simpan" : "Buat"}
        onConfirm={() => void submitProjectForm()}
      >
        <div className="space-y-3">
          <ProjectField label="Judul proyek" value={draft.title} placeholder="Masukkan judul proyek" onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
          <ProjectField label="Kelompok atau konteks" value={draft.className} placeholder="Contoh: Kelompok 1" onChange={(value) => setDraft((current) => ({ ...current, className: value }))} />
          <ProjectField label="Deadline" type="date" value={draft.dueDate} placeholder="Pilih deadline" onChange={(value) => setDraft((current) => ({ ...current, dueDate: value }))} />
          <label className="block space-y-1.5 text-left">
            <span className="text-xs font-semibold text-ktr-text-primary">Deskripsi</span>
            <textarea
              value={draft.description}
              placeholder="Tambahkan arahan singkat proyek"
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              className="min-h-24 w-full resize-none rounded-[14px] border border-ktr-border-light bg-white px-3 py-2 text-sm font-medium text-ktr-text-primary outline-none transition-colors placeholder:text-ktr-text-tertiary hover:border-ktr-border-input focus:border-ktr-primary focus:ring-3 focus:ring-ktr-primary/15"
            />
          </label>
        </div>
      </ConfirmModal>
    </>
  );
}

function ProjectCard({
  project,
  onArchive,
  onDuplicate,
  onEdit,
}: {
  project: TeacherProjectCard;
  onArchive: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
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
    <Card className="group rounded-[18px] border border-ktr-border-light bg-white transition-[border-color,transform] hover:border-ktr-primary/35 active:scale-[0.998]">
      <Card.Content className="relative p-5">
        <Link
          href={`/teacher/projects/${project.id}`}
          className="absolute inset-0 cursor-pointer rounded-[18px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ktr-primary/20"
          aria-label={`Lihat detail ${project.name}`}
        />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] text-ktr-text-primary">
              <HugeiconsIcon icon={Folder01Icon} size={21} strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-heading text-base font-semibold text-ktr-text-primary">{project.name}</h2>
              <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{project.className}</p>
            </div>
          </div>

          <div ref={menuRef} className="pointer-events-auto relative">
            <button
              type="button"
              aria-label="Aksi proyek"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-[12px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft focus-visible:outline-none active:scale-[0.995]"
            >
              <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={18} strokeWidth={1.5} />
            </button>

            {moreOpen && (
              <div className="teacher-dropdown-popover absolute right-0 top-[calc(100%+8px)] z-30 w-44 rounded-[16px] border border-ktr-border-light bg-white p-1.5" role="menu">
                <ProjectMenuItem icon={Edit01Icon} label="Edit" onClick={() => { setMoreOpen(false); onEdit(); }} />
                <ProjectMenuItem icon={Copy01Icon} label="Duplikat" onClick={() => { setMoreOpen(false); onDuplicate(); }} />
                <ProjectMenuItem icon={ArchiveIcon} label="Arsipkan" onClick={() => { setMoreOpen(false); onArchive(); }} danger />
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-6 space-y-3 text-sm font-medium">
          <InfoRow icon={CheckListIcon} label="Status" value={project.status} valueClassName={statusClassName(project.status)} />
          <InfoRow icon={Calendar03Icon} label="Deadline" value={project.finalDeadline} />
          <InfoRow icon={UserMultiple02Icon} label="Kelompok" value={`${project.groups} kelompok - ${project.students} siswa`} />
          <InfoRow icon={CheckListIcon} label="Review" value={pendingReviews > 0 ? `${pendingReviews} tertunda` : "Tidak ada"} valueClassName={pendingReviews > 0 ? "text-ktr-warning" : undefined} />
          <InfoRow
            icon={Alert01Icon}
            label="Perhatian"
            value={project.inactiveGroups > 0 ? `${project.inactiveGroups} kelompok pasif` : "Aman"}
            valueClassName={project.inactiveGroups > 0 ? "text-ktr-warning" : "text-ktr-success"}
          />
        </div>

        {project.announcement && (
          <div className="pointer-events-none relative z-0 mt-5 rounded-[14px] border border-ktr-border-light px-4 py-3">
            <p className="text-xs font-medium leading-5 text-ktr-text-secondary">{project.announcement}</p>
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
      <span className={`shrink-0 text-right font-semibold ${valueClassName ?? "text-ktr-text-primary"}`}>{value}</span>
    </div>
  );
}

function ProjectField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "date";
}) {
  return (
    <label className="block space-y-1.5 text-left">
      <span className="text-xs font-semibold text-ktr-text-primary">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[14px] border border-ktr-border-light bg-white px-3 text-sm font-medium text-ktr-text-primary outline-none transition-colors placeholder:text-ktr-text-tertiary hover:border-ktr-border-input focus:border-ktr-primary focus:ring-3 focus:ring-ktr-primary/15"
      />
    </label>
  );
}


