"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Delete02Icon,
  Edit01Icon,
  Folder01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

import { AppFormField } from "@/components/ui/app-form-field";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import TeacherBackButton from "@/components/teacher/BackButton";
import { toast } from "@/components/ui/toast";
import { useNProgress } from "@/components/ui/nprogress";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@heroui/react/card";

type MergeProjectItem = {
  id: string;
  title: string;
  className: string;
  status: "Aktif" | "Selesai";
  deadlineLabel: string;
  groups: number;
  finishedGroups: number;
  students: number;
};

type MergeDetail = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  projectCount: number;
  groupCount: number;
  finishedGroups: number;
  students: number;
  projectIds: string[];
  projects: MergeProjectItem[];
};

type MergeOptionsResponse = {
  projects?: Array<{ id: string; title: string; deadlineLabel: string }>;
  error?: string;
};

type MergeResponse = {
  merge?: MergeDetail;
  error?: string;
};

type MergeDraft = {
  title: string;
  description: string;
  projectIds: string[];
};

const emptyDraft: MergeDraft = {
  title: "",
  description: "",
  projectIds: [""],
};

export default function MergeProjectDetailPage() {
  const params = useParams<{ mergeId: string }>();
  const mergeId = params.mergeId;
  const { start, done } = useNProgress();

  const [merge, setMerge] = React.useState<MergeDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [draft, setDraft] = React.useState<MergeDraft>(emptyDraft);
  const [options, setOptions] = React.useState<Array<{ id: string; title: string; deadlineLabel: string }>>([]);
  const [optionsLoading, setOptionsLoading] = React.useState(false);

  async function getAuthHeaders() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  React.useEffect(() => {
    let cancelled = false;

    async function loadMerge() {
      setLoading(true);
      start();

      try {
        const response = await fetch(`/api/teacher/merged-projects?id=${encodeURIComponent(mergeId)}`, {
          cache: "no-store",
          headers: await getAuthHeaders(),
        });
        const data = (await response.json().catch(() => null)) as MergeResponse | null;
        if (!response.ok) throw new Error(data?.error ?? "Gagal mengambil data gabungan proyek.");
        if (!cancelled) setMerge(data?.merge ?? null);
      } catch (error) {
        if (!cancelled) {
          setMerge(null);
          toast.danger("Data gabungan proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba muat ulang halaman.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          done();
        }
      }
    }

    void loadMerge();

    return () => {
      cancelled = true;
    };
  }, [done, mergeId, start]);

  React.useEffect(() => {
    if (!editOpen) return;

    let cancelled = false;

    async function loadOptions() {
      setOptionsLoading(true);

      try {
        const response = await fetch("/api/teacher/projects?options=1", {
          cache: "no-store",
          headers: await getAuthHeaders(),
        });
        const data = (await response.json().catch(() => null)) as MergeOptionsResponse | null;
        if (!response.ok) throw new Error(data?.error ?? "Gagal mengambil opsi proyek.");
        if (!cancelled) {
          const currentOptions = (merge?.projects ?? []).map((project) => ({
            id: project.id,
            title: project.title,
            deadlineLabel: project.deadlineLabel,
          }));
          const nextOptions = Array.isArray(data?.projects) ? data.projects : [];
          const mergedOptions = [...currentOptions, ...nextOptions].filter(
            (option, index, list) => list.findIndex((item) => item.id === option.id) === index,
          );
          setOptions(mergedOptions);
        }
      } catch (error) {
        if (!cancelled) {
          setOptions([]);
          toast.danger("Opsi proyek belum bisa dimuat", {
            description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
          });
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, [editOpen, merge?.projects]);

  function openEditModal() {
    if (!merge) return;
    setDraft({
      title: merge.title,
      description: merge.description,
      projectIds: merge.projectIds.length ? merge.projectIds : [""],
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (saving) return;
    const title = draft.title.trim();
    const projectIds = Array.from(new Set(draft.projectIds.map((item) => item.trim()).filter(Boolean)));

    if (!title) {
      toast.danger("Judul gabungan proyek wajib diisi");
      return;
    }
    if (!projectIds.length) {
      toast.danger("Minimal satu proyek harus dipilih");
      return;
    }

    start();
    setSaving(true);

    try {
      const response = await fetch("/api/teacher/merged-projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          id: mergeId,
          title,
          description: draft.description.trim(),
          projectIds,
        }),
      });
      const data = (await response.json().catch(() => null)) as MergeResponse | null;
      if (!response.ok) throw new Error(data?.error ?? "Gabungan proyek belum bisa disimpan.");

      toast.success("Gabungan proyek diperbarui");
      setEditOpen(false);
      setMerge((current) => current ? { ...current, title, description: draft.description.trim(), projectIds } : current);
      setTimeout(() => {
        void (async () => {
          const refreshResponse = await fetch(`/api/teacher/merged-projects?id=${encodeURIComponent(mergeId)}`, {
            cache: "no-store",
            headers: await getAuthHeaders(),
          });
          const refreshData = (await refreshResponse.json().catch(() => null)) as MergeResponse | null;
          if (refreshResponse.ok && refreshData?.merge) setMerge(refreshData.merge);
        })();
      }, 0);
    } catch (error) {
      toast.danger("Gagal menyimpan gabungan proyek", {
        description: error instanceof Error ? error.message : "Periksa koneksi Supabase lalu coba lagi.",
      });
    } finally {
      setSaving(false);
      done();
    }
  }

  async function handleDelete() {
    start();

    try {
      const response = await fetch(`/api/teacher/merged-projects?id=${encodeURIComponent(mergeId)}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
      });
      const data = (await response.json().catch(() => null)) as MergeResponse | null;
      if (!response.ok) throw new Error(data?.error ?? "Gabungan proyek belum bisa dihapus.");

      toast.success("Gabungan proyek dihapus");
      setDeleteOpen(false);
      setMerge(null);
    } catch (error) {
      toast.danger("Gagal menghapus gabungan proyek", {
        description: error instanceof Error ? error.message : "Coba lagi sebentar lagi.",
      });
    } finally {
      done();
    }
  }

  if (loading) return <MergeDetailSkeleton />;

  if (!merge) {
    return (
      <div className="space-y-6">
        <TeacherBackButton href="/teacher/projects" label="Kembali ke daftar proyek" />
        <Card className="rounded-[12px] border border-dashed border-ktr-border-light bg-white">
          <Card.Content className="p-6">
            <p className="text-sm text-ktr-text-secondary">Gabungan proyek tidak ditemukan.</p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        <div className="space-y-5">
          <TeacherBackButton href="/teacher/projects" label="Kembali ke daftar proyek" />

          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ktr-text-secondary">Gabungan proyek</p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">{merge.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ktr-text-secondary">{merge.description || "Belum ada deskripsi gabungan proyek."}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input"
              >
                <HugeiconsIcon icon={Edit01Icon} size={16} strokeWidth={2} />
                Edit gabungan
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
                Hapus
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard label="Proyek" value={merge.projectCount} />
          <SummaryCard label="Kelompok" value={merge.groupCount} />
          <SummaryCard label="Selesai" value={merge.finishedGroups} />
          <SummaryCard label="Siswa" value={merge.students} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold text-ktr-text-primary">Proyek di dalam gabungan</h2>
            <span className="inline-flex items-center gap-2 rounded-[10px] border border-ktr-border-light px-3 py-2 text-sm font-semibold text-ktr-text-secondary">
              <HugeiconsIcon icon={Folder01Icon} size={15} strokeWidth={2} />
              {merge.projectCount} proyek
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {merge.projects.map((project) => (
              <MergeProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>

      <ConfirmModal
        theme="teacher"
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setEditOpen(false);
        }}
        title="Edit gabungan proyek"
        description="Ubah judul, deskripsi, atau daftar proyek yang digabung."
        confirmText={saving ? "Menyimpan..." : "Simpan"}
        closeOnConfirm={false}
        onConfirm={() => void submitEdit()}
      >
        <div className="space-y-4">
          <AppFormField
            label="Judul"
            placeholder="Contoh: Paket Proyek Web"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          />

          <label className="block space-y-2">
            <span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Deskripsi</span>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Tulis alasan atau konteks penggabungan proyek"
              className="min-h-24 w-full resize-none rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 py-3 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12"
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Proyek di gabungan</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-[10px] px-3 text-sm font-semibold"
                onClick={() => setDraft((current) => ({ ...current, projectIds: [...current.projectIds, ""] }))}
              >
                Tambah
              </Button>
            </div>

            <div className="space-y-2">
              {draft.projectIds.map((projectId, index) => (
                <div key={`${index}-${projectId}`} className="flex items-center gap-2">
                  <select
                    value={projectId}
                    onChange={(event) =>
                      setDraft((current) => {
                        const next = [...current.projectIds];
                        next[index] = event.target.value;
                        return { ...current, projectIds: next };
                      })
                    }
                    className="h-10 min-w-0 flex-1 rounded-[12px] border border-ktr-border-light bg-white px-3 text-[14px] text-ktr-text-primary outline-none focus:border-ktr-border-focus"
                  >
                    <option value="">{optionsLoading ? "Memuat proyek..." : "Pilih proyek"}</option>
                    {options.map((option) => {
                      const isTaken = draft.projectIds.some((selected, selectedIndex) => selected === option.id && selectedIndex !== index);
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
                      onClick={() => setDraft((current) => ({ ...current, projectIds: [...current.projectIds, ""] }))}
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-lg font-semibold text-ktr-text-primary hover:border-ktr-border-input"
                      aria-label="Tambah proyek"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => {
                          if (current.projectIds.length <= 1) return current;
                          return { ...current, projectIds: current.projectIds.filter((_, projectIndex) => projectIndex !== index) };
                        })
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ktr-border-light bg-white text-lg font-semibold text-ktr-text-primary hover:border-ktr-border-input disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Kurangi proyek"
                      disabled={draft.projectIds.length <= 1}
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} className="rotate-180" />
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
        tone="danger"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus gabungan proyek?"
        description="Gabungan proyek akan dihapus, tetapi proyek aslinya tetap ada."
        confirmText="Hapus"
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="rounded-[12px] border border-ktr-border-light bg-white">
      <Card.Content className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ktr-text-tertiary">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-ktr-text-primary">{value}</p>
      </Card.Content>
    </Card>
  );
}

function MergeProjectCard({ project }: { project: MergeProjectItem }) {
  const pendingReviews = 0;

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
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{project.className}</p>
          </div>

          <div className="pointer-events-none inline-flex h-9 items-center rounded-[12px] bg-ktr-surface-soft px-3 text-xs font-semibold text-ktr-text-primary">
            {project.deadlineLabel}
          </div>
        </div>

        <div className="pointer-events-none relative z-0 mt-7 space-y-4 text-sm font-medium">
          <MergeInfoRow label="Status" value={project.status} valueClassName={project.status === "Selesai" ? "text-ktr-info" : "text-ktr-success"} />
          <MergeInfoRow label="Kelompok" value={`${project.groups} kelompok`} />
          <MergeInfoRow label="Selesai" value={`${project.finishedGroups} kelompok`} valueClassName={project.finishedGroups > 0 ? "text-ktr-text-primary" : "text-ktr-text-secondary"} />
          <MergeInfoRow label="Siswa" value={`${project.students} siswa`} />
          <MergeInfoRow label="Review" value={pendingReviews > 0 ? `${pendingReviews} tertunda` : "Tidak ada"} valueClassName={pendingReviews > 0 ? "text-ktr-warning" : "text-ktr-success"} />
        </div>
      </Card.Content>
    </Card>
  );
}

function MergeInfoRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
      <span className="truncate text-ktr-text-secondary">{label}</span>
      <span className={`shrink-0 text-right font-semibold ${valueClassName ?? "text-ktr-text-primary"}`}>{value}</span>
    </div>
  );
}

function MergeDetailSkeleton() {
  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <div className="teacher-skeleton h-10 w-12" />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="teacher-skeleton h-5 w-36" />
            <div className="teacher-skeleton h-10 w-72" />
            <div className="teacher-skeleton h-4 w-[520px] max-w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="teacher-skeleton h-10 w-36" />
            <div className="teacher-skeleton h-10 w-28" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[12px] border border-ktr-border-light bg-white p-4">
            <div className="teacher-skeleton h-4 w-24" />
            <div className="teacher-skeleton mt-2 h-6 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[12px] border border-ktr-border-light bg-white p-5">
            <div className="teacher-skeleton h-4 w-28" />
            <div className="teacher-skeleton mt-2 h-7 w-48" />
            <div className="teacher-skeleton mt-3 h-4 w-full" />
            <div className="teacher-skeleton mt-5 h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
