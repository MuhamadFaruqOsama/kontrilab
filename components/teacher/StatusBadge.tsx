import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles = {
  success: "text-ktr-success",
  info: "text-ktr-info",
  warning: "text-ktr-warning",
  danger: "text-ktr-project-need-attention",
  neutral: "text-ktr-text-secondary",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  let tone: keyof typeof statusStyles = "neutral";

  if (["Tercatat Baik", "Sangat Aktif", "Aktif", "Valid", "Disetujui", "Selesai"].includes(status)) {
    tone = "success";
  } else if (["Cukup Terlihat", "Belum Direview", "Belum Submit", "Sedang Berjalan", "Berjalan"].includes(status)) {
    tone = "info";
  } else if (["Perlu Ditinjau", "Perlu Perhatian", "Menunggu Tinjauan", "Menunggu Review", "Perlu Klarifikasi", "Perlu Revisi", "Revisi", "Sedang Diperbaiki"].includes(status)) {
    tone = "warning";
  } else if (["Belum Lengkap", "Kurang Relevan", "Dikirim Ulang"].includes(status)) {
    tone = "danger";
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center whitespace-nowrap text-xs font-semibold leading-5", statusStyles[tone], className)}>
      {status}
    </span>
  );
}
