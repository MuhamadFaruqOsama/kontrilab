"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/teacher/Sidebar";
import { NProgressProvider, useNProgress } from "@/components/ui/nprogress";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <NProgressProvider>
      <TeacherLayoutShell>{children}</TeacherLayoutShell>
    </NProgressProvider>
  );
}

function TeacherLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { done } = useNProgress();
  const isDetailRoute = /^\/teacher\/projects\/[^/]+(?:\/.*)?$/.test(pathname);

  React.useEffect(() => {
    done();
  }, [done, pathname]);

  return (
    <div className="teacher-root flex min-h-dvh w-full overflow-hidden bg-white text-ktr-text-primary">
      {!isDetailRoute ? (
        <aside className="hidden w-[92px] shrink-0 flex-col border-r border-ktr-border-light bg-white md:flex xl:w-[248px]">
          <Sidebar />
        </aside>
      ) : null}

      <main className="min-w-0 flex-1 overflow-y-auto bg-white px-6 py-7 md:px-10 md:py-8">
        <div className={isDetailRoute ? "mx-auto max-w-6xl" : "mx-auto max-w-7xl"}>{children}</div>
      </main>
    </div>
  );
}
