"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message02Icon,
  Folder01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons";
import StatCard from "@/components/teacher/StatCard";
import StatusBadge from "@/components/teacher/StatusBadge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { getStudent, uploadProgress } from "@/components/teacher/mock-data";

export default function StudentDetail() {
  const params = useParams<{ studentId: string }>();
  const student = getStudent(params.studentId);
  const uploads = uploadProgress.filter((item) => item.studentId === student.id);

  const [notes, setNotes] = React.useState("");
  const [savedNotes, setSavedNotes] = React.useState("");
  const [messageOpen, setMessageOpen] = React.useState(false);
  const [saveOpen, setSaveOpen] = React.useState(false);

  const consistency =
    student.status === "Sangat Aktif"
      ? "Tinggi"
      : student.status === "Aktif"
      ? "Stabil"
      : "Perlu dicek";

  const statTone = (status: string): "green" | "amber" | "rose" | "neutral" =>
    status === "Sangat Aktif" ? "green" : status === "Aktif" ? "neutral" : "rose";

  function sendMessage() {
    toast.success("Pesan terkirim", {
      description: `Pesan berhasil dikirim ke ${student.name}.`,
    });
  }

  function saveNotes() {
    setSavedNotes(notes);
    toast.success("Catatan disimpan", {
      description: `Catatan internal untuk ${student.name} berhasil diperbarui.`,
    });
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/teacher/students"
              className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[14px] border border-ktr-border-light bg-white transition-colors hover:bg-ktr-surface-soft active:scale-[0.995]"
              aria-label="Kembali ke daftar siswa"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">
                {student.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">
                  {student.className}
                </span>
                <StatusBadge status={student.status} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMessageOpen(true)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] border border-ktr-border-light bg-white px-4 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input hover:bg-ktr-surface-soft active:scale-[0.995]"
            >
              <HugeiconsIcon icon={Message02Icon} size={16} />
              Kirim Pesan
            </button>
            <Link
              href={`/teacher/projects`}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[14px] bg-ktr-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover active:scale-[0.995]"
            >
              <HugeiconsIcon icon={Folder01Icon} size={16} />
              Lihat Proyek
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard title="Upload Progress" value={student.uploads} tone={statTone(student.status)} />
          <StatCard title="Konsistensi" value={consistency} tone={statTone(student.status)} />
          <StatCard title="Bukti Valid" value={student.validatedEvidence} tone="green" />
          <StatCard title="Respons Feedback" value={student.feedbackResponse} />
          <StatCard title="Upload Terakhir" value={student.latestUpload} />
        </div>

        {/* Attention banner */}
        {(student.status === "Perlu Perhatian" || student.status === "Tidak Ada Aktivitas Terbaru") && (
          <div className="flex items-start gap-3 rounded-[16px] border border-ktr-warning/25 bg-ktr-warning-bg px-5 py-4">
            <p className="text-sm font-medium text-[#9a620b]">
              ⚠️ <span className="font-semibold">{student.name}</span> membutuhkan perhatian guru: {student.reason}
            </p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Contributions */}
          <Card className="overflow-hidden rounded-[18px] border border-ktr-border-light bg-white">
            <Card.Header className="border-b border-ktr-border-light px-6 py-4">
              <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                Riwayat Kontribusi
              </h2>
            </Card.Header>
            <Card.Content className="divide-y divide-ktr-border-light p-0">
              {uploads.length > 0 ? (
                uploads.map((upload) => (
                  <Link
                    key={upload.id}
                    href={`/teacher/review/${upload.id}`}
                    className="block px-6 py-5 transition-colors hover:bg-ktr-surface-soft/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold text-ktr-text-primary">{upload.group}</p>
                      <StatusBadge status={upload.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ktr-text-secondary">{upload.summary}</p>
                    <p className="mt-2 text-xs font-semibold text-ktr-text-tertiary">
                      {upload.evidenceType} · {upload.time} · {upload.relevance}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-sm text-ktr-text-secondary">
                  Belum ada Upload Progress untuk siswa ini.
                </div>
              )}
            </Card.Content>
          </Card>

          <div className="space-y-6">
            {/* Summary */}
            <Card className="rounded-[18px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Ringkasan
                </h2>
              </Card.Header>
              <Card.Content className="space-y-4 p-6 text-sm">
                <p className="text-ktr-text-secondary">
                  Proyek aktif:{" "}
                  <span className="font-semibold text-ktr-text-primary">{student.activeProject}</span>
                </p>
                <p className="leading-6 text-ktr-text-secondary">{student.reason}</p>
              </Card.Content>
            </Card>

            {/* Notes */}
            <Card className="rounded-[18px] border border-ktr-border-light bg-white">
              <Card.Header className="border-b border-ktr-border-light px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-ktr-text-primary">
                  Catatan Internal
                </h2>
              </Card.Header>
              <Card.Content className="p-5">
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-[14px] border border-ktr-border-light bg-white p-3 text-sm leading-6 text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-primary focus:outline-none focus:ring-2 focus:ring-ktr-primary/20"
                  placeholder="Catatan internal guru — tidak terlihat oleh siswa."
                />
                {savedNotes && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-ktr-success">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                    Catatan tersimpan
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSaveOpen(true)}
                  disabled={!notes || notes === savedNotes}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-ktr-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-ktr-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                  Simpan Catatan
                </button>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>

      {/* Send message confirm */}
      <ConfirmModal
        open={messageOpen}
        onOpenChange={setMessageOpen}
        title={`Kirim pesan ke ${student.name}?`}
        description="Pesan singkat akan dikirim sebagai notifikasi untuk siswa. Pastikan pesanmu jelas dan spesifik."
        confirmText="Kirim Pesan"
        onConfirm={sendMessage}
      />

      {/* Save notes confirm */}
      <ConfirmModal
        open={saveOpen}
        onOpenChange={setSaveOpen}
        title="Simpan catatan?"
        description="Catatan internal hanya terlihat oleh guru dan tidak akan ditampilkan ke siswa."
        confirmText="Simpan"
        onConfirm={saveNotes}
      />
    </>
  );
}
