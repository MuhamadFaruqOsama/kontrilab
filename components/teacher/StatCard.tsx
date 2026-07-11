"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Card } from "@heroui/react/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: IconSvgElement;
  note?: string;
  tone?: "green" | "blue" | "amber" | "rose" | "neutral";
}

const noteStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  green: "text-ktr-success",
  blue: "text-ktr-info",
  amber: "text-ktr-warning",
  rose: "text-ktr-project-need-attention",
  neutral: "text-ktr-text-secondary",
};

export default function StatCard({ title, value, icon, note, tone = "neutral" }: StatCardProps) {
  return (
    <Card className="rounded-[18px] border border-ktr-border-light bg-white transition-colors hover:border-ktr-border-input">
      <Card.Content className="p-5">
        <div className="flex items-start justify-between gap-4">
          <p className="max-w-[11rem] text-[13px] font-semibold leading-5 tracking-normal text-ktr-text-secondary">{title}</p>
          {icon ? (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ktr-surface-soft text-ktr-text-primary">
              <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
          ) : null}
        </div>
        <p className="mt-6 font-heading text-[38px] font-semibold leading-none text-ktr-text-primary">{value}</p>
        {note ? <p className={cn("mt-4 text-sm font-medium leading-5", noteStyles[tone])}>{note}</p> : null}
      </Card.Content>
    </Card>
  );
}
