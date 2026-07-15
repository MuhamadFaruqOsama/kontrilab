"use client";

import * as React from "react";
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
  getStudentContributionBreakdown,
} from "@/components/teacher/mock-data";

type MemberRow = {
  id: string;
  name: string;
  status: string;
  latestUpload: string;
  validatedEvidence: number;
  feedbackResponse: string;
  activeProject: string;
  reason: string;
  role: "Ketua" | "Anggota";
  contribution: ReturnType<typeof getStudentContributionBreakdown>;
};

type TimelineItem = {
  id: string;
  student: string;
  summary: string;
  evidenceType: string;
  time: string;
  relevance: string;
};
export default function GroupDetail() {
  const params = useParams<{ projectId: string; groupId: string }>();
  const project = getProject(params.projectId);
  const group = getGroup(project.id, params.groupId);
  const memberRows: MemberRow[] = group.members.map((member, index) => {
    const student = teacherStudents.find((item) => item.name === member || item.name.startsWith(member.split(" ")[0]));
    return {
      id: student?.id ?? `member-${index}`,
      name: student?.name ?? member,
      status: student?.status ?? "Tidak Ada Aktivitas Terbaru",
      latestUpload: student?.latestUpload ?? "Belum ada",
      validatedEvidence: student?.validatedEvidence ?? 0,
      feedbackResponse: student?.feedbackResponse ?? "Belum ada feedback",
      activeProject: student?.activeProject ?? project.name,
      reason: student?.reason ?? "Belum ada aktivitas yang tercatat.",
      role: index === 0 ? "Ketua" : "Anggota",
      contribution: getStudentContributionBreakdown(student?.id ?? `member-${index}`, project.id),
    };
  });

  const groupUploads = uploadProgress.filter((u) => u.projectId === project.id && group.members.some((member) => u.student.startsWith(member.split(" ")[0])));
  const timelineItems: TimelineItem[] = groupUploads.length > 0 ? groupUploads.map((item) => ({
    id: item.id,
    student: item.student,
    summary: item.summary,
    evidenceType: item.evidenceType,
    time: item.time,
    relevance: item.relevance,
  })) : group.members.map((member, index) => ({
    id: `dummy-${group.id}-${index}`,
    student: member,
    summary: index === 0 ? "Menyiapkan pembagian tugas awal dan mengumpulkan referensi proyek." : index === 1 ? "Mencatat kebutuhan aset dan bukti kerja yang perlu dilampirkan." : "Mulai mengirim progres awal agar kontribusi dapat terbaca.",
    evidenceType: index === 0 ? "Catatan" : index === 1 ? "Checklist" : "Status",
    time: index === 0 ? "Hari ini" : index === 1 ? "Kemarin" : "Perlu progres",
    relevance: project.name,
  }));

  const [notes, setNotes] = React.useState("");
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [savedNotes, setSavedNotes] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedMember, setSelectedMember] = React.useState<MemberRow | null>(null);
  const [selectedTimeline, setSelectedTimeline] = React.useState<TimelineItem | null>(null);

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
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="text-ktr-text-secondary">{project.name}</span>
              <DotSeparator />
              <span className={group.status === "Aktif" ? "text-ktr-success" : group.status === "Selesai" ? "text-ktr-info" : "text-ktr-warning"}>{group.status}</span>
              <DotSeparator />
              <span className="text-ktr-info">{group.submitStatus}</span>
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
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="font-semibold text-ktr-text-primary">{student.name}</span>
                            {student.role === "Ketua" ? <span className="rounded-full bg-ktr-surface-soft px-2 py-0.5 text-[11px] font-semibold text-ktr-text-secondary">Ketua</span> : null}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={student.status} />
                        </td>
                        <td className="px-5 py-4 text-ktr-text-secondary">{student.latestUpload}</td>
                        <td className="px-5 py-4 font-semibold text-ktr-text-primary">
                          {student.validatedEvidence}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(student)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-ktr-text-primary transition-colors hover:text-ktr-text-secondary"
                          >
                            Detail
                            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
                          </button>
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
                {timelineItems.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTimeline(item)}
                    className="block w-full cursor-pointer px-6 py-4 text-left transition-colors hover:bg-ktr-surface-soft/60"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ktr-text-primary">{item.student}</p>
                      <p className="mt-1 text-sm leading-5 text-ktr-text-secondary">{item.summary}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ktr-text-tertiary">
                        <span>{item.evidenceType}</span><DotSeparator /><span>{item.time}</span>
                      </p>
                    </div>
                  </button>
                ))}
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
                  <p className="mt-2 text-xs text-ktr-success">Catatan tersimpan</p>
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

      <MemberDetailDrawer member={selectedMember} onClose={() => setSelectedMember(null)} />
      <TimelineDetailDrawer item={selectedTimeline} projectName={project.name} onClose={() => setSelectedTimeline(null)} />

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
  return <span className="size-1 rounded-full bg-ktr-text-tertiary/45" aria-hidden="true" />;
}

