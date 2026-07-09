import { Chip } from "@heroui/react/chip";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  type ChipVariant = "primary" | "secondary" | "tertiary";

  let color: ChipColor = "default";
  let variant: ChipVariant = "secondary";

  // Contribution Statuses
  if (status === "Tercatat Baik") {
    color = "success";
  } else if (status === "Cukup Terlihat") {
    color = "primary";
  } else if (status === "Perlu Ditinjau") {
    color = "warning";
  } else if (status === "Belum Cukup Data") {
    color = "default";
  }
  // Project / Submit Statuses
  else if (status === "Belum Dimulai") {
    color = "default";
  } else if (status === "Sedang Berjalan" || status === "Berjalan") {
    color = "primary";
  } else if (status === "Menunggu Tinjauan") {
    color = "warning";
  } else if (status === "Revisi" || status === "Sedang Diperbaiki") {
    color = "warning";
  } else if (status === "Dikirim Ulang") {
    color = "danger";
  } else if (status === "Selesai") {
    color = "success";
  }

  return (
    <Chip color={color as any} variant={variant} size="sm" className={className}>
      {status}
    </Chip>
  );
}
