"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  Alert01Icon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons";
import TeacherBackButton from "@/components/teacher/BackButton";
import StatusBadge from "@/components/teacher/StatusBadge";
import { getStudent, teacherProjects, uploadProgress } from "@/components/teacher/mock-data";



export default function StudentDetail() {
  const params = useParams<{ studentId: string }>();
  const student = getStudent(params.studentId);
  const uploads = uploadProgress.filter((item) => item.studentId === student.id);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  const isAttention = student.status === "Perlu Perhatian" || student.status === "Tidak Ada Aktivitas Terbaru";
  const uploadCount = uploads.length;
  const validEvidence = student.validatedEvidence;
  const discussionScore = student.status === "Sangat Aktif" ? 92 : student.status === "Aktif" ? 78 : student.status === "Perlu Perhatian" ? 48 : 18;
  const responseScore = student.feedbackResponse === "Sudah merespons" ? 86 : student.feedbackResponse === "Perlu klarifikasi" ? 54 : 22;
  const uploadScore = Math.min(100, Math.max(12, student.uploads * 18));
  const consistencyScore = Math.round((discussionScore + responseScore + uploadScore) / 3);
  const projectSeries = teacherProjects.map((project, index) => {
    const projectUploads = uploadProgress.filter((item) => item.studentId === student.id && item.projectId === project.id).length;
    const projectBase = projectUploads > 0 ? Math.min(100, 42 + projectUploads * 18) : Math.max(8, consistencyScore - 12 - index * 5);
    const value = Math.max(6, Math.min(100, projectBase));
    return {
      label: project.name,
      shortLabel: project.name.replace("Website Profil Sekolah", "Profil").replace("Landing Page UMKM", "UMKM").replace("Poster Kampanye Digital", "Poster"),
      value,
      note: projectUploads > 0 ? `${projectUploads} kontribusi tercatat di ${project.name}.` : `Belum ada kontribusi tercatat di ${project.name}.`,
    };
  });
  const summaryText = uploadCount > 0
    ? `${student.name} sudah mengirim ${uploadCount} kontribusi selama semester ini. Pola kontribusinya menunjukkan ${student.reason.toLowerCase()} Fokus pendampingan berikutnya adalah menjaga respons feedback dan bukti kerja tetap relevan pada setiap proyek.`
    : `${student.name} belum memiliki kontribusi tercatat pada proyek semester ini. Siswa perlu dorongan awal untuk mulai mengirim bukti kerja, ikut diskusi kelompok, dan merespons arahan guru agar kontribusinya dapat dihitung secara lebih akurat.`;

  if (loading) return <StudentDetailSkeleton />;

  return (
    <div className="space-y-7">
      <TeacherBackButton href="/teacher/students" label="Kembali ke daftar siswa" />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">{student.name}</h1>
        </div>
        <div className="w-full rounded-[12px] border border-ktr-border-light bg-white p-4 sm:w-[250px]">
          <p className="text-sm font-semibold text-ktr-text-secondary">Skor keaktifan</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="font-heading text-4xl font-semibold leading-none text-ktr-text-primary">{consistencyScore}%</p>
            <span className={consistencyScore < 50 ? "text-sm font-semibold text-ktr-warning" : "text-sm font-semibold text-ktr-success"}>
              {consistencyScore < 50 ? "Perlu dibantu" : "Stabil"}
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-ktr-surface-soft">
            <div className="h-full rounded-full bg-ktr-text-primary" style={{ width: `${Math.max(4, consistencyScore)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard title="Upload Progress" value={`${student.uploads}`} detail="Total kontribusi tercatat" icon={CheckListIcon} />
        <InsightCard title="Partisipasi Diskusi" value={`${discussionScore}%`} detail="Ikut dan merespons sesi" icon={MessageMultiple01Icon} tone={discussionScore < 50 ? "warning" : "neutral"} />
        <InsightCard title="Skor Keaktifan" value={`${consistencyScore}%`} detail="Kalkulasi seluruh proyek" icon={CheckmarkCircle02Icon} tone={consistencyScore < 50 ? "warning" : "neutral"} />
        <InsightCard title="Respons Feedback" value={`${responseScore}%`} detail={student.feedbackResponse} icon={Activity01Icon} tone={responseScore < 50 ? "warning" : "neutral"} />
      </div>

      {isAttention ? (
        <div className="flex items-start gap-3 rounded-[12px] border border-ktr-warning/25 bg-ktr-warning-bg px-5 py-4 text-sm font-medium text-ktr-warning">
          <HugeiconsIcon icon={Alert01Icon} size={18} strokeWidth={2} className="mt-0.5 shrink-0" />
          <p><span className="font-semibold">{student.name}</span> membutuhkan perhatian guru: {student.reason}</p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="rounded-[12px] border border-ktr-border-light bg-white">
            <Card.Header className="border-b border-ktr-border-light px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">Grafik Keaktifan per Proyek</h2>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="flex h-48 items-end gap-3">
                {projectSeries.map((item) => (
                  <div key={item.label} className="group relative flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-36 w-full items-end rounded-[10px] bg-ktr-surface-soft px-1.5 py-1.5">
                      <div className="w-full rounded-[8px] bg-ktr-text-primary transition-[height]" style={{ height: `${Math.max(10, item.value)}%` }} aria-label={`Keaktifan ${item.label} ${item.value}%`} />
                    </div>
                    <span className="max-w-full truncate text-xs font-semibold text-ktr-text-tertiary">{item.shortLabel}</span>
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 w-48 -translate-x-1/2 rounded-[10px] border border-ktr-border-light bg-white px-3 py-2 text-left text-xs font-medium leading-5 text-ktr-text-secondary opacity-0 shadow-[0_12px_30px_rgba(43,48,51,0.08)] transition-opacity group-hover:opacity-100">
                      <strong className="block text-ktr-text-primary">{item.value}% aktif</strong>
                      {item.note}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-ktr-text-secondary">
                Grafik membandingkan tingkat kontribusi siswa pada proyek yang pernah diikuti selama semester berjalan. Arahkan kursor ke setiap grafik untuk melihat konteksnya.
              </p>
            </Card.Content>
          </Card>

          <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
            <Card.Header className="border-b border-ktr-border-light px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">Riwayat Kontribusi</h2>
            </Card.Header>
            <Card.Content className="divide-y divide-ktr-border-light p-0">
              {uploads.length > 0 ? (
                uploads.map((upload) => (
                  <Link key={upload.id} href={`/teacher/review/${upload.id}`} className="block px-6 py-5 transition-colors hover:bg-ktr-surface-soft/40">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold text-ktr-text-primary">{upload.group}</p>
                      <StatusBadge status={upload.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ktr-text-secondary">{upload.summary}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-ktr-text-tertiary">
                      <span>{upload.evidenceType}</span>
                      <DotSeparator />
                      <span>{upload.time}</span>
                      <DotSeparator />
                      <span>{upload.relevance}</span>
                    </p>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">Belum ada Upload Progress untuk siswa ini.</div>
              )}
            </Card.Content>
          </Card>
        </div>

        <Card className="rounded-[12px] border border-ktr-border-light bg-white">
          <Card.Header className="border-b border-ktr-border-light px-6 py-4">
            <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">Analisis Siswa</h2>
          </Card.Header>
          <Card.Content className="space-y-5 p-6">
            <MetricRow label="Ikut diskusi" value={discussionScore} />
            <MetricRow label="Respons feedback" value={responseScore} />
            <MetricRow label="Upload bukti" value={uploadScore} />
            <MetricRow label="Konsistensi keseluruhan" value={consistencyScore} />
            <p className="text-sm leading-6 text-ktr-text-secondary">{summaryText}</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

function InsightCard({ title, value, detail, icon, tone = "neutral" }: { title: string; value: string; detail: string; icon: typeof CheckListIcon; tone?: "neutral" | "warning" }) {
  return (
    <Card className="rounded-[12px] border border-ktr-border-light bg-white">
      <Card.Content className="p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold text-ktr-text-secondary">{title}</p>
          <span className="text-ktr-text-primary"><HugeiconsIcon icon={icon} size={18} strokeWidth={2} /></span>
        </div>
        <p className={tone === "warning" ? "mt-7 text-2xl font-semibold leading-tight text-ktr-warning" : "mt-7 text-2xl font-semibold leading-tight text-ktr-text-primary"}>{value}</p>
        <p className="mt-3 text-sm font-medium text-ktr-text-secondary">{detail}</p>
      </Card.Content>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-ktr-text-secondary">{label}</span>
        <span className="font-semibold text-ktr-text-primary">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-ktr-surface-soft">
        <div className="h-full rounded-full bg-ktr-text-primary" style={{ width: `${Math.max(4, value)}%` }} />
      </div>
    </div>
  );
}

function DotSeparator() {
  return <span className="size-1 rounded-full bg-ktr-text-tertiary/35" aria-hidden="true" />;
}

function StudentDetailSkeleton() {
  return (
    <div className="space-y-7">
      <div className="teacher-skeleton size-11" />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="teacher-skeleton h-9 w-56" />
        <div className="teacher-skeleton h-[118px] w-full sm:w-[250px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[12px] border border-ktr-border-light bg-white p-5">
            <div className="flex justify-between">
              <div className="teacher-skeleton h-4 w-28" />
              <div className="teacher-skeleton size-5" />
            </div>
            <div className="teacher-skeleton mt-7 h-8 w-20" />
            <div className="teacher-skeleton mt-3 h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
            <div className="teacher-skeleton h-6 w-40" />
            <div className="mt-6 flex h-48 items-end gap-3">
              {Array.from({ length: 7 }).map((_, index) => <div key={index} className="teacher-skeleton h-32 flex-1" />)}
            </div>
          </div>
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
            <div className="teacher-skeleton h-6 w-44" />
            <div className="mt-5 space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="teacher-skeleton h-5 w-40" />
                  <div className="teacher-skeleton h-4 w-full" />
                  <div className="teacher-skeleton h-4 w-56" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
          <div className="teacher-skeleton h-6 w-36" />
          <div className="mt-5 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="teacher-skeleton h-8 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
