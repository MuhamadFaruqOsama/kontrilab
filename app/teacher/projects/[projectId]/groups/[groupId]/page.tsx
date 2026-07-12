"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  FloppyDiskIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import TeacherBackButton from "@/components/teacher/BackButton";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import {
  getGroup,
  getProject,
  teacherStudents,
  uploadProgress,
} from "@/components/teacher/mock-data";

export default function GroupDetail() {
  const params = useParams<{ projectId: string; groupId: string }>();
  const project = getProject(params.projectId);
  const group = getGroup(project.id, params.groupId);
  const memberRows = teacherStudents
    .filter((s) =>
      group.members.some((m) => s.name.startsWith(m.split(" ")[0]))
    )
    .slice(0, group.members.length);

  const groupUploads = uploadProgress.filter((u) => u.projectId === project.id);

  const [notes, setNotes] = React.useState("");
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [savedNotes, setSavedNotes] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadingTimer = window.setTimeout(() => setLoading(false), 120);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  function confirmSaveNotes() {
    setSavedNotes(notes);
    toast.success("Catatan disimpan", {
      description: "Catatan internal kelompok berhasil diperbarui.",
    });
  }

  if (loading) return <GroupDetailSkeleton />;

  return (
    <>
      <div className="space-y-6">
        <TeacherBackButton href={`/teacher/projects/${project.id}`} label="Kembali ke detail proyek" />

        <div className="min-w-0">
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
              {group.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">
                {project.name}
              </span>
              <StatusBadge status={group.status} />
              <StatusBadge status={group.submitStatus} />
            </div>
          </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Upload terakhir", value: group.latestUpload },
            { label: "Aktif upload", value: group.activeUploaders },
            {
              label: "Review tertunda",
              value: `${group.pendingReviews} item`,
              warning: group.pendingReviews > 0,
            },
            {
              label: "Status perhatian",
              value: group.attention,
              success: group.attention === "Aktif",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[12px] border p-4 ${
                stat.warning
                  ? "border-ktr-warning/25 bg-ktr-warning-bg"
                  : "border-ktr-border-light bg-white"
              }`}
            >
              <p className="text-xs font-semibold text-ktr-text-tertiary">{stat.label}</p>
              <p
                className={`mt-1.5 text-sm font-semibold ${
                  stat.warning
                    ? "text-ktr-warning"
                    : stat.success
                    ? "text-ktr-success"
                    : "text-ktr-text-primary"
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {/* Member table */}
            <Card className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-white">
              <Card.Header className="flex items-center justify-between border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Anggota &amp; Upload Progress
                </h2>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ktr-text-secondary">
                  <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={2} />
                  {group.members.length} siswa
                </span>
              </Card.Header>
              <Card.Content className="overflow-x-auto p-0">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ktr-border-light bg-ktr-surface-soft text-ktr-text-secondary">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Nama</th>
                      <th className="px-5 py-3 font-semibold">Aktivitas</th>
                      <th className="px-5 py-3 font-semibold">Upload Terakhir</th>
                      <th className="px-5 py-3 font-semibold">Bukti Valid</th>
                      <th className="px-5 py-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ktr-border-light">
                    {memberRows.map((student) => (
                      <tr key={student.id} className="transition-colors hover:bg-ktr-surface-soft/50">
                        <td className="px-5 py-4 font-semibold text-ktr-text-primary">
                          {student.name}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={student.status} />
                        </td>
                        <td className="px-5 py-4 text-ktr-text-secondary">{student.latestUpload}</td>
                        <td className="px-5 py-4 font-semibold text-ktr-text-primary">
                          {student.validatedEvidence}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/teacher/students/${student.id}`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-ktr-text-primary hover:underline"
                          >
                            Detail
                            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Content>
            </Card>

            {/* Contribution timeline */}
            <Card className="rounded-[12px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Timeline Kontribusi
                </h2>
              </Card.Header>
              <Card.Content className="divide-y divide-ktr-border-light p-0">
                {groupUploads.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/teacher/review/${item.id}`}
                    className="block px-6 py-4 transition-colors hover:bg-ktr-surface-soft/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ktr-text-primary">{item.student}</p>
                        <p className="mt-1 text-sm leading-5 text-ktr-text-secondary">{item.summary}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ktr-text-tertiary">
                          <span>{item.evidenceType}</span><DotSeparator /><span>{item.time}</span>
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </Link>
                ))}
                {groupUploads.length === 0 && (
                  <div className="px-6 py-6 text-sm text-ktr-text-secondary">
                    Belum ada upload progress untuk kelompok ini.
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar: summary + notes */}
          <div className="space-y-6">
            <Card className="rounded-[12px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Ringkasan Kelompok
                </h2>
              </Card.Header>
              <Card.Content className="space-y-4 p-6 text-sm">
                <p className="text-ktr-text-secondary">
                  Upload terakhir:{" "}
                  <span className="font-semibold text-ktr-text-primary">{group.latestUpload}</span>
                </p>
                <p className="text-ktr-text-secondary">
                  Anggota aktif upload:{" "}
                  <span className="font-semibold text-ktr-text-primary">{group.activeUploaders}</span>
                </p>
                <p className="text-ktr-text-secondary">
                  Review tertunda:{" "}
                  <span className={`font-semibold ${group.pendingReviews > 0 ? "text-ktr-warning" : "text-ktr-text-primary"}`}>
                    {group.pendingReviews}
                  </span>
                </p>
                <p className="text-ktr-text-secondary">
                  Status perhatian:{" "}
                  <span className={`font-semibold ${group.attention === "Aktif" ? "text-ktr-success" : "text-ktr-warning"}`}>
                    {group.attention}
                  </span>
                </p>
              </Card.Content>
            </Card>

            <Card className="rounded-[12px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Catatan Guru
                </h2>
              </Card.Header>
              <Card.Content className="p-5">
                <textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-[12px] border border-ktr-border-light bg-white p-3 text-sm leading-6 text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-text-primary focus:outline-none"
                  placeholder="Tambahkan catatan internal untuk kelompok ini. Catatan ini tidak terlihat oleh siswa."
                />
                {savedNotes && (
                  <p className="mt-2 text-xs text-ktr-success">✓ Catatan tersimpan</p>
                )}
                <button
                  type="button"
                  onClick={() => setSaveOpen(true)}
                  disabled={!notes || notes === savedNotes}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-ktr-text-primary px-4 text-sm font-semibold text-ktr-text-white transition-colors hover:bg-ktr-text-primary/95 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <HugeiconsIcon icon={FloppyDiskIcon} size={16} strokeWidth={2} />
                  Simpan Catatan
                </button>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        theme="teacher"
        open={saveOpen}
        onOpenChange={setSaveOpen}
        title="Simpan catatan?"
        description="Catatan ini hanya terlihat oleh guru dan tidak akan dikirim ke siswa."
        confirmText="Simpan"
        onConfirm={confirmSaveNotes}
      />
    </>
  );
}

function DotSeparator() {
  return <span className="size-1 rounded-full bg-ktr-text-tertiary/35" aria-hidden="true" />;
}

function GroupDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="teacher-skeleton size-11" />
        <div className="min-w-0">
          <div className="teacher-skeleton h-9 w-44" />
          <div className="mt-3 flex gap-2">
            <div className="teacher-skeleton h-6 w-40" />
            <div className="teacher-skeleton h-6 w-20" />
            <div className="teacher-skeleton h-6 w-28" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[12px] border border-ktr-border-light bg-white p-4">
            <div className="teacher-skeleton h-4 w-24" />
            <div className="teacher-skeleton mt-2 h-5 w-20" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="teacher-skeleton h-6 w-56" />
              <div className="teacher-skeleton h-4 w-16" />
            </div>
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="teacher-skeleton h-10 w-full" />)}
            </div>
          </div>
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
            <div className="teacher-skeleton h-6 w-44" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => <div key={index} className="teacher-skeleton h-12 w-full" />)}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-6">
            <div className="teacher-skeleton h-6 w-40" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="teacher-skeleton h-4 w-full" />)}
            </div>
          </div>
          <div className="rounded-[12px] border border-ktr-border-light bg-white p-5">
            <div className="teacher-skeleton h-6 w-32" />
            <div className="teacher-skeleton mt-5 h-36 w-full" />
            <div className="teacher-skeleton mt-4 h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
