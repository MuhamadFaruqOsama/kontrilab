"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckListIcon,
  Folder01Icon,
  MessageMultiple01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@heroui/react/card";
import FilterSelect from "@/components/teacher/FilterSelect";
import StatCard from "@/components/teacher/StatCard";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { useNProgress } from "@/components/ui/nprogress";
import { teacherProjects, followUps } from "@/components/teacher/mock-data";
import { supabase } from "@/lib/supabase/client";

const semesterOptions = [
  "Semester Genap 2026",
  "Semester Ganjil 2025",
  "Semester Genap 2025",
].map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));

type FollowUpItem = (typeof followUps)[number];
type TeacherProjectCard = {
  id: string;
  name: string;
  className: string;
  status: "Aktif" | "Selesai" | "Diarsipkan";
  startDate: string;
  finalDeadline: string;
  groups: number;
  finishedGroups: number;
  students: number;
  individualUploads: number;
  pendingUploadReviews: number;
  pendingFinalReviews: number;
  inactiveGroups: number;
  announcement?: string;
};

type ProjectsResponse = {
  projects?: TeacherProjectCard[];
};

const fallbackProjects: TeacherProjectCard[] = teacherProjects.map((project) => ({
  ...project,
  status: project.status as TeacherProjectCard["status"],
  finishedGroups: project.groups - project.inactiveGroups,
}));

