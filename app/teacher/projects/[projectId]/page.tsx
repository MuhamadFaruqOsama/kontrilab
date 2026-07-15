"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CheckListIcon,
  ClipboardPasteIcon,
  Copy01Icon,
  Delete02Icon,
  Edit01Icon,
  FileAttachmentIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import TeacherBackButton from "@/components/teacher/BackButton";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { getProject, teacherGroups } from "@/components/teacher/mock-data";

type DrawerMode = "brief" | "edit" | null;

type EditProjectDraft = {
  title: string;
  startDate: string;
  deadline: string;
  description: string;
  className: string;
  attachmentName: string;
};

type TeacherProjectRecord = {
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
  attachmentName?: string;
};

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function ProjectDetail() {
  const params = useParams<{ projectId: string }>();
  const fallbackProject = React.useMemo(() => normalizeProject(getProject(params.projectId)), [params.projectId]);
  const [project, setProject] = React.useState<TeacherProjectRecord>(fallbackProject);
  const groups = React.useMemo(() => teacherGroups.filter((group) => group.projectId === project.id), [project.id]);
  const [loading, setLoading] = React.useState(true);
  const [drawer, setDrawer] = React.useState<DrawerMode>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [discardOpen, setDiscardOpen] = React.useState(false);
  const projectCode = `KTR-${project.id.padStart(3, "0")}`;
  const initialEditDraft = React.useMemo<EditProjectDraft>(() => ({
    title: project.name,
    startDate: displayDateToInputValue(project.startDate),
    deadline: displayDateToInputValue(project.finalDeadline),
    description: project.description || project.announcement || "",
    className: project.className,
    attachmentName: project.attachmentName ?? "",
  }), [project.announcement, project.attachmentName, project.className, project.description, project.finalDeadline, project.name, project.startDate]);
  const [editDraft, setEditDraft] = React.useState<EditProjectDraft>(initialEditDraft);
  const isEditDraftDirty =
    editDraft.title !== initialEditDraft.title ||
    editDraft.startDate !== initialEditDraft.startDate ||
    editDraft.deadline !== initialEditDraft.deadline ||
    editDraft.description !== initialEditDraft.description ||
    editDraft.className !== initialEditDraft.className ||
    editDraft.attachmentName !== initialEditDraft.attachmentName;

  React.useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      setLoading(true);
      try {
        const response = await fetch("/api/teacher/projects", { cache: "no-store" });
        if (!response.ok) throw new Error("Gagal mengambil data proyek.");
        const data = await response.json();
        const found = Array.isArray(data) ? data.find((item) => String(item.id) === String(params.projectId)) : null;
        if (!cancelled) setProject(found ? normalizeProject(found) : fallbackProject);
      } catch {
        if (!cancelled) setProject(fallbackProject);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProject();
    return () => {
      cancelled = true;
    };
  }, [fallbackProject, params.projectId]);

  function copyProjectCode() {
    void navigator.clipboard?.writeText(projectCode);
    toast.success("Kode proyek disalin", { description: projectCode });
  }

  function shareProject() {
    const url = `${window.location.origin}/teacher/projects/${project.id}`;
    void navigator.clipboard?.writeText(url);
    toast.success("Link proyek disalin", { description: "Link siap dibagikan." });
  }

  function requestCloseDrawer() {
    if (drawer === "edit" && isEditDraftDirty) {
      setDiscardOpen(true);
      return;
    }
    setDrawer(null);
  }

  async function submitEditProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = editDraft.title.trim();
    if (!title) {
      toast.danger("Judul proyek wajib diisi");
      return;
    }

    try {
      const response = await fetch("/api/teacher/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          title,
          className: editDraft.className.trim(),
          description: editDraft.description.trim(),
          dueDate: editDraft.deadline,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa disimpan.");

      const found = Array.isArray(data) ? data.find((item) => String(item.id) === String(project.id)) : null;
      const nextProject = found
        ? normalizeProject({ ...found, attachmentName: editDraft.attachmentName })
        : normalizeProject({
            ...project,
            name: title,
            className: editDraft.className.trim(),
            dueDateInput: editDraft.deadline,
            finalDeadline: editDraft.deadline ? formatDateInput(editDraft.deadline) : project.finalDeadline,
            description: editDraft.description.trim(),
            announcement: editDraft.description.trim(),
            attachmentName: editDraft.attachmentName,
          });

      setProject(nextProject);
      setDrawer(null);
      toast.success("Perubahan proyek disimpan", { description: nextProject.name });
    } catch (error) {
      toast.danger("Gagal menyimpan proyek", { description: error instanceof Error ? error.message : "Coba lagi sebentar lagi." });
    }
  }
  function confirmDeleteProject() {
    setDeleteOpen(false);
    toast.success("Proyek dihapus", { description: "Perubahan contoh sudah diproses di UI." });
  }

  if (loading) return <ProjectDetailSkeleton />;

  return (
    <>
      <div className="space-y-7">
        <div className="space-y-5">
          <TeacherBackButton href="/teacher/projects" label="Kembali ke daftar proyek" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold">
                <span className={project.status === "Aktif" ? "text-ktr-success" : project.status === "Selesai" ? "text-ktr-info" : "text-ktr-warning"}>{project.status}</span>
                <MetadataSeparator />
                <ProjectHeaderMeta label={project.className} />
                <MetadataSeparator />
                <ProjectHeaderMeta icon={Calendar03Icon} label={project.startDate} />
                <MetadataSeparator />
                <ProjectHeaderMeta icon={CheckListIcon} label={project.finalDeadline} />
              </div>
              <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">{project.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <button
                type="button"
                onClick={copyProjectCode}
                className="inline-flex h-10 cursor-pointer items-center gap-3 rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input active:scale-[0.997]"
              >
                <span>{projectCode}</span>
                <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={2} />
              </button>
              <TextAction icon={ClipboardPasteIcon} label="Project Brief" onClick={() => setDrawer("brief")} />
              <IconAction icon={Edit01Icon} label="Edit proyek" onClick={() => { setEditDraft(initialEditDraft); setDrawer("edit"); }} />
              <IconAction icon={Share01Icon} label="Bagikan proyek" onClick={shareProject} />
              <IconAction icon={Delete02Icon} label="Hapus proyek" onClick={() => setDeleteOpen(true)} danger />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const leader = group.members[0] ?? "Belum ada ketua";
            return (
              <Link key={group.id} href={`/teacher/projects/${project.id}/groups/${group.id}`} className="group block cursor-pointer rounded-[12px] border border-ktr-border-light bg-white p-5 transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.998]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-heading text-lg font-semibold text-ktr-text-primary">{group.name}</h2>
                    <p className="mt-1 text-sm font-medium text-ktr-text-secondary">Ketua: {leader}</p>
                  </div>
                  <span className={group.status === "Aktif" ? "shrink-0 text-sm font-semibold text-ktr-success" : group.status === "Selesai" ? "shrink-0 text-sm font-semibold text-ktr-info" : "shrink-0 text-sm font-semibold text-ktr-warning"}>{group.status}</span>
                </div>

                <div className="mt-5 space-y-3 text-sm font-medium">
                  <GroupInfo label="Anggota" value={`${group.members.length} siswa`} />
                  <GroupInfo label="Upload terakhir" value={group.latestUpload} />
                  <GroupInfo label="Review" value={group.pendingReviews > 0 ? `${group.pendingReviews} tertunda` : "Tidak ada"} valueClassName={group.pendingReviews > 0 ? "text-ktr-warning" : undefined} />
                  <GroupInfo label="Submit final" value={group.submitStatus} valueClassName={group.submitStatus === "Menunggu Review" || group.submitStatus === "Perlu Revisi" ? "text-ktr-warning" : undefined} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <ProjectDrawer open={drawer === "brief"} title="Project Brief" onClose={requestCloseDrawer}>
        <div className="space-y-7 text-sm leading-6 text-ktr-text-secondary">
          <BriefSection title="Deskripsi atau soal">
            <p className="text-ktr-text-primary">{project.description || project.announcement || "Belum ada deskripsi proyek."}</p>
          </BriefSection>

          <BriefSection title="Jadwal dan konteks">
            <div className="flex flex-wrap gap-2">
              <BriefMeta label={project.className} />
              <BriefMeta icon={Calendar03Icon} label={`Mulai ${project.startDate}`} />
              <BriefMeta icon={CheckListIcon} label={`Deadline ${project.finalDeadline}`} />
              <BriefMeta label={`${groups.length} kelompok`} />
            </div>
          </BriefSection>

          <BriefSection title="Lampiran">
            <div className="flex items-start gap-3 rounded-[12px] border border-ktr-border-light px-4 py-3">
              <HugeiconsIcon icon={FileAttachmentIcon} size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-ktr-text-primary" />
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-ktr-text-primary">{project.attachmentName || "Belum ada lampiran"}</p>
                <p className="text-ktr-text-secondary">{project.attachmentName ? "Lampiran proyek dari data proyek." : "Lampiran proyek akan tampil di sini setelah ditambahkan lewat edit proyek."}</p>
              </div>
            </div>
          </BriefSection>
        </div>
      </ProjectDrawer>

      <ProjectDrawer open={drawer === "edit"} title="Edit Proyek" onClose={requestCloseDrawer}>
        <form className="space-y-6" onSubmit={submitEditProject}>
          <TeacherField label="Judul proyek" value={editDraft.title} placeholder="Masukkan judul proyek" onChange={(value) => setEditDraft((current) => ({ ...current, title: value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TeacherDateField label="Mulai" value={editDraft.startDate} placeholder="Pilih tanggal mulai" onChange={(value) => setEditDraft((current) => ({ ...current, startDate: value }))} />
            <TeacherDateField label="Deadline" value={editDraft.deadline} placeholder="Pilih deadline" onChange={(value) => setEditDraft((current) => ({ ...current, deadline: value }))} />
          </div>
          <label className="block text-sm font-semibold text-ktr-text-primary">
            <span className="mb-2 block">Deskripsi atau soal</span>
            <textarea
              value={editDraft.description}
              placeholder="Tuliskan arahan, konteks, atau soal proyek"
              onChange={(event) => setEditDraft((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              className="w-full resize-none rounded-[10px] border border-ktr-border-light bg-white px-3 py-2.5 text-sm leading-6 text-ktr-text-primary outline-none transition-colors placeholder:text-[13px] placeholder:font-normal placeholder:text-ktr-text-tertiary hover:border-ktr-border-input focus:border-ktr-text-primary"
            />
          </label>
          <TeacherField label="Kelas" value={editDraft.className} placeholder="Contoh: X Informatika" onChange={(value) => setEditDraft((current) => ({ ...current, className: value }))} />
          <TeacherFileField value={editDraft.attachmentName} onChange={(value) => setEditDraft((current) => ({ ...current, attachmentName: value }))} />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={requestCloseDrawer} className="h-10 rounded-[10px] border border-ktr-border-light bg-white text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input">Batal</button>
            <button type="submit" className="h-10 rounded-[10px] bg-ktr-text-primary text-sm font-semibold text-ktr-text-white transition-colors hover:bg-ktr-text-primary/95">Simpan</button>
          </div>
        </form>
      </ProjectDrawer>

      <ConfirmModal
        theme="teacher"
        tone="danger"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus proyek?"
        description="Proyek yang dihapus tidak akan muncul lagi di daftar guru."
        confirmText="Hapus"
        onConfirm={confirmDeleteProject}
      />
      <ConfirmModal
        theme="teacher"
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        title="Batalkan perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        confirmText="Batalkan"
        onConfirm={() => { setDiscardOpen(false); setDrawer(null); }}
      />
    </>
  );
}

function normalizeProject(project: Partial<Omit<TeacherProjectRecord, "status">> & { name?: string; title?: string; status?: string; finalDeadline?: string; dueDateInput?: string; description?: string; announcement?: string }): TeacherProjectRecord {
  const name = project.name || project.title || "Proyek";
  const finalDeadline = project.finalDeadline || (project.dueDateInput ? formatDateInput(project.dueDateInput) : "Belum ditentukan");
  const startDate = project.startDate || "Belum ditentukan";
  const description = project.description || project.announcement || "";
  const status = project.status === "Aktif" || project.status === "Selesai" || project.status === "Diarsipkan" ? project.status : "Aktif";

  return {
    id: String(project.id ?? ""),
    name,
    className: project.className || "Belum ada kelas",
    status,
    startDate,
    finalDeadline,
    dueDateInput: project.dueDateInput || displayDateToInputValue(finalDeadline),
    description,
    groups: project.groups ?? 0,
    students: project.students ?? 0,
    individualUploads: project.individualUploads ?? 0,
    pendingUploadReviews: project.pendingUploadReviews ?? 0,
    pendingFinalReviews: project.pendingFinalReviews ?? 0,
    inactiveGroups: project.inactiveGroups ?? 0,
    announcement: project.announcement || description,
    attachmentName: project.attachmentName || "",
  };
}
function MetadataSeparator() {
  return <span className="size-1 rounded-full bg-ktr-text-tertiary/45" aria-hidden="true" />;
}

function ProjectHeaderMeta({ icon, label }: { icon?: IconSvgElement; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ktr-text-secondary">
      {icon ? <HugeiconsIcon icon={icon} size={14} strokeWidth={2} className="text-ktr-text-primary" /> : null}
      {label}
    </span>
  );
}

function TextAction({ icon, label, onClick }: { icon: IconSvgElement; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input active:scale-[0.997]">
      <HugeiconsIcon icon={icon} size={16} strokeWidth={2} />
      {label}
    </button>
  );
}

function IconAction({ icon, label, onClick, danger = false }: { icon: IconSvgElement; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("inline-flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-ktr-border-light bg-white transition-colors hover:border-ktr-border-input active:scale-[0.997]", danger ? "text-ktr-project-need-attention" : "text-ktr-text-primary")}>
      <HugeiconsIcon icon={icon} size={17} strokeWidth={2} />
    </button>
  );
}

function GroupInfo({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
      <span className="truncate text-ktr-text-secondary">{label}</span>
      <span className={`shrink-0 text-right font-semibold ${valueClassName ?? "text-ktr-text-primary"}`}>{value}</span>
    </div>
  );
}

function BriefSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-ktr-text-primary">{title}</h3>
      {children}
    </section>
  );
}

function BriefMeta({ icon, label }: { icon?: IconSvgElement; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-ktr-border-light px-3 py-1.5 text-sm font-semibold text-ktr-text-primary">
      {icon ? <HugeiconsIcon icon={icon} size={15} strokeWidth={2} className="text-ktr-text-primary" /> : null}
      {label}
    </span>
  );
}

function TeacherField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-semibold text-ktr-text-primary">
      <span className="mb-2 block">{label}</span>
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
function TeacherDateField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
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
    <div ref={fieldRef} className="relative text-left text-sm font-semibold text-ktr-text-primary">
      <span className="mb-2 block">{label}</span>
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
            <button type="button" aria-label="Bulan sebelumnya" className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] text-ktr-text-primary hover:bg-ktr-surface-soft" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
            </button>
            <p className="text-sm font-semibold text-ktr-text-primary">{monthNames[month]} {year}</p>
            <button type="button" aria-label="Bulan berikutnya" className="flex size-8 cursor-pointer items-center justify-center rounded-[10px] text-ktr-text-primary hover:bg-ktr-surface-soft" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
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

function TeacherFileField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputId = React.useId();
  const [dragActive, setDragActive] = React.useState(false);

  function handleFile(file?: File) {
    if (file) onChange(file.name);
  }

  return (
    <div className="text-left text-sm font-semibold text-ktr-text-primary">
      <span className="mb-2 block">Lampiran</span>
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
      <input id={inputId} type="file" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} />
    </div>
  );
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

function displayDateToInputValue(value: string) {
  const [dayPart, monthPart, yearPart] = value.trim().split(/\s+/);
  const day = Number(dayPart);
  const month = monthNames.findIndex((name) => name.toLowerCase() === monthPart?.toLowerCase());
  const year = Number(yearPart);
  if (!day || month < 0 || !year) return "";
  return dateToInputValue(new Date(year, month, day));
}
function ProjectDrawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Tutup drawer" onClick={onClose} className={cn("absolute inset-0 bg-ktr-neutral-1000/20 transition-opacity duration-200", "opacity-100")} />
      <aside className={cn("absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-ktr-border-light bg-white p-5 text-ktr-text-primary transition-transform duration-200", "translate-x-0")}>
        <div className="flex items-center justify-between gap-4 border-b border-ktr-border-light pb-4">
          <h2 className="font-heading text-xl font-semibold text-ktr-text-primary">{title}</h2>
          <button type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-[10px] text-ktr-text-secondary transition-colors hover:bg-ktr-surface-soft hover:text-ktr-text-primary" aria-label="Tutup">
            x
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto py-7">{children}</div>
      </aside>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <div className="teacher-skeleton h-10 w-12" />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-3 flex gap-2">
              <div className="teacher-skeleton h-5 w-20" />
              <div className="teacher-skeleton h-5 w-28" />
              <div className="teacher-skeleton h-5 w-28" />
            </div>
            <div className="teacher-skeleton h-10 w-72" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="teacher-skeleton h-10 w-32" />
            <div className="teacher-skeleton h-10 w-32" />
            <div className="teacher-skeleton size-10" />
            <div className="teacher-skeleton size-10" />
            <div className="teacher-skeleton size-10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-[12px] border border-ktr-border-light bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="teacher-skeleton h-6 w-28" />
                <div className="teacher-skeleton mt-2 h-4 w-32" />
              </div>
              <div className="teacher-skeleton h-5 w-16" />
            </div>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, row) => (
                <div key={row} className="flex items-center justify-between gap-5">
                  <div className="teacher-skeleton h-4 w-24" />
                  <div className="teacher-skeleton h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
