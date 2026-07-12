"use client";

import Sidebar from "@/components/teacher/Sidebar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="teacher-root flex h-screen w-full overflow-hidden bg-white text-ktr-text-primary">
      <aside className="hidden w-[92px] shrink-0 flex-col border-r border-ktr-border-light bg-white md:flex xl:w-[248px]">
        <Sidebar />
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-white px-6 py-7 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