export default function TeacherDashboard() {
  const [projects, setProjects] = React.useState<TeacherProjectCard[]>(fallbackProjects);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { start, done } = useNProgress();
  const [reminderOpen, setReminderOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("/api/teacher/projects", {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) return;

      const data = (await response.json().catch(() => null)) as ProjectsResponse | TeacherProjectCard[] | null;
      const nextProjects = Array.isArray(data) ? data : data?.projects;
      if (!cancelled && Array.isArray(nextProjects) && nextProjects.length > 0) setProjects(nextProjects);
    }

    void loadProjects()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
        if (!cancelled) done();
      });

    return () => {
      cancelled = true;
    };
  }, [done]);

  const totalProjects = projects.length;
  const totalGroups = projects.reduce((total, project) => total + project.groups, 0);
  const totalStudents = projects.reduce((total, project) => total + project.students, 0);
  const latestProject = projects[0];
  const latestProjectProgress = latestProject ? `${latestProject.finishedGroups}/${latestProject.groups}` : "0/0";
  const recentProjects = projects.slice(0, 3);

  function handleFollowUpAction(item: FollowUpItem) {
    if (item.action === "Kirim Pengingat") {
      setReminderTarget(item.target);
      setReminderOpen(true);
    } else if (item.action === "Review") {
      start();
      router.push("/teacher/review");
    } else if (item.action === "Lihat Kelompok") {
      start();
      router.push("/teacher/projects/1/groups/2");
    } else if (item.action === "Lihat Siswa") {
      start();
      router.push("/teacher/students");
    }
  }

  function sendReminder() {
    toast.success("Pengingat terkirim", {
      description: `Pengingat deadline berhasil dikirim ke semua anggota kelompok di ${reminderTarget}.`,
    });
  }

  if (loading) return <TeacherDashboardSkeleton />;

  return (
    <>
      <div className="space-y-8">
        {loading ? (
          <DashboardHeaderSkeleton />
        ) : (
          <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-ktr-text-secondary">16 Mei 2026</p>
              <h1 className="mt-2 font-heading text-[34px] font-semibold leading-[1.12] tracking-normal text-ktr-text-primary md:text-[40px]">
                Hello, Guru KontriLab
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <FilterSelect className="w-full sm:w-56" ariaLabel="Pilih semester" defaultValue="semester-genap-2026" options={semesterOptions} />
            </div>
          </section>
        )}

        {loading ? (
          <DashboardStatSkeleton />
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Gabungan Proyek" value={totalGroups} icon={Folder01Icon} tone="neutral" note="Total kelompok" />
            <StatCard title="Semua Proyek" value={totalProjects} icon={CheckListIcon} tone="amber" note="Proyek terdaftar" />
            <StatCard title="Jumlah Siswa" value={totalStudents} icon={UserMultiple02Icon} tone="rose" note="Siswa terlibat" />
            <StatCard title="Proyek Terakhir" value={latestProjectProgress} icon={MessageMultiple01Icon} tone="green" note={latestProject?.name ?? "Belum ada proyek"} />
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <DashboardPanel
              title="Proyek Terakhir"
              subtitle={`${recentProjects.length} proyek terbaru`}
              action={
                <Link href="/teacher/projects" onClick={start} className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-ktr-text-primary">
                  Semua proyek
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2} />
                </Link>
              }
            >
              {loading ? (
                <DashboardListSkeleton rows={3} />
              ) : (
                <div className="space-y-0">
                  {recentProjects.map((project) => {
                    const reviews = project.pendingUploadReviews + project.pendingFinalReviews;
                    return (
                      <div key={project.id} className="grid gap-3 border-b border-ktr-border-light py-4 transition-colors first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)] sm:items-center">
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-3">
                            <Link href={`/teacher/projects/${project.id}`} onClick={start} className="truncate text-[15px] font-semibold text-ktr-text-primary transition-colors hover:text-ktr-text-secondary">
                              {project.name}
                            </Link>
                            <StatusBadge status={project.status} />
                          </div>
                          <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">{project.className}</p>
                        </div>
                        <div className="grid w-full min-w-0 gap-x-6 gap-y-2 text-xs font-medium text-ktr-text-secondary sm:grid-cols-3 sm:items-center">
                          <MetaItem icon={UserMultiple02Icon} label={`${project.groups} kelompok`} />
                          <MetaItem icon={Calendar03Icon} label={project.finalDeadline} />
                          <MetaItem icon={CheckListIcon} label={reviews > 0 ? `${reviews} review` : "Tidak ada review"} emphasis={reviews > 0} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DashboardPanel>

            {/* <DashboardPanel title="Prioritas Hari Ini" subtitle={`${topFollowUps.length} item memerlukan perhatian`}>
              <div className="space-y-0">
                {topFollowUps.map((item) => (
                  <div key={item.title} className="flex w-full items-center justify-between gap-4 border-b border-ktr-border-light py-4 text-left transition-colors first:pt-0 last:border-b-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ktr-text-primary">{item.title}</p>
                      <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">{item.target}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFollowUpAction(item)}
                      className="shrink-0 cursor-pointer text-xs font-semibold text-ktr-info transition-colors hover:text-ktr-text-primary"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </DashboardPanel> */}
          </div>

          <aside className="space-y-6">
            <DashboardPanel title="Aktivitas" subtitle="Ringkasan terbaru">
              <div className="space-y-4">
                {followUps.slice(0, 4).map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex w-full items-start gap-3 border-b border-ktr-border-light pb-4 text-left transition-colors last:border-b-0 last:pb-0">
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center text-ktr-text-primary">
                      <HugeiconsIcon icon={index % 2 === 0 ? CheckListIcon : MessageMultiple01Icon} size={16} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <button type="button" onClick={() => handleFollowUpAction(item)} className="block max-w-full cursor-pointer truncate text-sm font-semibold text-ktr-text-primary transition-colors hover:text-ktr-text-secondary">{item.title}</button>
                      <span className="mt-1 block truncate text-xs font-medium text-ktr-text-secondary">{item.target}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-ktr-text-tertiary">10:{15 + index}</span>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </aside>
        </section>
      </div>

      <ConfirmModal
        theme="teacher"
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        title="Kirim Pengingat Deadline?"
        description={`Pengingat deadline akan dikirim ke semua anggota kelompok di proyek "${reminderTarget}".`}
        confirmText="Kirim Pengingat"
        onConfirm={sendReminder}
      />
    </>
  );
}

function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <DashboardHeaderSkeleton />
      <DashboardStatSkeleton />
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <DashboardSkeletonPanel rows={3} />
          <DashboardSkeletonPanel rows={3} />
        </div>
        <DashboardSkeletonPanel rows={4} compact />
      </section>
    </div>
  );
}

function DashboardSkeletonPanel({ rows, compact = false }: { rows: number; compact?: boolean }) {
  return (
    <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
      <Card.Content className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="teacher-skeleton h-6 w-36" />
            <div className="teacher-skeleton h-4 w-24" />
          </div>
          <div className="teacher-skeleton h-5 w-20" />
        </div>
        <div className="mt-7 space-y-0">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="grid gap-3 border-b border-ktr-border-light py-4 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
              <div className="min-w-0">
                <div className={compact ? "teacher-skeleton h-5 w-40 max-w-full" : "teacher-skeleton h-5 w-60 max-w-full"} />
                <div className="teacher-skeleton mt-2 h-4 w-36 max-w-full" />
              </div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                <div className="teacher-skeleton h-4 w-full" />
                <div className="teacher-skeleton h-4 w-full" />
                <div className="teacher-skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-2xl">
        <div className="teacher-skeleton h-5 w-24" />
        <div className="teacher-skeleton mt-3 h-12 w-56" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="teacher-skeleton h-10 w-full sm:w-56" />
        <div className="teacher-skeleton h-10 w-full sm:w-32" />
      </div>
    </section>
  );
}

function DashboardStatSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="rounded-[12px] border border-ktr-border-light bg-white">
          <Card.Content className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="teacher-skeleton h-5 w-28" />
              <div className="teacher-skeleton size-9 rounded-full" />
            </div>
            <div className="teacher-skeleton mt-7 h-10 w-14" />
            <div className="teacher-skeleton mt-5 h-4 w-32" />
          </Card.Content>
        </Card>
      ))}
    </section>
  );
}

function DashboardListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid gap-3 border-b border-ktr-border-light py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)] sm:items-center">
          <div>
            <div className="teacher-skeleton h-5 w-48" />
            <div className="teacher-skeleton mt-2 h-4 w-28" />
          </div>
          <div className="grid w-full gap-x-5 gap-y-2 sm:grid-cols-3">
            <div className="teacher-skeleton h-4 w-24" />
            <div className="teacher-skeleton h-4 w-28" />
            <div className="teacher-skeleton h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPanel({ title, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="rounded-[12px] border border-ktr-border-light bg-white">
      <Card.Header className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-lg font-semibold text-ktr-text-primary">{title}</h2>
        </div>
        {action}
      </Card.Header>
      <Card.Content className="p-6">{children}</Card.Content>
    </Card>
  );
}

function MetaItem({ icon, label, emphasis }: { icon: typeof Calendar03Icon; label: string; emphasis?: boolean }) {
  return (
    <span className={emphasis ? "flex min-w-0 items-center gap-1.5 font-semibold text-ktr-warning" : "flex min-w-0 items-center gap-1.5 text-ktr-text-secondary"}>
      <HugeiconsIcon icon={icon} size={14} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}
