import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AssignmentsIcon,
  BarChartIcon,
  BookOpenCheckIcon,
  Home01Icon,
  Settings02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const teacherNavItems = [
  { label: "Overview", icon: Home01Icon },
  { label: "Assignments", icon: AssignmentsIcon },
  { label: "Classes", icon: UserGroupIcon },
  { label: "Reports", icon: BarChartIcon },
  { label: "Settings", icon: Settings02Icon },
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
          <Link href="/teacher" className="flex items-center gap-3 rounded-[10px] px-2 py-2">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-ktr-primary text-primary-foreground">
              <HugeiconsIcon icon={BookOpenCheckIcon} size={20} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-ktr-snug">Kontrilab</span>
              <span className="block text-xs leading-ktr-snug text-ktr-text-tertiary">Teacher Workspace</span>
            </span>
          </Link>

          <nav className="mt-8 space-y-1" aria-label="Teacher navigation">
            {teacherNavItems.map((item) => (
              <Link
                key={item.label}
                href="/teacher"
                className="flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium text-ktr-text-secondary transition-colors hover:bg-ktr-primary-soft hover:text-ktr-primary-dark"
              >
                <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
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
            <div className="rounded-[10px] border border-ktr-border-light bg-ktr-surface-soft px-3 py-1.5 text-sm text-ktr-text-secondary">
              Desktop First
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