function MemberDetailDrawer({ member, onClose }: { member: MemberRow | null; onClose: () => void }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Tutup detail anggota" onClick={onClose} className="absolute inset-0 bg-ktr-neutral-1000/20" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-ktr-border-light bg-white p-5 text-ktr-text-primary">
        <div className="flex items-start justify-between gap-4 border-b border-ktr-border-light pb-4">
          <div className="min-w-0">
            <h2 className="font-heading text-xl font-semibold text-ktr-text-primary">{member.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-ktr-text-secondary">
              <span>{member.role}</span>
              <DotSeparator />
              <span>{member.activeProject}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-[10px] text-ktr-text-secondary hover:bg-ktr-surface-soft" aria-label="Tutup">x</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto py-6">
          <div className="rounded-[12px] bg-ktr-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-ktr-text-tertiary">Nilai kontribusi</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="font-heading text-4xl font-semibold leading-none text-ktr-text-primary">{member.contribution.score}%</p>
              <p className="max-w-[210px] text-right text-xs font-medium leading-5 text-ktr-text-secondary">Berdasarkan peer assessment, diskusi, dan Upload Progress.</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white">
              <div className="h-full rounded-full bg-ktr-text-primary" style={{ width: `${member.contribution.score}%` }} />
            </div>
          </div>

          <div className="mt-7 space-y-6 text-sm">
            <DrawerSection title="Peer assessment" value={`${member.contribution.peerScore}%`} description="Rata-rata penilaian anggota kelompok terhadap kontribusi siswa ini." />
            <DrawerSection title="Diskusi kelompok" value={`${member.contribution.discussionScore}%`} description="Mengukur keterlibatan di diskusi, baik chat maupun panggilan kelompok." />
            <DrawerSection title="Upload Progress" value={`${member.contribution.uploadScore}%`} description={`${member.contribution.uploadCount} bukti progress terhubung dengan proyek ini.`} />
            <DrawerSection title="Respons feedback" value={member.feedbackResponse} description={member.reason} />
          </div>
        </div>
      </aside>
    </div>
  );
}


function TimelineDetailDrawer({ item, projectName, onClose }: { item: TimelineItem | null; projectName: string; onClose: () => void }) {
  if (!item) return null;

  const isEvidenceSpecific = item.evidenceType !== "Status" && item.summary.length > 48;
  const analysis = isEvidenceSpecific
    ? "Bukti ini cukup terbaca untuk dianalisis. Guru dapat mencocokkan ringkasan, jenis bukti, dan relevansi proyek sebelum menentukan validitas kontribusi."
    : "Progress ini masih perlu konteks tambahan. Guru dapat melihatnya sebagai sinyal awal, lalu menunggu bukti kerja yang lebih spesifik untuk analisis validitas.";

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Tutup detail kontribusi" onClick={onClose} className="absolute inset-0 bg-ktr-neutral-1000/20" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-ktr-border-light bg-white p-6 text-ktr-text-primary">
        <div className="flex items-start justify-between gap-4 border-b border-ktr-border-light pb-4">
          <div className="min-w-0">
            <h2 className="font-heading text-xl font-semibold text-ktr-text-primary">Detail Kontribusi</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-ktr-text-secondary">
              <span>{item.student}</span>
              <DotSeparator />
              <span>{projectName}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-[10px] text-ktr-text-secondary hover:bg-ktr-surface-soft" aria-label="Tutup">x</button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-6">
          <div className="rounded-[12px] bg-ktr-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-normal text-ktr-text-tertiary">Ringkasan progress</p>
            <p className="mt-3 text-base font-semibold leading-7 text-ktr-text-primary">{item.summary}</p>
          </div>

          <div className="mt-7 space-y-6 text-sm">
            <DrawerSection title="Jenis bukti" value={item.evidenceType} description="Kategori bukti yang dikirim atau dicatat pada timeline kontribusi." />
            <DrawerSection title="Waktu kontribusi" value={item.time} description="Waktu progress tercatat dalam aktivitas kelompok." />
            <DrawerSection title="Relevansi proyek" value={item.relevance} description="Konteks proyek yang menjadi rujukan kontribusi ini." />
            <section>
              <h3 className="font-heading text-base font-semibold text-ktr-text-primary">Analisis validitas</h3>
              <p className="mt-1 text-sm leading-6 text-ktr-text-secondary">{analysis}</p>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}
function DrawerSection({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-heading text-base font-semibold text-ktr-text-primary">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-ktr-text-secondary">{description}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-ktr-text-primary">{value}</span>
      </div>
    </section>
  );
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

