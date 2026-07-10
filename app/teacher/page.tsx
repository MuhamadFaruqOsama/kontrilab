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
  Notification03Icon,
  PlusSignIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@heroui/react/card";
import FilterSelect from "@/components/teacher/FilterSelect";
import StatCard from "@/components/teacher/StatCard";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import {
  teacherProjects,
  followUps,
  teacherStudents,
} from "@/components/teacher/mock-data";

const semesterOptions = [
  "Semester Genap 2026",
  "Semester Ganjil 2025",
  "Semester Genap 2025",
].map((label) => ({ value: label.toLowerCase().replaceAll(" ", "-"), label }));

export default function TeacherDashboard() {
  const router = useRouter();
  const [reminderOpen, setReminderOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState("");

  const needAttentionStudents = teacherStudents.filter(
    (s) => s.status === "Perlu Perhatian" || s.status === "Tidak Ada Aktivitas Terbaru"
  ).length;
  const pendingReviews = teacherProjects.reduce(
    (total, p) => total + p.pendingUploadReviews + p.pendingFinalReviews,
    0
  );
  const activeProjects = teacherProjects.filter((p) => p.status === "Aktif");
  const inactiveGroups = teacherProjects.reduce((total, p) => total + p.inactiveGroups, 0);

  function handleFollowUpAction(item: (typeof followUps)[number]) {
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
      <div className="space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
              Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-ktr-text-secondary">
              Pantau progres proyek dan aktivitas siswa secara keseluruhan.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FilterSelect
              className="w-56"
              ariaLabel="Pilih semester"
              defaultValue="semester-genap-2026"
              options={semesterOptions}
            />
            <Link
              href="/teacher/projects"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] bg-ktr-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover active:scale-[0.995]"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Proyek Baru
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Proyek Aktif"
            value={activeProjects.length}
            icon={Folder01Icon}
            tone="green"
            note="Sedang berjalan."
          />
          <StatCard
            title="Review Tertunda"
            value={pendingReviews}
            icon={CheckListIcon}
            tone="amber"
            note="Butuh ditinjau."
          />
          <StatCard
            title="Kelompok Perhatian"
            value={inactiveGroups}
            icon={UserMultiple02Icon}
            tone="blue"
            note="Tanpa aktivitas terbaru."
          />
          <StatCard
            title="Siswa Perhatian"
            value={needAttentionStudents}
            icon={MessageMultiple01Icon}
            tone="rose"
            note="Butuh follow up."
          />
        </div>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          {/* Priority follow-ups */}
          <Card className="rounded-[18px] border border-ktr-border-light bg-white">
            <Card.Header className="flex items-center justify-between border-b border-ktr-border-light px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Prioritas Hari Ini
                </h2>
                <p className="mt-0.5 text-xs font-medium text-ktr-text-secondary">
                  {followUps.length} item memerlukan perhatian
                </p>
              </div>
              <Link
                href="/teacher/review"
                className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-ktr-primary"
              >
                Lihat review
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Card.Header>
            <Card.Content className="divide-y divide-ktr-border-light p-0">
              {followUps.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleFollowUpAction(item)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-ktr-surface-soft/70 active:scale-[0.998]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ktr-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-ktr-text-secondary">
                      {item.target}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-ktr-primary-light px-3 py-1 text-xs font-semibold text-ktr-primary">
                    {item.action}
                  </span>
                </button>
              ))}
            </Card.Content>
          </Card>

          {/* Active projects */}
          <Card className="rounded-[18px] border border-ktr-border-light bg-white">
            <Card.Header className="flex items-center justify-between border-b border-ktr-border-light px-6 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Proyek Aktif
                </h2>
                <p className="mt-0.5 text-xs font-medium text-ktr-text-secondary">
                  {activeProjects.length} proyek sedang berjalan
                </p>
              </div>
              <Link
                href="/teacher/projects"
                className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-ktr-primary"
              >
                Semua proyek
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Card.Header>
            <Card.Content className="space-y-3 p-5">
              {activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/teacher/projects/${project.id}`}
                  className="block cursor-pointer rounded-[18px] border border-ktr-border-light p-4 transition-[border-color,background,transform] hover:border-ktr-border-input hover:bg-ktr-primary-light active:scale-[0.998]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ktr-text-primary">
                        {project.name}
                      </p>
                      <p className="mt-1 text-sm font-medium text-ktr-text-secondary">
                        {project.className}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs font-medium text-ktr-text-secondary">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={UserMultiple02Icon} size={13} />
                      {project.groups} kelompok
                    </span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} size={13} />
                      {project.finalDeadline}
                    </span>
                    {project.pendingUploadReviews + project.pendingFinalReviews > 0 && (
                      <span className="flex items-center gap-1 font-semibold text-ktr-warning">
                        <HugeiconsIcon icon={CheckListIcon} size={13} />
                        {project.pendingUploadReviews + project.pendingFinalReviews} review
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </Card.Content>
          </Card>
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
