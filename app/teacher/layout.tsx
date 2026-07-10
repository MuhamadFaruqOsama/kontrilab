"use client";

import Sidebar from "@/components/teacher/Sidebar";
import Topbar from "@/components/teacher/Topbar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="teacher-root flex h-screen w-full overflow-hidden bg-white font-sans text-ktr-text-primary">
      <aside className="hidden w-[92px] shrink-0 flex-col border-r border-ktr-border-light bg-white md:flex xl:w-[248px]">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <header className="flex h-20 shrink-0 items-center border-b border-ktr-border-light bg-white px-6 md:px-8">
          <Topbar />
        </header>

        <main className="flex-1 overflow-y-auto bg-white px-6 py-6 md:px-10 md:py-7">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}