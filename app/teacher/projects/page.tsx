"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert01Icon,
  Delete02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckListIcon,
  Copy01Icon,
  Edit01Icon,
  FileAttachmentIcon,
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
  status: "Aktif" | "Selesai" | "Diarsipkan";
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
  startDate: string;
  dueDate: string;
  description: string;
  className: string;
  attachmentName: string;
};

const emptyDraft: ProjectDraft = {
  title: "",
  startDate: "",
  dueDate: "",
  description: "",
  className: "",
  attachmentName: "",
};

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function ProjectsPage() {
  return (
    <React.Suspense fallback={null}>
      <ProjectsPageContent />
    </React.Suspense>
  );
}

function ProjectsPageContent() {
  const [projects, setProjects] = React.useState<TeacherProjectCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("semua");
  const [archiveTarget, setArchiveTarget] = React.useState<TeacherProjectCard | null>(null);
  const [formMode, setFormMode] = React.useState<"create" | "edit" | null>(null);
  const [discardFormOpen, setDiscardFormOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<ProjectDraft>(emptyDraft);
  const [draftBaseline, setDraftBaseline] = React.useState<ProjectDraft>(emptyDraft);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  React.useEffect(() => {
    if (searchParams.get("create") !== "1") return;
    openCreateForm();
    router.replace("/teacher/projects", { scroll: false });
  }, [router, searchParams]);
  const filtered = projects.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchSearch = query === "" || p.name.toLowerCase().includes(query) || p.className.toLowerCase().includes(query);
    const matchStatus =
      statusFilter === "semua" ||
      (statusFilter === "aktif" && p.status === "Aktif") ||
      (statusFilter === "selesai" && p.status === "Selesai") ||
      (statusFilter === "diarsipkan" && p.status === "Diarsipkan");
    return matchSearch && matchStatus;
  });

  const isDraftDirty = !areDraftsEqual(draft, draftBaseline);

  function requestCloseForm() {
    if (formMode && isDraftDirty) {
      setDiscardFormOpen(true);
      return;
    }
    setFormMode(null);
    setDraft(emptyDraft);
    setDraftBaseline(emptyDraft);
  }

  function confirmDiscardForm() {
    setDiscardFormOpen(false);
    setFormMode(null);
    setDraft(emptyDraft);
    setDraftBaseline(emptyDraft);
  }

  function openCreateForm() {
    setDraft(emptyDraft);
    setDraftBaseline(emptyDraft);
    setFormMode("create");
  }

  function openEditForm(project: TeacherProjectCard) {
    const nextDraft = {
      id: project.id,
      title: project.name,
      startDate: displayDateToInputValue(project.startDate),
      className: project.className === "Belum ada kelompok" ? "" : project.className,
      dueDate: project.dueDateInput,
      description: project.description,
      attachmentName: "",
    };
    setDraft(nextDraft);
    setDraftBaseline(nextDraft);
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
      setFormMode(null);
      setDraft(emptyDraft);
      setDraftBaseline(emptyDraft);
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
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa dihapus.");
      setProjects(Array.isArray(data) ? data : []);
      toast.success("Proyek dihapus", {
        description: `Proyek "${archiveTarget.name}" sudah dihapus dari daftar aktif Supabase.`,
      });
    } catch (error) {
      toast.danger("Gagal menghapus proyek", {
        description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
      });
    } finally {
      setArchiveTarget(null);
    }
  }

  function copyProjectCode(project: TeacherProjectCard) {
    const projectCode = `KTR-${project.id.padStart(3, "0")}`;
    void navigator.clipboard?.writeText(projectCode);
    toast.success("Kode proyek disalin", { description: projectCode });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <ProjectsHeaderSkeleton />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <ProjectGridSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">Proyek</h1>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            placeholder="Cari proyek"
            className="w-full lg:max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <FilterSelect
              className="w-full sm:w-40"
              ariaLabel="Filter status"
              defaultValue="semua"
              options={["Semua", "Aktif", "Selesai", "Diarsipkan"].map((label) => ({
                value: label.toLowerCase().replaceAll(" ", "-"),
                label,
              }))}
              onChange={(v) => setStatusFilter(v)}
            />
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-ktr-text-primary bg-ktr-text-primary px-4 text-sm font-semibold text-ktr-text-white transition-[background-color,transform] hover:bg-ktr-text-primary/95 active:scale-[0.997]"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
              Buat Proyek
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-secondary">
          <span className="font-semibold text-ktr-text-primary">{filtered.length}</span>
          <span>proyek ditemukan</span>
          {filtered.some((p) => p.pendingUploadReviews + p.pendingFinalReviews > 0) && (
            <>
              <span className="mx-1 size-1 rounded-full bg-ktr-text-tertiary/35" aria-hidden="true" />
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
              onCopyCode={() => copyProjectCode(project)}
              onEdit={() => openEditForm(project)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-[12px] border border-dashed border-ktr-border-light bg-white py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-[10px] text-ktr-text-primary">
                <HugeiconsIcon icon={Folder01Icon} size={22} strokeWidth={2} />
              </span>
              <p className="text-sm font-medium text-ktr-text-secondary">Belum ada proyek dari Supabase.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        theme="teacher"
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Hapus proyek ini?"
        description={`Proyek "${archiveTarget?.name ?? ""}" akan dihapus dari daftar aktif beserta data turunannya sesuai relasi Supabase.`}
        confirmText="Hapus"
        tone="danger"
        onConfirm={() => void handleArchiveConfirm()}
      />

      <ConfirmModal
        theme="teacher"
        open={formMode !== null}
        onOpenChange={(open) => {
          if (!open) requestCloseForm();
        }}
        title={formMode === "edit" ? "Edit Proyek" : "Buat Proyek"}
        description="Isi data utama proyek. Detail tambahan bisa dilengkapi setelah proyek dibuat."
        confirmText={formMode === "edit" ? "Simpan" : "Buat"}
        closeOnConfirm={false}
        onConfirm={() => void submitProjectForm()}
      >
        <div className="space-y-4">
          <ProjectField label="Judul proyek" value={draft.title} placeholder="Masukkan judul proyek" onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ProjectDateField label="Mulai" value={draft.startDate} placeholder="Pilih tanggal mulai" onChange={(value) => setDraft((current) => ({ ...current, startDate: value }))} />
            <ProjectDateField label="Deadline" value={draft.dueDate} placeholder="Pilih deadline" onChange={(value) => setDraft((current) => ({ ...current, dueDate: value }))} />
          </div>
          <label className="block text-left">
            <span className="mb-2 block text-xs font-semibold text-ktr-text-primary">Deskripsi atau soal</span>
            <textarea
              value={draft.description}
              placeholder="Tuliskan arahan, konteks, atau soal proyek"
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              className="min-h-24 w-full resize-none rounded-[10px] border border-ktr-border-light bg-white px-3 py-2 text-sm leading-6 text-ktr-text-primary outline-none transition-colors placeholder:text-[13px] placeholder:font-normal placeholder:text-ktr-text-tertiary hover:border-ktr-border-input focus:border-ktr-text-primary"
            />
          </label>
          <ProjectField label="Kelas" value={draft.className} placeholder="Contoh: XI - Desain Web" onChange={(value) => setDraft((current) => ({ ...current, className: value }))} />
          <ProjectFileField value={draft.attachmentName} onChange={(value) => setDraft((current) => ({ ...current, attachmentName: value }))} />
        </div>
      </ConfirmModal>

      <ConfirmModal
        theme="teacher"
        open={discardFormOpen}
        onOpenChange={setDiscardFormOpen}
        title="Batalkan pengisian?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmText="Ya, batalkan"
        cancelText="Lanjut isi"
        tone="danger"
        onConfirm={confirmDiscardForm}
      />
    </>
  );
}

function ProjectsHeaderSkeleton() {
  return (
    <>
      <div className="teacher-skeleton h-9 w-32" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="teacher-skeleton h-10 w-full lg:max-w-sm" />
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="teacher-skeleton h-10 w-full sm:w-40" />
          <div className="teacher-skeleton h-10 w-full sm:w-36" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="teacher-skeleton h-5 w-32" />
        <div className="teacher-skeleton h-5 w-28" />
      </div>
    </>
  );
}

function ProjectGridSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="rounded-[12px] border border-ktr-border-light bg-white">
          <Card.Content className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="teacher-skeleton h-5 w-44" />
                <div className="teacher-skeleton mt-3 h-4 w-28" />
              </div>
              <div className="teacher-skeleton size-9 rounded-[10px]" />
            </div>
            <div className="mt-7 space-y-4">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex items-center justify-between gap-4">
                  <div className="teacher-skeleton h-4 w-24" />
                  <div className="teacher-skeleton h-4 w-28" />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      ))}
    </>
  );
}

