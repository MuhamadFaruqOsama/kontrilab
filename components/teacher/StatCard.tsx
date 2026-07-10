import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
}

export default function StatCard({ title, value, icon: IconComponent }: StatCardProps) {
  return (
    <Card className="border border-ktr-border-light shadow-none bg-ktr-surface-card">
      <Card.Content className="p-4">
        <div className="flex items-center gap-2 text-ktr-text-tertiary mb-2">
          <HugeiconsIcon icon={IconComponent} size={16} />
          <span className="text-xs font-medium uppercase tracking-wide">{title}</span>
        </div>
        <p className="text-2xl font-bold font-heading text-ktr-text-primary">{value}</p>
      </Card.Content>
    </Card>
  );
}
