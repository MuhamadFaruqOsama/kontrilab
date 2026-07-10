"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, Folder01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

const navigation = [
  { name: "Dashboard", href: "/teacher", icon: DashboardSquare01Icon },
  { name: "Proyek", href: "/teacher/projects", icon: Folder01Icon },
  { name: "Siswa", href: "/teacher/students", icon: UserGroupIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-20 items-center justify-center px-4 xl:justify-start xl:px-7">
        <span className="font-heading text-[24px] font-semibold tracking-normal text-ktr-text-primary xl:block">KontriLab</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-5" aria-label="Navigasi teacher">
        {navigation.map((item) => {
          const isActive = item.href === "/teacher" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const iconRef = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={cn(
                "group flex h-12 cursor-pointer items-center justify-center gap-3 rounded-[14px] px-3 text-sm font-medium transition-[background,color,transform] duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ktr-primary/20 active:scale-[0.995] xl:justify-start xl:px-4",
                isActive
                  ? "bg-ktr-primary text-ktr-text-white"
                  : "text-ktr-text-secondary hover:bg-ktr-surface-soft hover:text-ktr-text-primary"
              )}
            >
              <HugeiconsIcon icon={iconRef} size={20} className="shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