function ProjectCard({
  project,
  onArchive,
  onCopyCode,
  onEdit,
}: {
  project: TeacherProjectCard;
  onArchive: () => void;
  onCopyCode: () => void;
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
    <Card className="group rounded-[12px] border border-ktr-border-light bg-white transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.998]">
      <Card.Content className="relative p-5">
        <Link
          href={`/teacher/projects/${project.id}`}
          className="absolute inset-0 cursor-pointer rounded-[12px] focus-visible:outline-none focus-visible:border-ktr-text-primary"
          aria-label={`Lihat detail ${project.name}`}
        />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-base font-semibold text-ktr-text-primary">{project.name}</h2>
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{project.className}</p>
          </div>

          <div ref={menuRef} className="pointer-events-auto relative">
            <button
              type="button"
              aria-label="Aksi proyek"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-[12px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft focus-visible:outline-none active:scale-[0.997]"
            >
              <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={18} strokeWidth={2} />
            </button>

            {moreOpen && (
              <div className="teacher-dropdown-popover absolute right-0 top-[calc(100%+8px)] z-30 w-44 rounded-[12px] border border-ktr-border-light bg-white p-1" role="menu">
                <ProjectMenuItem icon={Edit01Icon} label="Edit" onClick={() => { setMoreOpen(false); onEdit(); }} />
                <ProjectMenuItem icon={Copy01Icon} label="Copy kode" onClick={() => { setMoreOpen(false); onCopyCode(); }} />
                <ProjectMenuItem icon={Delete02Icon} label="Hapus" onClick={() => { setMoreOpen(false); onArchive(); }} />
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-7 space-y-4 text-sm font-medium">
          <InfoRow icon={CheckListIcon} label="Status" value={project.status} valueClassName={statusClassName(project.status)} />
          <InfoRow icon={Calendar03Icon} label="Deadline" value={project.finalDeadline} />
          <InfoRow icon={UserMultiple02Icon} label="Kelompok" value={`${project.groups} kelompok`} />
          <InfoRow icon={CheckListIcon} label="Review" value={pendingReviews > 0 ? `${pendingReviews} tertunda` : "Tidak ada"} valueClassName={pendingReviews > 0 ? "text-ktr-warning" : undefined} />
          <InfoRow
            icon={Alert01Icon}
            label="Perhatian"
            value={project.inactiveGroups > 0 ? `${project.inactiveGroups} kelompok pasif` : "Aman"}
            valueClassName={project.inactiveGroups > 0 ? "text-ktr-warning" : "text-ktr-success"}
          />
        </div>
      </Card.Content>
    </Card>
  );
}

function statusClassName(status: string) {
  if (status === "Aktif" || status === "Selesai") return "text-ktr-success";
  return "text-ktr-text-secondary";
}

function ProjectMenuItem({ icon, label, onClick }: { icon: IconSvgElement; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 text-left text-sm font-semibold text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={2} aria-hidden="true" />
      {label}
    </button>
  );
}

function InfoRow({ icon, label, value, valueClassName }: { icon: IconSvgElement; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
      <div className="flex min-w-0 items-center gap-2.5 text-ktr-text-secondary">
        <HugeiconsIcon icon={icon} size={17} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </div>
      <span className={`shrink-0 text-right font-semibold ${valueClassName ?? "text-ktr-text-primary"}`}>{value}</span>
    </div>
  );
}

function ProjectField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-xs font-semibold text-ktr-text-primary">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm text-ktr-text-primary outline-none transition-colors placeholder:text-[13px] placeholder:font-normal placeholder:text-ktr-text-tertiary hover:border-ktr-border-input focus:border-ktr-text-primary"
      />
    </label>
  );
}

function ProjectDateField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(() => dateInputToDate(value) ?? new Date());
  const [alignRight, setAlignRight] = React.useState(false);
  const fieldRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!fieldRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectedDate = dateInputToDate(value);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  return (
    <div ref={fieldRef} className="relative text-left">
      <span className="mb-2 block text-xs font-semibold text-ktr-text-primary">{label}</span>
      <button
        type="button"
        onClick={() => {
          const rect = fieldRef.current?.getBoundingClientRect();
          setAlignRight(Boolean(rect && rect.left + 280 > window.innerWidth - 16));
          setOpen((current) => !current);
        }}
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-ktr-border-light bg-white px-3 text-left text-sm font-medium text-ktr-text-primary outline-none transition-colors hover:border-ktr-border-input focus:border-ktr-text-primary"
      >
        <span className={value ? "text-ktr-text-primary" : "text-[13px] font-normal text-ktr-text-tertiary"}>{value ? formatDateInput(value) : placeholder}</span>
        <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={2} className="text-ktr-text-primary" />
      </button>

      {open ? (
        <div className={alignRight ? "teacher-dropdown-popover absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-[12px] border border-ktr-border-light bg-white p-3" : "teacher-dropdown-popover absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-[12px] border border-ktr-border-light bg-white p-3"}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <button type="button" className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] text-ktr-text-primary hover:bg-ktr-surface-soft" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
            </button>
            <p className="text-sm font-semibold text-ktr-text-primary">{monthNames[month]} {year}</p>
            <button type="button" className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] text-ktr-text-primary hover:bg-ktr-surface-soft" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ktr-text-tertiary">
            {dayNames.map((day) => <span key={day} className="py-1">{day}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              const date = day ? new Date(year, month, day) : null;
              const inputValue = date ? dateToInputValue(date) : "";
              const active = selectedDate && date && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
              return day ? (
                <button
                  key={inputValue}
                  type="button"
                  onClick={() => {
                    onChange(inputValue);
                    setOpen(false);
                  }}
                  className={active ? "flex h-8 cursor-pointer items-center justify-center rounded-[10px] bg-ktr-text-primary text-xs font-semibold text-ktr-text-white" : "flex h-8 cursor-pointer items-center justify-center rounded-[10px] text-xs font-semibold text-ktr-text-primary hover:bg-ktr-surface-soft"}
                >
                  {day}
                </button>
              ) : <span key={`blank-${index}`} />;
            })}
          </div>
          <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="mt-3 h-8 w-full cursor-pointer rounded-[10px] text-xs font-semibold text-ktr-text-secondary hover:bg-ktr-surface-soft">Kosongkan</button>
        </div>
      ) : null}
    </div>
  );
}

