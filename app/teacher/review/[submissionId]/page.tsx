"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  ExternalLinkIcon,
  FloppyDiskIcon,
  Message02Icon,
} from "@hugeicons/core-free-icons";
import FilterSelect from "@/components/teacher/FilterSelect";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { finalSubmissions, uploadProgress } from "@/components/teacher/mock-data";

const uploadStatusOptions = ["Valid", "Perlu Klarifikasi", "Kurang Relevan"].map((label) => ({
  value: label.toLowerCase().replaceAll(" ", "-"),
  label,
}));
const finalStatusOptions = ["Disetujui", "Perlu Revisi", "Belum Lengkap"].map((label) => ({
  value: label.toLowerCase().replaceAll(" ", "-"),
  label,
}));

export default function ReviewDetailPage() {
  const params = useParams<{ submissionId: string }>();
  const upload = uploadProgress.find((item) => item.id === params.submissionId) ?? uploadProgress[0];
  const submission = finalSubmissions.find((item) => item.id === params.submissionId);
  const isFinal = Boolean(submission);

  const [feedback, setFeedback] = React.useState("");
  const [reviewStatus, setReviewStatus] = React.useState(
    isFinal ? "disetujui" : upload.status === "Valid" ? "valid" : "belum-direview"
  );
  const [sendOpen, setSendOpen] = React.useState(false);
  const [savingDraft, setSavingDraft] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function saveDraft() {
    setSavingDraft(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingDraft(false);
    toast.success("Draft disimpan", {
      description: "Feedback akan tersimpan hingga kamu siap mengirimkannya.",
    });
  }

  function sendFeedback() {
    setSent(true);
    toast.success("Feedback berhasil dikirim", {
      description: `${isFinal ? submission?.group : upload.student} akan menerima notifikasi feedback.`,
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-ktr-success-bg text-ktr-success">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} />
        </span>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-ktr-text-primary">
            Feedback Terkirim!
          </h2>
          <p className="mt-2 text-sm font-medium text-ktr-text-secondary">
            {isFinal ? submission?.group : upload.student} akan mendapatkan notifikasi segera.
          </p>
        </div>
        <Link
          href="/teacher/review"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] border border-ktr-border-light px-5 text-sm font-semibold text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
        >
          Kembali ke daftar review
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Link
            href="/teacher/review"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-ktr-border-light bg-white transition-colors hover:bg-ktr-surface-soft"
            aria-label="Kembali ke daftar review"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
              {isFinal ? "Review Submit Final" : "Review Upload Progress"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={isFinal && submission ? submission.status : upload.status} />
              <span className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">
                {isFinal && submission ? submission.group : upload.student}
              </span>
              {!isFinal && (
                <span className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">
                  {upload.group}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Evidence panel */}
          <div className="space-y-5">
            <Card className="rounded-[18px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  {isFinal ? "Hasil Akhir Kelompok" : "Bukti Kerja Siswa"}
                </h2>
              </Card.Header>
              <Card.Content className="space-y-5 p-6 text-sm">
                {isFinal && submission ? (
                  <>
                    <DetailRow label="Kelompok" value={submission.group} />
                    <DetailRow label="Anggota" value={submission.members} />
                    <DetailRow label="Waktu Submit" value={submission.submittedAt} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ktr-text-tertiary">
                        File / Link Hasil Akhir
                      </p>
                      <a
                        href={`https://${submission.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-[12px] border border-ktr-border-light bg-ktr-surface-soft px-4 py-2 text-sm font-semibold text-ktr-primary transition-colors hover:border-ktr-primary/30"
                      >
                        {submission.file}
                        <HugeiconsIcon icon={ExternalLinkIcon} size={14} />
                      </a>
                    </div>
                    <div className="rounded-[14px] border border-ktr-border-light bg-ktr-surface-soft p-4 text-sm text-ktr-text-secondary">
                      <p className="font-semibold text-ktr-text-primary">Riwayat Revisi</p>
                      <p className="mt-1">Submit awal sudah diterima dan menunggu keputusan guru.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <DetailRow label="Siswa" value={upload.student} />
                    <DetailRow label="Kelompok" value={upload.group} />
                    <DetailRow label="Jenis Bukti" value={upload.evidenceType} />
                    <DetailRow label="Waktu Upload" value={upload.time} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ktr-text-tertiary">
                        Isi Upload Progress
                      </p>
                      <p className="mt-2 leading-6 text-ktr-text-secondary">{upload.summary}</p>
                    </div>
                    <div className="rounded-[14px] border border-ktr-border-light bg-ktr-surface-soft p-4">
                      <p className="text-xs font-semibold text-ktr-text-tertiary">Preview Bukti</p>
                      <p className="mt-2 text-sm text-ktr-text-secondary">
                        {upload.evidenceType} · {upload.relevance}
                      </p>
                    </div>
                  </>
                )}
              </Card.Content>
            </Card>

            {/* Rubric card */}
            <Card className="rounded-[18px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-base font-semibold text-ktr-text-primary">
                  Rubrik Penilaian
                </h2>
              </Card.Header>
              <Card.Content className="p-5">
                <ul className="space-y-2 text-sm text-ktr-text-secondary">
                  {[
                    "Kontribusi individu yang terlihat jelas",
                    "Kejelasan dan kelengkapan bukti kerja",
                    "Relevansi pekerjaan dengan topik proyek",
                    "Konsistensi dan frekuensi aktivitas",
                    "Respons terhadap feedback sebelumnya",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={15}
                        className="mt-0.5 shrink-0 text-ktr-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card.Content>
            </Card>
          </div>

          {/* Review panel */}
          <div className="space-y-5">
            <Card className="rounded-[18px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Panel Review
                </h2>
              </Card.Header>
              <Card.Content className="space-y-5 p-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-ktr-text-primary">
                    Status Review
                  </label>
                  <FilterSelect
                    className="w-full"
                    ariaLabel="Status review"
                    defaultValue={reviewStatus}
                    options={isFinal ? finalStatusOptions : uploadStatusOptions}
                    onChange={setReviewStatus}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-ktr-text-primary">
                    Feedback untuk {isFinal ? "Kelompok" : "Siswa"}
                  </label>
                  <textarea
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full resize-none rounded-[14px] border border-ktr-border-light bg-white p-3 text-sm leading-6 text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-primary focus:outline-none focus:ring-2 focus:ring-ktr-primary/20"
                    placeholder={`Tulis feedback untuk ${isFinal ? "kelompok" : "siswa"} ini. Semakin spesifik, semakin membantu.`}
                  />
                  <p className="text-xs text-ktr-text-tertiary">{feedback.length} karakter</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    disabled={savingDraft}
                    onClick={saveDraft}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-ktr-border-light px-5 text-sm font-semibold text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft disabled:opacity-60"
                  >
                    <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                    {savingDraft ? "Menyimpan…" : "Simpan Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendOpen(true)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-ktr-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover active:scale-[0.995]"
                  >
                    <HugeiconsIcon icon={Message02Icon} size={16} />
                    Kirim Feedback
                  </button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={sendOpen}
        onOpenChange={setSendOpen}
        title="Kirim Feedback?"
        description={`Feedback akan dikirim ke ${isFinal ? submission?.group ?? "kelompok" : upload.student}. Status review akan berubah menjadi "${reviewStatus.replaceAll("-", " ")}".`}
        confirmText="Kirim Sekarang"
        onConfirm={sendFeedback}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ktr-text-tertiary">{label}</p>
      <p className="mt-1 font-semibold text-ktr-text-primary">{value}</p>
    </div>
  );
}