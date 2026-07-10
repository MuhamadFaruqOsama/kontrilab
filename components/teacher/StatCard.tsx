import { Card } from "@heroui/react/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: unknown;
  note?: string;
  tone?: "green" | "blue" | "amber" | "rose" | "neutral";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  green: "border-l-ktr-primary bg-[linear-gradient(90deg,rgb(87_193_134_/_0.07),transparent_45%)]",
  blue: "border-l-ktr-secondary bg-[linear-gradient(90deg,rgb(91_143_185_/_0.07),transparent_45%)]",
  amber: "border-l-ktr-warning bg-[linear-gradient(90deg,rgb(245_166_35_/_0.09),transparent_45%)]",
  rose: "border-l-ktr-project-need-attention bg-[linear-gradient(90deg,rgb(224_82_82_/_0.07),transparent_45%)]",
  neutral: "border-l-ktr-border-input bg-white",
};

export default function StatCard({ title, value, note, tone = "neutral" }: StatCardProps) {
  return (
    <Card className={cn("rounded-[18px] border border-l-4 border-ktr-border-light bg-white", toneStyles[tone])}>
      <Card.Content className="p-5">
        <p className="text-[13px] font-semibold leading-5 text-ktr-text-primary">{title}</p>
        <p className="mt-5 font-heading text-[36px] font-semibold leading-[42px] text-ktr-text-primary">{value}</p>
        {note ? <p className="mt-3 text-sm leading-5 text-ktr-text-secondary">{note}</p> : null}
      </Card.Content>
    </Card>
  );
}
