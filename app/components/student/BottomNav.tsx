"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import MinimizedCallUI from "@/app/components/student/MinimizedCallUI";

const navItems = [
  {
    name: "Beranda",
    href: "/student",
    icon: "/icons/student-nav/home-inactive.svg",
    activeIcon: "/icons/student-nav/home-smile-angle.svg",
  },
  {
    name: "Proyek",
    href: "/student/projects",
    icon: "/icons/student-nav/case-minimalistic.svg",
    activeIcon: "/icons/student-nav/case-minimalistic-active.svg",
  },
  {
    name: "Aktivitas",
    href: "/student/activities",
    icon: "/icons/student-nav/chart.svg",
    activeIcon: "/icons/student-nav/chart-active.svg",
  },
  {
    name: "Profil",
    href: "/student/profile",
    icon: "/icons/student-nav/user.svg",
    activeIcon: "/icons/student-nav/user-active.svg",
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/student") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <MinimizedCallUI />
      <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] border-t-[0.7px] border-ktr-border-light bg-ktr-surface-card pt-4 pb-[calc(10px_+_env(safe-area-inset-bottom))]"
      aria-label="Navigasi siswa"
    >
      <div className="mx-auto flex w-full items-start justify-between px-4">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[64px] min-w-12 flex-col items-center justify-start gap-1 text-[14px] font-semibold leading-[20px] transition-colors duration-150 ease-out",
                isActive ? "text-ktr-primary" : "text-ktr-neutral-500 hover:text-ktr-text-secondary",
              )}
            >
              <Image src={isActive ? item.activeIcon : item.icon} alt="" width={24} height={24} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
}