function ProjectFileField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputId = React.useId();
  const [dragActive, setDragActive] = React.useState(false);

  function handleFile(file?: File) {
    if (file) onChange(file.name);
  }

  return (
    <div className="text-left">
      <span className="mb-2 block text-xs font-semibold text-ktr-text-primary">Lampiran</span>
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={dragActive ? "flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-ktr-text-primary bg-ktr-surface-soft px-4 py-4 text-center transition-colors" : "flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-ktr-border-input bg-white px-4 py-4 text-center transition-colors hover:border-ktr-text-primary hover:bg-ktr-surface-soft/50"}
      >
        <HugeiconsIcon icon={FileAttachmentIcon} size={18} strokeWidth={2} className="text-ktr-text-primary" />
        <span className={value ? "mt-2 max-w-full truncate text-sm font-semibold text-ktr-text-primary" : "mt-2 text-[13px] font-normal text-ktr-text-tertiary"}>
          {value || "Klik atau drag lampiran ke sini"}
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
function areDraftsEqual(first: ProjectDraft, second: ProjectDraft) {
  return first.id === second.id &&
    first.title === second.title &&
    first.startDate === second.startDate &&
    first.dueDate === second.dueDate &&
    first.description === second.description &&
    first.className === second.className &&
    first.attachmentName === second.attachmentName;
}

function displayDateToInputValue(value: string) {
  const match = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/);
  if (!match) return value || "";
  const day = match[1].padStart(2, "0");
  const monthIndex = monthNames.findIndex((month) => month.toLowerCase() === match[2].toLowerCase());
  if (monthIndex < 0) return "";
  return `${match[3]}-${String(monthIndex + 1).padStart(2, "0")}-${day}`;
}
function dateInputToDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function dateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateInput(value: string) {
  const date = dateInputToDate(value);
  if (!date) return value;
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
