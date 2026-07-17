"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Calendar03Icon,
  CheckListIcon,
  FileAttachmentIcon,
  Folder01Icon,
  MoreVerticalCircle01Icon,
  Copy01Icon,
  PlusSignIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@heroui/react/card";

import { AppFormField } from "@/components/ui/app-form-field";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { useNProgress } from "@/components/ui/nprogress";
import { supabase } from "@/lib/supabase/client";

type TeacherProjectCard = {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  deadlineLabel: string;
  fileName: string | null;
  createdAt: string;
  status: "Aktif" | "Selesai" | "Diarsipkan";
  groups: number;
  students: number;
};

type ProjectsResponse = {
  projects: TeacherProjectCard[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type MergeProjectOption = {
  id: string;
  title: string;
  deadlineLabel: string;
};

type MergeProjectCard = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  projectCount: number;
  groupCount: number;
  finishedGroups: number;
  students: number;
  projectIds: string[];
  projects: Array<{
    id: string;
    title: string;
    className: string;
    status: "Aktif" | "Selesai";
    deadlineLabel: string;
    groups: number;
    finishedGroups: number;
    students: number;
  }>;
};

type MergedProjectsResponse = {
  merges: MergeProjectCard[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type DraftState = {
  title: string;
  description: string;
  deadline: string;
  fileName: string;
};

type MergeDraftState = {
  title: string;
  description: string;
  projectIds: string[];
};

const emptyDraft: DraftState = {
  title: "",
  description: "",
  deadline: "",
  fileName: "",
};

const emptyMergeDraft: MergeDraftState = {
  title: "",
  description: "",
  projectIds: [""],
};

const formatNumber = new Intl.NumberFormat("id-ID");

export default function ProjectsPage() {
  return (
    <React.Suspense fallback={null}>
      <ProjectsPageContent />
    </React.Suspense>
  );
}

function ProjectsPageContent() {
  const { start, done } = useNProgress();

  const [projects, setProjects] = React.useState<TeacherProjectCard[]>([]);
  const [projectLoading, setProjectLoading] = React.useState(true);
  const [projectPage, setProjectPage] = React.useState(1);
  const [projectPageSize, setProjectPageSize] = React.useState(6);
  const [projectTotalItems, setProjectTotalItems] = React.useState(0);
  const [projectTotalPages, setProjectTotalPages] = React.useState(1);

  const [mergedProjects, setMergedProjects] = React.useState<MergeProjectCard[]>([]);
  const [mergedLoading, setMergedLoading] = React.useState(true);
  const [mergedPage, setMergedPage] = React.useState(1);
  const [mergedPageSize, setMergedPageSize] = React.useState(6);
  const [mergedTotalItems, setMergedTotalItems] = React.useState(0);
  const [mergedTotalPages, setMergedTotalPages] = React.useState(1);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [draft, setDraft] = React.useState<DraftState>(emptyDraft);

  const [mergeOpen, setMergeOpen] = React.useState(false);
  const [mergeSubmitting, setMergeSubmitting] = React.useState(false);
  const [mergeDraft, setMergeDraft] = React.useState<MergeDraftState>(emptyMergeDraft);
  const [mergeOptions, setMergeOptions] = React.useState<MergeProjectOption[]>([]);
  const [mergeOptionsLoading, setMergeOptionsLoading] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<TeacherProjectCard | null>(null);

  async function getAuthHeaders() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  React.useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setProjectLoading(true);
      start();

      try {
        const response = await fetch(`/api/teacher/projects?page=${projectPage}`, {
          cache: "no-store",
          headers: await getAuthHeaders(),
        });
        const data = (await response.json().catch(() => null)) as ProjectsResponse & { error?: string } | null;
        if (!response.ok) throw new Error(data?.error ?? "Gagal mengambil data proyek.");

        if (!cancelled && data) {
          setProjects(Array.isArray(data.projects) ? data.projects : []);
          setProjectPageSize(data.pageSize || 6);
          setProjectTotalItems(data.totalItems || 0);
          setProjectTotalPages(Math.max(1, data.totalPages || 1));
        }
      } catch (error) {
        if (!cancelled) {
          setProjects([]);
          setProjectTotalItems(0);
          setProjectTotalPages(1);
          toast.danger("Data proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba muat ulang halaman.",
          });
        }
      } finally {
        if (!cancelled) {
          setProjectLoading(false);
          done();
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [done, projectPage, start]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadMergedProjects() {
      setMergedLoading(true);
      start();

      try {
        const response = await fetch(`/api/teacher/merged-projects?page=${mergedPage}`, {
          cache: "no-store",
          headers: await getAuthHeaders(),
        });
        const data = (await response.json().catch(() => null)) as MergedProjectsResponse & { error?: string } | null;
        if (!response.ok) throw new Error(data?.error ?? "Gagal mengambil data gabungan proyek.");

        if (!cancelled && data) {
          setMergedProjects(Array.isArray(data.merges) ? data.merges : []);
          setMergedPageSize(data.pageSize || 6);
          setMergedTotalItems(data.totalItems || 0);
          setMergedTotalPages(Math.max(1, data.totalPages || 1));
        }
      } catch (error) {
        if (!cancelled) {
          setMergedProjects([]);
          setMergedTotalItems(0);
          setMergedTotalPages(1);
          toast.danger("Data gabungan proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba muat ulang halaman.",
          });
        }
      } finally {
        if (!cancelled) {
          setMergedLoading(false);
          done();
        }
      }
    }

    void loadMergedProjects();

    return () => {
      cancelled = true;
    };
  }, [done, mergedPage, start]);

  React.useEffect(() => {
    if (!mergeOpen) return;

    let cancelled = false;

    async function loadMergeOptions() {
      setMergeOptionsLoading(true);

      try {
        const response = await fetch("/api/teacher/projects?options=1", {
          cache: "no-store",
          headers: await getAuthHeaders(),
        });
        const data = (await response.json().catch(() => null)) as { projects?: MergeProjectOption[]; error?: string } | null;
        if (!response.ok) throw new Error(data?.error ?? "Gagal mengambil opsi proyek.");
        if (!cancelled) setMergeOptions(Array.isArray(data?.projects) ? data.projects : []);
      } catch (error) {
        if (!cancelled) {
          setMergeOptions([]);
          toast.danger("Opsi proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
          });
        }
      } finally {
        if (!cancelled) setMergeOptionsLoading(false);
      }
    }

    void loadMergeOptions();

    return () => {
      cancelled = true;
    };
  }, [mergeOpen]);

  function openCreateModal() {
    setDraft(emptyDraft);
    setCreateOpen(true);
  }

  function closeCreateModal() {
    if (submitting) return;
    setCreateOpen(false);
    setDraft(emptyDraft);
  }

  function openMergeModal() {
    setMergeDraft(emptyMergeDraft);
    setMergeOptions([]);
    setMergeOpen(true);
  }

  function closeMergeModal() {
    if (mergeSubmitting) return;
    setMergeOpen(false);
    setMergeDraft(emptyMergeDraft);
    setMergeOptions([]);
  }

  async function submitCreateProject() {
    if (submitting) return;
    const title = draft.title.trim();
    if (!title) {
      toast.danger("Judul proyek wajib diisi");
      return;
    }

    start();
    setSubmitting(true);

    try {
      const response = await fetch("/api/teacher/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          title,
          description: draft.description.trim(),
          deadline: draft.deadline || null,
          fileName: draft.fileName || null,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa disimpan.");

      toast.success("Proyek dibuat", { description: "Perubahan berhasil disimpan." });
      setCreateOpen(false);
      setDraft(emptyDraft);
      setProjectPage(1);
    } catch (error) {
      toast.danger("Gagal menyimpan proyek", {
        description: error instanceof Error ? error.message : "Periksa koneksi Supabase lalu coba lagi.",
      });
    } finally {
      setSubmitting(false);
      done();
    }
  }

  async function submitMergeProject() {
    if (mergeSubmitting) return;
    const title = mergeDraft.title.trim();
    const projectIds = Array.from(new Set(mergeDraft.projectIds.map((item) => item.trim()).filter(Boolean)));

    if (!title) {
      toast.danger("Judul gabungan proyek wajib diisi");
      return;
    }
    if (!projectIds.length) {
      toast.danger("Minimal satu proyek harus dipilih");
      return;
    }

    start();
    setMergeSubmitting(true);

    try {
      const response = await fetch("/api/teacher/merged-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          title,
          description: mergeDraft.description.trim(),
          projectIds,
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error ?? "Gabungan proyek belum bisa disimpan.");

      toast.success("Gabungan proyek dibuat", { description: "Perubahan berhasil disimpan." });
      setMergeOpen(false);
      setMergeDraft(emptyMergeDraft);
      setMergedPage(1);
      setProjectPage(1);
    } catch (error) {
      toast.danger("Gagal menyimpan gabungan proyek", {
        description: error instanceof Error ? error.message : "Periksa koneksi Supabase lalu coba lagi.",
      });
    } finally {
      setMergeSubmitting(false);
      done();
    }
  }

  async function handleDeleteProject() {
    if (!deleteTarget) return;

    start();
    try {
      const response = await fetch(`/api/teacher/projects?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error ?? "Proyek belum bisa dihapus.");

      toast.success("Proyek dihapus", {
        description: `Proyek "${deleteTarget.title}" sudah dihapus dari daftar aktif.`,
      });
      setDeleteTarget(null);
      setProjectPage(1);
    } catch (error) {
      toast.danger("Gagal menghapus proyek", {
        description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
      });
    } finally {
      done();
    }
  }

  const projectShowingStart = projectTotalItems === 0 ? 0 : (projectPage - 1) * projectPageSize + 1;
  const projectShowingEnd = projectTotalItems === 0 ? 0 : Math.min(projectTotalItems, projectShowingStart + projects.length - 1);
  const mergedShowingStart = mergedTotalItems === 0 ? 0 : (mergedPage - 1) * mergedPageSize + 1;
  const mergedShowingEnd = mergedTotalItems === 0 ? 0 : Math.min(mergedTotalItems, mergedShowingStart + mergedProjects.length - 1);

  return (
    <>
      <div className="space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">Proyek</h1>
            <p className="text-sm text-ktr-text-secondary">
              Mengelola proyek aktif, dan gabungan proyek yang belum tergabung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={openMergeModal} className="h-10 rounded-[10px] bg-ktr-text-primary px-4 text-sm font-semibold text-white hover:bg-ktr-text-primary/95">
              <HugeiconsIcon icon={Folder01Icon} size={16} strokeWidth={2} />
              Kelompokkan Projek
            </Button>
            <Button type="button" onClick={openCreateModal} className="h-10 rounded-[10px] bg-ktr-text-primary px-4 text-sm font-semibold text-white hover:bg-ktr-text-primary/95">
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
              Buat Proyek
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-semibold text-ktr-text-primary">Gabungan Proyek</h2>
              <p className="text-sm text-ktr-text-secondary">
                Menampilkan <span className="font-semibold text-ktr-text-primary">{formatNumber.format(mergedShowingStart)}</span>
                {mergedShowingEnd > 0 ? ` - ${formatNumber.format(mergedShowingEnd)}` : ""} dari{" "}
                <span className="font-semibold text-ktr-text-primary">{formatNumber.format(mergedTotalItems)}</span> gabungan.
              </p>
            </div>
            <p className="text-sm text-ktr-text-tertiary">6 kartu per halaman</p>
          </div>

          {mergedLoading ? (
            <MergedProjectsGridSkeleton />
          ) : mergedProjects.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mergedProjects.map((merge) => (
                <MergedProjectCardView key={merge.id} merge={merge} />
              ))}
            </div>
          ) : (
            <EmptyMergedProjectsState onCreate={openMergeModal} />
          )}

          <div className="flex flex-col items-center justify-between gap-3 rounded-[12px] border border-ktr-border-light bg-white px-4 py-3 sm:flex-row">
            <p className="text-sm text-ktr-text-secondary">
              Halaman <span className="font-semibold text-ktr-text-primary">{mergedPage}</span> dari{" "}
              <span className="font-semibold text-ktr-text-primary">{mergedTotalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={mergedPage <= 1 || mergedLoading} onClick={() => setMergedPage((current) => Math.max(1, current - 1))}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
                Sebelumnya
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={mergedPage >= mergedTotalPages || mergedLoading} onClick={() => setMergedPage((current) => Math.min(mergedTotalPages, current + 1))}>
                Berikutnya
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-semibold text-ktr-text-primary">Proyek Belum Digabung</h2>
              <p className="text-sm text-ktr-text-secondary">
                Menampilkan <span className="font-semibold text-ktr-text-primary">{formatNumber.format(projectShowingStart)}</span>
                {projectShowingEnd > 0 ? ` - ${formatNumber.format(projectShowingEnd)}` : ""} dari{" "}
                <span className="font-semibold text-ktr-text-primary">{formatNumber.format(projectTotalItems)}</span> proyek.
              </p>
            </div>
            <p className="text-sm text-ktr-text-tertiary">6 kartu per halaman</p>
          </div>

          {projectLoading ? (
            <ProjectsGridSkeleton />
          ) : projects.length ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => setDeleteTarget(project)}
                />
              ))}
            </div>
          ) : (
            <EmptyProjectsState onCreate={openCreateModal} />
          )}

          <div className="flex flex-col items-center justify-between gap-3 rounded-[12px] border border-ktr-border-light bg-white px-4 py-3 sm:flex-row">
            <p className="text-sm text-ktr-text-secondary">
              Halaman <span className="font-semibold text-ktr-text-primary">{projectPage}</span> dari{" "}
              <span className="font-semibold text-ktr-text-primary">{projectTotalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={projectPage <= 1 || projectLoading} onClick={() => setProjectPage((current) => Math.max(1, current - 1))}>
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
                Sebelumnya
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={projectPage >= projectTotalPages || projectLoading} onClick={() => setProjectPage((current) => Math.min(projectTotalPages, current + 1))}>
                Berikutnya
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        theme="teacher"
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) closeCreateModal();
        }}
        title="Buat Proyek"
        description="Isi judul, deskripsi, deadline, dan file untuk proyek baru."
        confirmText={submitting ? "Menyimpan..." : "Simpan"}
        closeOnConfirm={false}
        onConfirm={() => void submitCreateProject()}
      >
        <div className="space-y-4">
          <AppFormField
            label="Judul"
            placeholder="Contoh: Website Profil Sekolah"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />

          <label className="block space-y-2">
            <span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Deskripsi</span>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Tulis arahan, konteks, atau soal proyek"
              className="min-h-28 w-full resize-none rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 py-3 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12"
            />
          </label>

          <AppFormField
            label="Deadline"
            type="date"
            value={draft.deadline}
            onChange={(event) => setDraft((current) => ({ ...current, deadline: event.target.value }))}
          />

          <label className="block space-y-2">
            <span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">File</span>
            <div className="flex items-center gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 py-3">
              <HugeiconsIcon icon={FileAttachmentIcon} size={18} strokeWidth={2} className="shrink-0 text-ktr-text-primary" />
              <input
                type="file"
                className="min-w-0 flex-1 text-[14px] text-ktr-text-secondary file:mr-3 file:rounded-[10px] file:border-0 file:bg-ktr-primary-soft file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-ktr-primary"
                onChange={(event) => setDraft((current) => ({ ...current, fileName: event.target.files?.[0]?.name ?? "" }))}
              />
            </div>
            <p className="text-[12px] text-ktr-text-tertiary">
              {draft.fileName ? `File terpilih: ${draft.fileName}` : "Pilih file pendukung jika sudah siap."}
            </p>
          </label>
        </div>
      </ConfirmModal>

      <ConfirmModal
        theme="teacher"
        open={mergeOpen}
        onOpenChange={(open) => {
          if (!open) closeMergeModal();
        }}
        title="Kelompokkan Projek"
        description="Gabungkan beberapa proyek yang belum tergabung menjadi satu kelompok proyek."
        confirmText={mergeSubmitting ? "Menyimpan..." : "Simpan"}
        closeOnConfirm={false}
        onConfirm={() => void submitMergeProject()}
      >
        <div className="space-y-4">
          <AppFormField
            label="Judul"
            placeholder="Contoh: Paket Proyek Web"
            value={mergeDraft.title}
            onChange={(event) => setMergeDraft((current) => ({ ...current, title: event.target.value }))}
          />

          <label className="block space-y-2">
            <span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Deskripsi</span>
            <textarea
              value={mergeDraft.description}
              onChange={(event) => setMergeDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Tulis alasan atau konteks penggabungan proyek"
              className="min-h-24 w-full resize-none rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 py-3 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Proyek yang Digabung</span>
            </div>

            <div className="space-y-2">
              {mergeDraft.projectIds.map((projectId, index) => (
                <div key={`${index}-${projectId}`} className="flex items-center gap-2">
                  <select
                    value={projectId}
                    onChange={(event) =>
                      setMergeDraft((current) => {
                        const next = [...current.projectIds];
                        next[index] = event.target.value;
                        return { ...current, projectIds: next };
                      })
                    }
                    className="h-10 min-w-0 flex-1 rounded-[12px] border border-ktr-border-light bg-white px-3 text-[14px] text-ktr-text-primary outline-none focus:border-ktr-border-focus"
                  >
                    <option value="">{mergeOptionsLoading ? "Memuat proyek..." : "Pilih proyek"}</option>
                    {mergeOptions.map((option) => {
                      const isTaken = mergeDraft.projectIds.some((selected, selectedIndex) => selected === option.id && selectedIndex !== index);
                      return (
                        <option key={option.id} value={option.id} disabled={isTaken}>
                          {option.title} - {option.deadlineLabel}
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setMergeDraft((current) => ({ ...current, projectIds: [...current.projectIds, ""] }))}
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-lg font-semibold text-ktr-text-primary hover:border-ktr-border-input"
                      aria-label="Tambah proyek"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setMergeDraft((current) => {
                          if (current.projectIds.length <= 1) return current;
                          return { ...current, projectIds: current.projectIds.filter((_, projectIndex) => projectIndex !== index) };
                        })
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-lg font-semibold text-ktr-text-primary hover:border-ktr-border-input disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Kurangi proyek"
                      disabled={mergeDraft.projectIds.length <= 1}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ConfirmModal>

      <ConfirmModal
        theme="teacher"
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus proyek ini?"
        description={`Proyek "${deleteTarget?.title ?? ""}" akan dihapus dari daftar guru.`}
        confirmText="Hapus"
        tone="danger"
        onConfirm={() => void handleDeleteProject()}
      />
    </>
  );
}

function MergedProjectCardView({ merge }: { merge: MergeProjectCard }) {
  const previewProjects = merge.projects.slice(0, 3);
  const remaining = Math.max(0, merge.projects.length - previewProjects.length);

  return (
    <Card className="group rounded-[12px] border border-ktr-border-light bg-white transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.998]">
      <Card.Content className="relative p-5">
        <Link
          href={`/teacher/projects/merge/${merge.id}`}
          className="absolute inset-0 cursor-pointer rounded-[12px] focus-visible:outline-none focus-visible:border-ktr-text-primary"
          aria-label={`Lihat detail gabungan ${merge.title}`}
        />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-base font-semibold text-ktr-text-primary">{merge.title}</h2>
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{merge.description || "Belum ada deskripsi gabungan proyek."}</p>
          </div>

          <div className="inline-flex h-9 items-center rounded-[12px] bg-ktr-surface-soft px-3 text-xs font-semibold text-ktr-text-primary">
            {merge.projectCount} proyek
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-7 space-y-4 text-sm font-medium">
          <InfoRow icon={CheckListIcon} label="Kelompok" value={`${merge.groupCount} kelompok`} />
          <InfoRow icon={Calendar03Icon} label="Selesai" value={`${merge.finishedGroups} kelompok`} />
          <InfoRow icon={UserMultiple02Icon} label="Siswa" value={`${merge.students} siswa`} />
          <InfoRow icon={Alert01Icon} label="Proyek" value={previewProjects.map((project) => project.title).join(", ") || "Belum ada proyek"} valueClassName="text-ktr-text-primary" />
          {remaining > 0 ? <InfoRow icon={Folder01Icon} label="Lainnya" value={`+${remaining} proyek`} valueClassName="text-ktr-text-secondary" /> : null}
        </div>
      </Card.Content>
    </Card>
  );
}

function MergedProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="rounded-[12px] border border-ktr-border-light bg-white">
          <Card.Content className="p-5">
            <div className="space-y-3">
              <div className="teacher-skeleton h-3 w-28" />
              <div className="teacher-skeleton h-7 w-52" />
              <div className="teacher-skeleton h-4 w-full" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((__, innerIndex) => (
                <div key={innerIndex} className="teacher-skeleton h-14 w-full rounded-[10px]" />
              ))}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}

function EmptyMergedProjectsState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="rounded-[12px] border border-dashed border-ktr-border-light bg-white">
      <Card.Content className="flex flex-col items-start gap-4 p-6">
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-semibold text-ktr-text-primary">Belum ada gabungan proyek</h3>
          <p className="text-sm text-ktr-text-secondary">Buat kelompok proyek pertama dari proyek yang belum tergabung.</p>
        </div>
        <Button type="button" onClick={onCreate} className="h-10 rounded-[10px] bg-ktr-text-primary px-4 text-sm font-semibold text-white hover:bg-ktr-text-primary/95">
          <HugeiconsIcon icon={Folder01Icon} size={16} strokeWidth={2} />
          Kelompokkan Projek
        </Button>
      </Card.Content>
    </Card>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="rounded-[12px] border border-ktr-border-light bg-white">
          <Card.Content className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="teacher-skeleton h-6 w-52" />
                <div className="teacher-skeleton h-4 w-32" />
              </div>
              <div className="teacher-skeleton h-8 w-20 rounded-[10px]" />
            </div>
            <div className="mt-5 space-y-3">
              <div className="teacher-skeleton h-4 w-full" />
              <div className="teacher-skeleton h-4 w-5/6" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((__, innerIndex) => (
                <div key={innerIndex} className="teacher-skeleton h-10 w-full rounded-[10px]" />
              ))}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}

function ProjectCard({ project, onDelete }: { project: TeacherProjectCard; onDelete: () => void }) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pendingReviews = 0;

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function copyProjectCode() {
    const projectCode = `KTR-${project.id.padStart(3, "0")}`;
    void navigator.clipboard?.writeText(projectCode);
    toast.success("Kode proyek disalin", { description: projectCode });
  }

  return (
    <Card className="group rounded-[12px] border border-ktr-border-light bg-white transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.998]">
      <Card.Content className="relative p-5">
        <Link
          href={`/teacher/projects/${project.id}`}
          className="absolute inset-0 cursor-pointer rounded-[12px] focus-visible:outline-none focus-visible:border-ktr-text-primary"
          aria-label={`Lihat detail ${project.title}`}
        />

        <div className="pointer-events-none relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-base font-semibold text-ktr-text-primary">{project.title}</h2>
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{project.description || "Belum ada deskripsi proyek."}</p>
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

            {moreOpen ? (
              <div className="teacher-dropdown-popover absolute right-0 top-[calc(100%+8px)] z-30 w-44 rounded-[12px] border border-ktr-border-light bg-white p-1" role="menu">
                <ProjectMenuItem icon={Copy01Icon} label="Copy kode" onClick={() => { setMoreOpen(false); copyProjectCode(); }} />
                <ProjectMenuItem icon={Delete02Icon} label="Hapus" onClick={() => { setMoreOpen(false); onDelete(); }} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-7 space-y-4 text-sm font-medium">
          <InfoRow icon={CheckListIcon} label="Status" value={project.status} valueClassName={statusClassName(project.status)} />
          <InfoRow icon={Calendar03Icon} label="Deadline" value={project.deadlineLabel} />
          <InfoRow icon={UserMultiple02Icon} label="Kelompok" value={`${project.groups} kelompok`} />
          <InfoRow icon={CheckListIcon} label="Siswa" value={`${project.students} siswa`} />
          <InfoRow icon={Alert01Icon} label="File" value={project.fileName || "Belum ada file"} valueClassName={project.fileName ? "text-ktr-text-primary" : "text-ktr-warning"} />
          <InfoRow icon={Alert01Icon} label="Review" value={pendingReviews > 0 ? `${pendingReviews} tertunda` : "Tidak ada"} valueClassName={pendingReviews > 0 ? "text-ktr-warning" : "text-ktr-success"} />
        </div>
      </Card.Content>
    </Card>
  );
}

function EmptyProjectsState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="rounded-[12px] border border-dashed border-ktr-border-light bg-white">
      <Card.Content className="flex flex-col items-start gap-4 p-6">
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-semibold text-ktr-text-primary">Belum ada proyek</h3>
          <p className="text-sm text-ktr-text-secondary">Mulai dengan membuat proyek baru untuk siswa.</p>
        </div>
        <Button type="button" onClick={onCreate} className="h-10 rounded-[10px] bg-ktr-text-primary px-4 text-sm font-semibold text-white hover:bg-ktr-text-primary/95">
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
          Buat Proyek
        </Button>
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
