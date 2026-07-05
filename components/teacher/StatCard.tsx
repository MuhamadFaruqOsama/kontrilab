import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
}

export default function StatCard({ title, value, icon: IconComponent }: StatCardProps) {
  return (
    <Card className="border border-default-200 shadow-none bg-white">
      <Card.Content className="p-4">
        <div className="flex items-center gap-2 text-default-500 mb-2">
          <HugeiconsIcon icon={IconComponent} size={16} />
          <span className="text-xs font-medium uppercase tracking-wide">{title}</span>
        </div>
        <p className="text-2xl font-bold font-heading text-foreground">{value}</p>
      </Card.Content>
    </Card>
  );
}
