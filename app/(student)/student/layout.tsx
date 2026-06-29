import Link from "next/link";
import { BarChart3, FolderKanban, Home, UserRound } from "lucide-react";

const studentNavItems = [
  { label: "Beranda", icon: Home },
  { label: "Proyek", icon: FolderKanban },
  { label: "Aktivitas", icon: BarChart3 },
  { label: "Profil", icon: UserRound },
];

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-ktr-surface-bg-app text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col border-x border-ktr-border-light bg-background shadow-sm">
        <div className="flex-1 pb-20">{children}</div>
        <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[430px] border-t border-ktr-border-light bg-ktr-surface-card px-5 pb-5 pt-3" aria-label="Student navigation">
          <div className="grid grid-cols-4 gap-1">
            {studentNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === 0;

              return (
                <Link
                  key={item.label}
                  href="/student"
                  className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium leading-ktr-snug transition-colors ${
                    isActive
                      ? "text-ktr-primary-hover"
                      : "text-ktr-text-disabled hover:text-ktr-text-secondary"
                  }`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
