"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, Folder01Icon, LogoutSquare01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

const navigation = [
  { name: "Dashboard", href: "/teacher", icon: DashboardSquare01Icon },
  { name: "Proyek", href: "/teacher/projects", icon: Folder01Icon },
  { name: "Siswa", href: "/teacher/students", icon: UserGroupIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[72px] items-center justify-center px-4 xl:justify-start xl:px-7">
        <span className="font-heading text-[24px] font-semibold tracking-normal text-ktr-text-primary xl:block">KontriLab</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-4 py-3" aria-label="Navigasi teacher">
        {navigation.map((item) => {
          const isActive = item.href === "/teacher" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const iconRef = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={cn(
                "group flex h-10 cursor-pointer items-center justify-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-[background,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:border-ktr-text-primary active:scale-[0.997] xl:justify-start xl:px-4",
                isActive
                  ? "border border-ktr-text-primary bg-ktr-text-primary text-ktr-text-white"
                  : "border border-transparent text-ktr-text-secondary hover:border-ktr-border-light hover:bg-white hover:text-ktr-text-primary"
              )}
            >
              <HugeiconsIcon icon={iconRef} size={20} strokeWidth={2} className="shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5 xl:px-5">
        <div className="flex items-center justify-center gap-3 rounded-[12px] px-1 py-3 xl:justify-start xl:px-2">
          <div className="size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-ktr-border-light">
            <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Foto profil guru" width={32} height={32} className="size-full object-cover" unoptimized />
          </div>
          <div className="hidden min-w-0 xl:block">
            <p className="truncate text-sm font-semibold leading-5 text-ktr-text-primary">Guru KontriLab</p>
          </div>
        </div>
        <Link href="/login" className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-[10px] border border-ktr-border-light bg-white px-3 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input active:scale-[0.997] xl:justify-start" aria-label="Keluar">
          <HugeiconsIcon icon={LogoutSquare01Icon} size={18} strokeWidth={2} />
          <span className="hidden xl:inline">Keluar</span>
        </Link>
      </div>
    </div>
  );
}
