"use client";

import Sidebar from "@/components/teacher/Sidebar";
import Topbar from "@/components/teacher/Topbar";
import { usePathname } from "next/navigation";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPureProjectDetail = /^\/teacher\/projects\/[^/]+$/.test(pathname);

  if (isPureProjectDetail) {
    return <main className="min-h-dvh bg-ktr-surface-soft font-sans">{children}</main>;
  }

  return (
    <div className="flex h-screen w-full bg-ktr-surface-soft overflow-hidden font-sans">
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-ktr-border-light bg-background">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center border-b border-ktr-border-light bg-background px-6 shrink-0">
          <Topbar />
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
