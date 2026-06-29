import Link from "next/link";
import { BarChart3, BookOpenCheck, ClipboardList, Home, Settings, UsersRound } from "lucide-react";

const teacherNavItems = [
  { label: "Overview", icon: Home },
  { label: "Assignments", icon: ClipboardList },
  { label: "Classes", icon: UsersRound },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-ktr-surface-bg-app text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-ktr-border-light bg-ktr-surface-card px-4 py-5 lg:block">
          <Link href="/teacher" className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-ktr-primary text-primary-foreground">
              <BookOpenCheck className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-ktr-snug">Kontrilab</span>
              <span className="block text-xs leading-ktr-snug text-ktr-text-tertiary">Teacher Workspace</span>
            </span>
          </Link>

          <nav className="mt-8 space-y-1" aria-label="Teacher navigation">
            {teacherNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href="/teacher"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ktr-text-secondary transition-colors hover:bg-ktr-primary-soft hover:text-ktr-primary-dark"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-ktr-border-light bg-ktr-surface-card px-5 lg:px-8">
            <div>
              <p className="text-xs font-medium leading-ktr-snug tracking-ktr-label text-ktr-text-tertiary">
                Teacher Website
              </p>
              <h1 className="text-lg font-semibold leading-ktr-tight">Kontrilab Teacher</h1>
            </div>
            <div className="rounded-lg border border-ktr-border-light bg-ktr-surface-soft px-3 py-1.5 text-sm text-ktr-text-secondary">
              Desktop First
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
