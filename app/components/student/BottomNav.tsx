"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] rounded-b-[32px] border-t border-ktr-border-light bg-ktr-surface-card pt-4"
      aria-label="Navigasi siswa"
    >
      <div className="mx-auto flex w-full max-w-[398px] items-start justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[64px] min-w-12 flex-col items-center justify-start gap-1 text-[14px] font-semibold leading-[20px] transition-colors ${
                isActive ? "text-ktr-primary" : "text-ktr-neutral-500 hover:text-ktr-text-secondary"
              }`}
            >
              <Image src={isActive ? item.activeIcon : item.icon} alt="" width={24} height={24} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="mx-auto mb-2 h-1.5 w-[148px] rounded-full bg-ktr-text-primary" />
    </nav>
  );
}
