import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles = {
  success: "border-ktr-success/20 bg-ktr-success-bg text-ktr-success",
  info: "border-ktr-info/20 bg-ktr-info-bg text-ktr-info",
  warning: "border-ktr-warning/25 bg-ktr-warning-bg text-[#9a620b]",
  danger: "border-ktr-project-need-attention/20 bg-ktr-project-need-attention-bg text-ktr-project-need-attention",
  neutral: "border-ktr-border-light bg-ktr-surface-soft text-ktr-text-secondary",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  let tone: keyof typeof statusStyles = "neutral";

  if (["Tercatat Baik", "Sangat Aktif", "Aktif", "Valid", "Disetujui", "Selesai"].includes(status)) {
    tone = "success";
  } else if (["Cukup Terlihat", "Akan Datang", "Belum Direview", "Belum Submit", "Sedang Berjalan", "Berjalan"].includes(status)) {
    tone = "info";
  } else if (["Perlu Ditinjau", "Perlu Perhatian", "Menunggu Tinjauan", "Menunggu Review", "Perlu Klarifikasi", "Perlu Revisi", "Revisi", "Sedang Diperbaiki"].includes(status)) {
    tone = "warning";
  } else if (["Belum Lengkap", "Kurang Relevan", "Dikirim Ulang"].includes(status)) {
    tone = "danger";
  }

  return (
    <span className={cn("inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold", statusStyles[tone], className)}>
      {status}
    </span>
  );
}
