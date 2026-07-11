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
  PlusSignIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@heroui/react/card";
import FilterSelect from "@/components/teacher/FilterSelect";
import StatCard from "@/components/teacher/StatCard";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { teacherProjects, followUps, teacherStudents } from "@/components/teacher/mock-data";

const semesterOptions = [
  "Semester Genap 2026",
  "Semester Ganjil 2025",
  "Semester Genap 2025",
].map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));

type FollowUpItem = (typeof followUps)[number];

export default function TeacherDashboard() {
  const [projects, setProjects] = React.useState<typeof teacherProjects>(teacherProjects);
  const router = useRouter();
  const [reminderOpen, setReminderOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/teacher/projects", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data: typeof teacherProjects | null) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const needAttentionStudents = teacherStudents.filter((student) => student.status === "Perlu Perhatian" || student.status === "Tidak Ada Aktivitas Terbaru").length;
  const pendingReviews = projects.reduce((total, project) => total + project.pendingUploadReviews + project.pendingFinalReviews, 0);
  const activeProjects = projects.filter((project) => project.status === "Aktif");
  const inactiveGroups = projects.reduce((total, project) => total + project.inactiveGroups, 0);
  const completionRate = projects.length ? Math.max(0, Math.round(((projects.length - inactiveGroups) / projects.length) * 100)) : 0;
  const topFollowUps = followUps.slice(0, 3);

  function handleFollowUpAction(item: FollowUpItem) {
    if (item.action === "Kirim Pengingat") {
      setReminderTarget(item.target);
      setReminderOpen(true);
    } else if (item.action === "Review") {
      router.push("/teacher/review");
    } else if (item.action === "Lihat Kelompok") {
      router.push("/teacher/projects/1/groups/2");
    } else if (item.action === "Lihat Siswa") {
      router.push("/teacher/students");
    }
  }

  function sendReminder() {
    toast.success("Pengingat terkirim", {
      description: `Pengingat deadline berhasil dikirim ke semua anggota kelompok di ${reminderTarget}.`,
    });
  }

  return (
    <>
      <div className="space-y-8">
        <section className="flex flex-col gap-5 border-b border-ktr-border-light pb-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-ktr-text-secondary">16 Mei 2026</p>
            <h1 className="mt-2 font-heading text-[34px] font-semibold leading-[1.12] tracking-normal text-ktr-text-primary md:text-[40px]">
              Hello, Guru
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FilterSelect className="w-full sm:w-56" ariaLabel="Pilih semester" defaultValue="semester-genap-2026" options={semesterOptions} />
            <Link
              href="/teacher/projects"
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-ktr-text-primary bg-ktr-text-primary px-4 text-sm font-semibold text-white transition-[border-color,background-color,transform] hover:bg-black active:scale-[0.997]"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} />
              Proyek Baru
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Proyek Aktif" value={activeProjects.length} icon={Folder01Icon} tone="neutral" note="Sedang dipantau" />
          <StatCard title="Review Tertunda" value={pendingReviews} icon={CheckListIcon} tone="amber" note="Butuh tinjauan" />
          <StatCard title="Kelompok Perhatian" value={inactiveGroups} icon={UserMultiple02Icon} tone="rose" note="Perlu follow up" />
          <StatCard title="Efisiensi" value={`${completionRate}%`} icon={MessageMultiple01Icon} tone="green" note="Target stabil" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <DashboardPanel
              title="Proyek Aktif"
              subtitle={`${activeProjects.length} proyek berjalan`}
              action={
                <Link href="/teacher/projects" className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-ktr-text-primary">
                  Semua proyek
                  <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.5} />
                </Link>
              }
            >
              <div className="divide-y divide-ktr-border-light">
                {activeProjects.slice(0, 4).map((project) => {
                  const reviews = project.pendingUploadReviews + project.pendingFinalReviews;
                  return (
                    <Link
                      key={project.id}
                      href={`/teacher/projects/${project.id}`}
                      className="grid cursor-pointer gap-3 py-4 transition-[color,transform] first:pt-0 last:pb-0 hover:text-ktr-text-primary active:scale-[0.998] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-3">
                          <p className="truncate text-[15px] font-semibold text-ktr-text-primary">{project.name}</p>
                          <StatusBadge status={project.status} />
                        </div>
                        <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">{project.className}</p>
                      </div>
                      <div className="grid w-full gap-x-5 gap-y-2 text-xs font-medium text-ktr-text-secondary sm:w-[520px] sm:grid-cols-[140px_150px_1fr] sm:items-center">
                        <MetaItem icon={UserMultiple02Icon} label={`${project.groups} kelompok`} />
                        <MetaItem icon={Calendar03Icon} label={project.finalDeadline} />
                        <MetaItem icon={CheckListIcon} label={reviews > 0 ? `${reviews} review` : "Tidak ada review"} emphasis={reviews > 0} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </DashboardPanel>

            <DashboardPanel title="Prioritas Hari Ini" subtitle={`${topFollowUps.length} item memerlukan perhatian`}>
              <div className="divide-y divide-ktr-border-light">
                {topFollowUps.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleFollowUpAction(item)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left transition-[color,transform] first:pt-0 last:pb-0 hover:text-ktr-text-primary active:scale-[0.998]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ktr-text-primary">{item.title}</p>
                      <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">{item.target}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ktr-info">{item.action}</span>
                  </button>
                ))}
              </div>
            </DashboardPanel>
          </div>

          <aside className="space-y-6">
            <Card className="rounded-[22px] border border-ktr-border-light bg-white">
              <Card.Content className="p-5 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-ktr-border-light bg-white text-2xl font-semibold text-ktr-text-primary">
                  GK
                </div>
                <p className="mt-4 text-[15px] font-semibold text-ktr-text-primary">Guru KontriLab</p>
                <p className="mt-1 text-sm font-medium text-ktr-text-secondary">Koordinator proyek</p>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-ktr-border-light pt-5">
                  <MiniMetric value={projects.length} label="Proyek" />
                  <MiniMetric value={pendingReviews} label="Review" />
                  <MiniMetric value={needAttentionStudents} label="Siswa" />
                </div>
              </Card.Content>
            </Card>

            <DashboardPanel title="Aktivitas" subtitle="Ringkasan terbaru">
              <div className="space-y-4">
                {followUps.slice(0, 4).map((item, index) => (
                  <button key={`${item.title}-${index}`} type="button" onClick={() => handleFollowUpAction(item)} className="flex w-full cursor-pointer items-start gap-3 border-b border-ktr-border-light pb-4 text-left last:border-b-0 last:pb-0 active:scale-[0.998]">
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center text-ktr-text-primary">
                      <HugeiconsIcon icon={index % 2 === 0 ? CheckListIcon : MessageMultiple01Icon} size={16} strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ktr-text-primary">{item.title}</span>
                      <span className="mt-1 block truncate text-xs font-medium text-ktr-text-secondary">{item.target}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-ktr-text-tertiary">10:{15 + index}</span>
                  </button>
                ))}
              </div>
            </DashboardPanel>
          </aside>
        </section>
      </div>

      <ConfirmModal
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

function DashboardPanel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="rounded-[22px] border border-ktr-border-light bg-white">
      <Card.Header className="flex items-center justify-between gap-4 border-b border-ktr-border-light px-6 py-4">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-lg font-semibold text-ktr-text-primary">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs font-medium text-ktr-text-secondary">{subtitle}</p> : null}
        </div>
        {action}
      </Card.Header>
      <Card.Content className="p-6">{children}</Card.Content>
    </Card>
  );
}

function MetaItem({ icon, label, emphasis }: { icon: typeof Calendar03Icon; label: string; emphasis?: boolean }) {
  return (
    <span className={emphasis ? "flex items-center gap-1.5 font-semibold text-ktr-warning" : "flex items-center gap-1.5 text-ktr-text-secondary"}>
      <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} />
      {label}
    </span>
  );
}

function MiniMetric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="min-w-0">
      <p className="text-lg font-semibold text-ktr-text-primary">{value}</p>
      <p className="mt-1 truncate text-xs font-medium text-ktr-text-secondary">{label}</p>
    </div>
  );
}
