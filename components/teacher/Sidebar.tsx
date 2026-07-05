"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  DashboardSquare01Icon, 
  Folder01Icon, 
  UserGroupIcon, 
  Activity01Icon, 
  Task01Icon, 
  RefreshIcon, 
  BrainIcon,
  Logout01Icon,
  Settings01Icon
} from "@hugeicons/core-free-icons";

const navigation = [
  { name: "Dashboard", href: "/teacher/dashboard", icon: DashboardSquare01Icon },
  { name: "Proyek", href: "/teacher/projects", icon: Folder01Icon },
  { name: "Siswa", href: "/teacher/students", icon: UserGroupIcon },
  { name: "Kontribusi", href: "/teacher/contributions", icon: Activity01Icon },
  { name: "Review", href: "/teacher/review", icon: Task01Icon },
  { name: "Revisi", href: "/teacher/revisions", icon: RefreshIcon },
  { name: "AI Insight", href: "/teacher/ai-insight", icon: BrainIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center px-6">
        <span className="text-xl font-bold font-heading text-foreground tracking-tight">KontriLab</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projects</p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const iconRef = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <HugeiconsIcon
                icon={iconRef}
                size={18}
                className={cn(
                  "mr-3 flex-shrink-0 transition-colors duration-150"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="#"
          className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
        >
          <HugeiconsIcon icon={Settings01Icon} size={18} className="mr-3 flex-shrink-0" />
          Settings
        </Link>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-xs">
            8
          </div>
          <span className="text-sm font-medium text-muted-foreground">Help & Support</span>
        </div>
      </div>
    </div>
  );
}
