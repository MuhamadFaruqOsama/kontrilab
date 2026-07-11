"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowDown02Icon,
  Album02Icon,
  ArrowLeft02Icon,
  Activity01Icon,
  ArrowRight02Icon,
  BubbleChatIcon,
  Briefcase01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ChatFeedback01Icon,
  Call02Icon,
  CallEnd01Icon,
  Clock01Icon,
  Copy01Icon,
  CopyLinkIcon,
  Download01Icon,
  File02Icon,
  FileCheckIcon,
  LabelImportantIcon,
  Login02Icon,
  MessageDone02Icon,
  Mic01Icon,
  MicOff01Icon,
  MoreVerticalIcon,

  Task01Icon,
  TaskDone02Icon,
  Search01Icon,
  Settings02Icon,
  StarIcon,
  CloudUploadIcon,
  Upload04Icon,
  UserGroupIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "@/components/ui/toast";
import * as React from "react";

import BottomNav from "@/app/components/student/BottomNav";
import { STUDENT_HAS_ACTIVE_DISCUSSION } from "@/app/components/student/MinimizedCallUI";
import { AppBackButton } from "@/components/ui/app-back-button";
import { AppDropdown } from "@/components/ui/app-dropdown";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { studentSettingsStorage } from "@/lib/student-settings";
import { getStudentProfileOverview, type RecentActivity, type StudentProfileOverview } from "@/lib/student-profile";

type Status = "Belum Dimulai" | "Sedang Berjalan" | "Revisi" | "Selesai";



type Project = {
  title: string;
  className: string;
  group: string;
  members: string;
  deadline: string;
  status: Status;
};
type ApiStudentProject = {
  id: string;
  title: string;
  className: string;
  deadline?: string | null;
  status?: string | null;
};

const projects: Project[] = [
  {
    title: "Website Profil Sekolah",
    className: "XII - Pemrograman Web",
    group: "Kelompok 3",
    members: "6 anggota",
    deadline: "20 Juni 2026",
    status: "Sedang Berjalan",
  },
  {
    title: "Landing Page UMKM",
    className: "XI - Desain Web",
    group: "Belum berkelompok",
    members: "0 anggota",
    deadline: "25 Juni 2026",
    status: "Belum Dimulai",
  },
  {
    title: "Poster Kampanye Digital",
    className: "X - Informatika",
    group: "Kelompok 2",
    members: "5 anggota",
    deadline: "18 Juni 2026",
    status: "Revisi",
  },
  {
    title: "Video Profil Kelas",
    className: "XI - Multimedia",
    group: "Kelompok 1",
    members: "4 anggota",
    deadline: "10 Juni 2026",
    status: "Selesai",
  },
  {
    title: "Aplikasi Jadwal Piket",
    className: "XII - Rekayasa Perangkat Lunak",
    group: "Kelompok 5",
    members: "5 anggota",
    deadline: "28 Juni 2026",
    status: "Sedang Berjalan",
  },
  {
    title: "Infografis Literasi Digital",
    className: "X - Informatika",
    group: "Kelompok 6",
    members: "4 anggota",
    deadline: "30 Juni 2026",
    status: "Belum Dimulai",
  },
  {
    title: "Website Katalog Ekskul",
    className: "XI - Desain Web",
    group: "Kelompok 7",
    members: "6 anggota",
    deadline: "4 Juli 2026",
    status: "Revisi",
  },
];

const statusClass: Record<Status, string> = {
  "Belum Dimulai": "text-ktr-project-not-started",
  "Sedang Berjalan": "text-ktr-project-in-progress",
  Revisi: "text-ktr-project-revision",
  Selesai: "text-ktr-project-finished",
};

function Icon({ icon, className }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; className?: string }) {
  return <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} color="currentColor" className={className} aria-hidden="true" />;
}

function ScreenShell({
  title,
  subtitle,
  children,
  action,
  showBottomNav = false,
  backHref = "/student/projects",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  showBottomNav?: boolean;
  backHref?: string;
}) {
  return (
    <main className={cn("relative min-h-dvh w-full bg-background pt-6 text-ktr-text-primary", showBottomNav ? "pb-[220px]" : "pb-8")}>
      <div className="mx-auto min-w-0 w-full max-w-[430px] px-4">
        {!showBottomNav ? <AppBackButton href={backHref} className="mb-6" /> : null}
        <header className="mb-6 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold leading-[32px] text-ktr-text-primary">{title}</h1>
            {subtitle ? <p className="mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
        {children}
      </div>
      {showBottomNav ? <BottomNav /> : null}
    </main>
  );
}

function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <section className={cn("relative min-w-0 overflow-hidden rounded-[18px] border border-ktr-border-light bg-ktr-surface-card p-[14px]", className)}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">{children}</h2>;
}

function PulseDot({ className, colorClass = "bg-ktr-project-revision", pingClassName = "opacity-55", ...props }: React.HTMLAttributes<HTMLSpanElement> & { colorClass?: string; pingClassName?: string }) {
  return (
    <span className={cn("relative inline-flex size-2.5 shrink-0 items-center justify-center align-middle", className)} {...props}>
      <span className={cn("absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full", colorClass, pingClassName)} />
      <span className={cn("relative size-1.5 rounded-full", colorClass)} />
    </span>
  );
}

function statusIcon() {
  return LabelImportantIcon;
}

function StatusChip({ status }: { status: Status }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1 text-[12px] font-medium leading-4", statusClass[status])}><Icon icon={statusIcon()} />{status}</span>;
}

function PrimaryButton({ href, children, className, onClick }: { href?: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const content = <>{children}<Icon icon={ArrowRight02Icon} /></>;
  if (href) {
    return <Button asChild className={cn("h-11 min-w-0 overflow-hidden rounded-[10px] text-[14px] font-semibold leading-5", className)}><Link href={href} onClick={onClick}>{content}</Link></Button>;
  }
  return <Button className={cn("h-11 min-w-0 overflow-hidden rounded-[10px] text-[14px] font-semibold leading-5", className)} onClick={onClick}>{content}</Button>;
}

function QuietButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button variant="outline" className={cn("h-11 min-w-0 overflow-hidden rounded-[10px] border-transparent bg-ktr-primary-soft text-[14px] font-semibold leading-5 text-ktr-primary hover:bg-ktr-primary-light hover:text-ktr-primary", className)} type="button" onClick={onClick}>{children}</Button>;
}

function Field({ label, placeholder, as = "input" }: { label: string; placeholder: string; as?: "input" | "textarea" }) {
  return (
    <label className="block min-w-0">
      <span className="text-[12px] font-medium leading-4 text-ktr-text-primary">{label}</span>
      {as === "textarea" ? (
        <textarea className="mt-2 min-h-28 w-full min-w-0 resize-none rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 py-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder={placeholder} />
      ) : (
        <input className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder={placeholder} />
      )}
    </label>
  );
}

function Segments({ items }: { items: string[] }) {
  return <div className="flex min-w-0 flex-wrap gap-2">{items.map((item, index) => <button key={item} className={cn("min-w-0 rounded-full border px-3 py-2 text-[13px] font-medium leading-5", index === 0 ? "border-ktr-primary bg-ktr-primary-soft text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-secondary")} type="button">{item}</button>)}</div>;
}

export function JoinProjectSheet({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [message, setMessage] = React.useState<{ type: "error" | "success"; text: string } | null>(null);

  function submit() {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setMessage({ type: "error", text: "Kode bergabung belum diisi." });
      return;
    }
    if (normalized !== "WEB12A") {
      setMessage({ type: "error", text: "Kode tidak ditemukan. Coba cek kembali kode dari gurumu." });
      return;
    }
    setMessage({ type: "success", text: "Kamu berhasil bergabung ke proyek!" });
    toast.success("Kamu berhasil bergabung ke proyek!", { description: "Yuk lanjutkan progresmu bersama kelompok." });
    router.push("/student/projects/detail");
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Gabung Proyek</BottomSheetTitle>
          <BottomSheetDescription>Masukkan kode bergabung dari gurumu untuk mulai bergabung ke proyek kelas.</BottomSheetDescription>
        </BottomSheetHeader>
        <div className="mt-5 space-y-3">
          <label className="block min-w-0">
            <span className="text-[12px] font-medium leading-4 text-ktr-text-primary">Kode Join</span>
            <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder="Contoh: WEB12A" />
          </label>
          <p className="text-[12px] leading-[18px] text-ktr-text-secondary">Kode bergabung biasanya dibagikan oleh guru melalui kelas atau grup belajar.</p>
          {message ? <p className={cn("rounded-[10px] px-3 py-2 text-[13px] leading-5", message.type === "success" ? "bg-ktr-success-bg text-ktr-success" : "bg-ktr-project-need-attention-bg text-ktr-project-need-attention")}>{message.text}</p> : null}
        </div>
        <BottomSheetFooter>
          <BottomSheetClose asChild><QuietButton className="w-full rounded-[16px]">Batal</QuietButton></BottomSheetClose>
          <Button className="h-11 w-full rounded-[16px]" type="button" onClick={submit}>Gabung Sekarang</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

const projectStats = [
  { label: "Proyek Aktif", value: "1", icon: "/icons/project-stats/active.svg" },
  { label: "Perlu Revisi", value: "0", icon: "/icons/project-stats/revision.svg" },
  { label: "Selesai", value: "2", icon: "/icons/project-stats/finished.svg" },
];

const projectFilters: Array<"Semua" | Status> = ["Semua", "Sedang Berjalan", "Revisi", "Selesai"];

const avatarStyles = [
  "bg-[linear-gradient(135deg,#101828,#4f7d6a)]",
  "bg-[linear-gradient(135deg,#1d4ed8,#38bdf8)]",
  "bg-[linear-gradient(135deg,#78350f,#f59e0b)]",
  "bg-[linear-gradient(135deg,#166534,#86efac)]",
  "bg-[linear-gradient(135deg,#7c2d12,#fb7185)]",
];

function memberCountFromLabel(label: string) {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function ProjectMemberStack({ count }: { count: number }) {
  const visibleCount = Math.min(count, 3);
  const overflowCount = count - visibleCount;

  if (count <= 0) {
    return null;
  }

  return (
    <div className="flex items-center pl-1">
      {avatarStyles.slice(0, visibleCount).map((className, index) => (
        <span
          key={className}
          className={cn("-ml-1.5 size-8 rounded-full border-2 border-ktr-surface-card", className)}
          aria-label={`Anggota ${index + 1}`}
        />
      ))}
      {overflowCount > 0 ? (
        <span className="-ml-1.5 flex size-8 items-center justify-center rounded-full border-2 border-ktr-surface-card bg-ktr-primary-light text-[12px] font-semibold leading-4 text-ktr-text-primary">
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
}

function projectAction(project: Project) {
  const hasGroup = memberCountFromLabel(project.members) > 0;

  if (!hasGroup) {
    return { href: "/student/projects/group/start", label: "Gabung Kelompok" };
  }

  if (project.status === "Revisi") {
    return { href: "/student/group", label: "Lanjut Revisi" };
  }

  if (project.status === "Selesai") {
    return { href: "/student/group", label: "Lihat Proyek" };
  }

  return { href: "/student/group", label: "Masuk Kelompok" };
}

function ProjectListItem({ project }: { project: Project }) {
  const memberCount = memberCountFromLabel(project.members);
  const action = projectAction(project);

  return (
    <Link href={action.href} className="block rounded-[20px] border border-ktr-border-light bg-ktr-surface-card px-4 py-4 transition-colors hover:border-ktr-primary/40">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="min-w-0 truncate text-[17px] font-semibold leading-[26px] text-ktr-text-primary">{project.title}</h3>
        <p className="shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px] text-ktr-text-primary">{project.className}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[22px]">
        <span className="text-ktr-text-primary">{project.group}</span>
        <span className="flex items-center gap-1 text-ktr-primary"><Icon icon={UserGroupIcon} />{project.members}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium leading-5">
        <span className="flex items-center gap-1 text-ktr-primary"><Icon icon={Calendar03Icon} />{project.deadline}</span>
        <span className={cn("flex items-center gap-1", project.status === "Revisi" ? "text-ktr-project-revision" : project.status === "Selesai" ? "text-ktr-project-finished" : project.status === "Belum Dimulai" ? "text-ktr-project-not-started" : "text-ktr-project-in-progress")}><Icon icon={statusIcon()} />{project.status}</span>
      </div>
      {memberCount > 0 ? (
        <div className="mt-3 flex justify-end">
          <ProjectMemberStack count={memberCount} />
        </div>
      ) : null}
    </Link>
  );
}

function ProjectsSearchPanel({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  panelRef,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filter: "Semua" | Status;
  onFilterChange: (value: "Semua" | Status) => void;
  panelRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={panelRef} className="mt-5 space-y-3">
      <label className="flex h-12 min-w-0 items-center gap-2 rounded-[14px] border border-ktr-border-light bg-ktr-surface-bg-app px-3 text-ktr-text-tertiary transition-colors focus-within:border-ktr-primary/60">
        <Icon icon={Search01Icon} className="shrink-0 text-ktr-text-secondary" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary"
          placeholder="Cari proyek..."
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter proyek">
        {projectFilters.map((item) => {
          const selected = filter === item;

          return (
            <button
              key={item}
              type="button"
              className={cn(
                "h-9 shrink-0 rounded-[12px] border px-3 text-[13px] font-medium leading-5 transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]",
                selected
                  ? "border-ktr-primary bg-ktr-primary text-ktr-text-white"
                  : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-secondary hover:border-ktr-primary/50 hover:text-ktr-primary"
              )}
              onClick={() => onFilterChange(item)}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"Semua" | Status>("Semua");
  const [showBackToSearch, setShowBackToSearch] = React.useState(false);
  const [apiProjects, setApiProjects] = React.useState<Project[]>(projects);
  const searchPanelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/student/projects");
        if (res.ok) {
          const data = await res.json();
          // Map DB project to UI Project format
          const mapped: Project[] = (data as ApiStudentProject[]).map((p) => ({
            id: p.id,
            title: p.title,
            className: p.className,
            group: "Belum berkelompok",
            members: "0 anggota",
            deadline: p.deadline ? new Date(p.deadline).toLocaleDateString('id-ID') : "TBA",
            status: (p.status === "IN_PROGRESS" ? "Sedang Berjalan" : p.status === "NOT_STARTED" ? "Belum Dimulai" : p.status === "FINISHED" ? "Selesai" : "Revisi") as Status
          }));
          setApiProjects(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProjects();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProjects = apiProjects.filter((project) => {
    const matchesQuery = normalizedQuery.length === 0 || `${project.title} ${project.className} ${project.group}`.toLowerCase().includes(normalizedQuery);
    const matchesFilter = filter === "Semua" || project.status === filter;
    return matchesQuery && matchesFilter;
  });
  const listMotionKey = `${filter}-${normalizedQuery}`;

  React.useEffect(() => {
    function handleScroll() {
      setShowBackToSearch(window.scrollY > 360);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSearch() {
    searchPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative min-h-dvh w-full bg-ktr-surface-bg-app pb-[220px] pt-6 text-ktr-text-primary">
      <section className="px-4 pb-5 pt-0">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[24px] font-semibold leading-[32px] text-ktr-text-primary">Proyek Saya</h1>
          <JoinProjectSheet
            trigger={
              <Button className="h-10 rounded-[16px] px-3 text-[14px] font-semibold leading-5">
                Gabung Proyek
                <Icon icon={Login02Icon} />
              </Button>
            }
          />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {projectStats.map((item) => (
            <div key={item.label} className="min-w-0 rounded-[18px] border border-ktr-border-light bg-ktr-surface-card p-3">
              <Image src={item.icon} alt="" width={40} height={40} aria-hidden="true" />
              <div className="mt-4 flex min-w-0 items-end gap-1">
                <p className="text-[20px] font-semibold leading-[28px] text-ktr-text-primary">{item.value}</p>
                <p className="min-w-0 pb-1 text-[12px] leading-4 text-ktr-text-secondary">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
        <ProjectsSearchPanel query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} panelRef={searchPanelRef} />
      </section>

      <section className="px-4">
        <div key={listMotionKey} className="ktr-project-list-motion pb-5">
          {visibleProjects.length > 0 ? (
            <div className="space-y-3 py-1">
              {visibleProjects.map((project, index) => <ProjectListItem key={`${project.title}-${index}`} project={project} />)}
            </div>
          ) : (
            <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden px-8 text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-[12px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={Search01Icon} /></div>
              <h2 className="relative z-10 mt-4 text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Proyek tidak ditemukan</h2>
              <p className="relative z-10 mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Coba kata kunci lain atau ubah filter proyek.</p>
            </div>
          )}
        </div>
      </section>

      <div className={cn("pointer-events-none fixed inset-x-0 z-40 mx-auto w-full max-w-[430px] px-4", STUDENT_HAS_ACTIVE_DISCUSSION ? "bottom-[156px]" : "bottom-[96px]")}>
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Kembali ke pencarian proyek"
            onClick={scrollToSearch}
            className={cn(
              "pointer-events-auto flex size-11 items-center justify-center rounded-[14px] border border-ktr-border-light bg-ktr-surface-card text-ktr-primary transition-[opacity,transform,border-color] duration-200 hover:border-ktr-primary/50",
              showBackToSearch ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
            )}
          >
            <Icon icon={ArrowRight02Icon} className="-rotate-90" />
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
export function ProjectDetailPage({ projectStatus = "in_progres" }: { projectStatus?: ProjectLifecycleStatus } = {}) {
  if (projectStatus === "revision") {
    return <ProjectRevisionPage />;
  }

  if (projectStatus === "submitted") {
    return (
      <ScreenShell title="Detail Proyek" subtitle="Proyek sudah dikirim dan sedang menunggu tinjauan guru.">
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Landing Page UMKM</h2>
              <p className="text-[14px] leading-[22px] text-ktr-text-secondary">XI - Desain Web</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ktr-info-bg px-2.5 py-1 text-[12px] font-medium leading-4 text-ktr-info"><Icon icon={statusIcon()} />Menunggu Tinjauan Guru</span>
          </div>
          <p className="text-[14px] leading-[22px] text-ktr-text-secondary">Proyek sudah dikirim dan sedang menunggu tinjauan guru. Anggota masih bisa melihat hasil akhir dan ringkasan kontribusi.</p>
        </Card>

        <SectionTitle>Aksi Tersedia</SectionTitle>
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <Card className="h-full">
            <Icon icon={FileCheckIcon} className="mb-3 text-ktr-primary" />
            <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Lihat Hasil Akhir</p>
            <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Buka link atau file proyek yang sudah dikirim.</p>
          </Card>
          <Link href="/student/activities/contribution" className="block min-w-0">
            <Card className="h-full">
              <Icon icon={TaskDone02Icon} className="mb-3 text-ktr-primary" />
              <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Ringkasan Kontribusi</p>
              <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Lihat jejak diskusi, progres, dan lampiran.</p>
            </Card>
          </Link>
        </div>

        <Card className="mt-4 bg-ktr-secondary-bg-info-card">
          <p className="text-[13px] leading-5 text-ktr-text-secondary">Aksi buat diskusi, unggahan progres, dan submit proyek dinonaktifkan sampai guru memberi hasil tinjauan guru.</p>
        </Card>
      </ScreenShell>
    );
  }

  const discussionActions = [
    { title: "Buat Sesi Diskusi Baru", description: "Mulai pembahasan untuk ide, kendala, revisi, atau progres.", href: "/student/discussions/new", icon: BubbleChatIcon },
    { title: "Riwayat Sesi Diskusi", description: "Lihat semua sesi dan catatan diskusi kelompok.", href: "/student/activities", icon: Clock01Icon },
    { title: "Diskusi Sedang Berjalan", description: "Masuk ke chat dan telepon kelompok yang aktif.", href: "/student/discussions/current", icon: MessageDone02Icon },
  ] as const;

  const contributionActions = [
    { title: "Catat Progres", description: "Unggah progres dan bukti kerja terbaru.", href: "/student/progress/new", icon: Upload04Icon },
    { title: "Umpan Balik Anggota", description: "Berikan umpan balik anggota kelompok.", href: "/student/peer-assessment", icon: UserGroupIcon },
  ] as const;

  return (
    <ScreenShell title="Detail Proyek" subtitle="Bantu kelompokmu tetap terarah dari satu ruang proyek.">
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Website Profil Sekolah</h2>
            <p className="text-[14px] leading-[22px] text-ktr-text-secondary">XII - Pemrograman Web</p>
          </div>
          <StatusChip status="Sedang Berjalan" />
        </div>
        <div className="flex flex-wrap gap-3 text-[13px] leading-5 text-ktr-text-secondary">
          <span className="flex items-center gap-1"><Icon icon={Calendar03Icon} />Deadline: 20 Juni 2026</span>
          <span className="flex items-center gap-1"><Icon icon={UserGroupIcon} />Kelompok 3, 6 anggota</span>
        </div>
        <p className="text-[14px] leading-[22px] text-ktr-text-secondary">Buat website sederhana yang menampilkan profil sekolah, informasi jurusan, dan halaman kontak.</p>
      </Card>

      <SectionTitle>Ruang Diskusi</SectionTitle>
      <div className="space-y-2">
        {discussionActions.map((item) => {
          const content = (
            <Card className="flex items-start gap-3 text-left">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={item.icon} /></span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{item.title}</span>
                <span className="block text-[13px] leading-5 text-ktr-text-secondary">{item.description}</span>
              </span>
            </Card>
          );

          if (item.href === "/student/discussions/new") {
            return <CreateDiscussionSheet key={item.title} trigger={<button type="button" className="block w-full">{content}</button>} />;
          }

          return <Link key={item.title} href={item.href} className="block">{content}</Link>;
        })}
      </div>

      <SectionTitle>Kontribusi</SectionTitle>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        {contributionActions.map((item) => (
          <Link key={item.title} href={item.href} className="block min-w-0">
            <Card className="h-full">
              <Icon icon={item.icon} className="mb-3 text-ktr-primary" />
              <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{item.title}</p>
              <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <SectionTitle>Aksi Akhir</SectionTitle>
      <Button asChild className="h-11 w-full rounded-[12px] text-[14px] font-medium">
        <Link href="/student/projects/submit">Kirim Proyek</Link>
      </Button>
    </ScreenShell>
  );
}
function SheetProjectSummary({ rightLabel = "XI - Desain Web" }: { rightLabel?: string }) {
  return (
    <div className="flex h-9 min-w-0 items-center justify-between gap-3 rounded-[8px] bg-ktr-primary-bg-form px-3 text-[14px] font-normal leading-[22px] text-ktr-text-primary">
      <span className="flex min-w-0 items-center gap-2">
        <Icon icon={Briefcase01Icon} className="size-5 shrink-0 text-ktr-text-primary" />
        <span className="truncate">Landing Page UMKM</span>
      </span>
      <span className="shrink-0 text-right">{rightLabel}</span>
    </div>
  );
}

function SheetTextField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block min-w-0">
      <span className="text-[13px] font-normal leading-[20px] text-ktr-text-primary">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full min-w-0 rounded-[14px] border border-ktr-border-input bg-ktr-surface-card px-3 text-[14px] font-normal leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20"
        placeholder={placeholder}
      />
    </label>
  );
}

function SheetFooterActions({ primaryLabel, onPrimary }: { primaryLabel: string; onPrimary: () => void }) {
  return (
    <BottomSheetFooter className="mt-7 gap-2.5">
      <BottomSheetClose asChild>
        <QuietButton className="h-11 w-full rounded-[16px] text-[14px] font-medium">Batal</QuietButton>
      </BottomSheetClose>
      <Button className="h-11 w-full rounded-[16px] bg-ktr-primary text-[14px] font-medium text-ktr-text-white hover:bg-ktr-primary-hover" type="button" onClick={onPrimary}>
        {primaryLabel}
      </Button>
    </BottomSheetFooter>
  );
}

function JoinGroupPtinjauan({ state }: { state: "idle" | "loading" | "found" | "not-found" }) {
  if (state === "idle") {
    return null;
  }

  if (state === "loading") {
    return (
      <div className="rounded-[12px] border border-ktr-border-light bg-ktr-primary-bg-form px-3 py-3">
        <div className="flex items-center gap-3">
          <span className="size-5 animate-spin rounded-full border-2 border-ktr-primary/25 border-t-ktr-primary" aria-hidden="true" />
          <span className="text-[13px] font-normal leading-5 text-ktr-text-secondary">Mencari kelompok...</span>
        </div>
      </div>
    );
  }

  if (state === "not-found") {
    return (
      <div className="rounded-[12px] border border-ktr-border-light bg-ktr-project-need-attention-bg px-3 py-3">
        <p className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">Kelompok tidak ditemukan</p>
        <p className="mt-0.5 text-[12px] font-normal leading-[18px] text-ktr-text-secondary">Periksa kembali kode kelompok dari ketua atau guru.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-ktr-primary/30 bg-ktr-success-bg px-3 py-2.5">
      <p className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">Kelompok 4</p>
      <p className="mt-0.5 text-[12px] font-normal leading-[18px] text-ktr-text-secondary">Ketua: Alya</p>
      <div className="mt-3 flex min-w-0 items-center gap-2">
        <div className="flex items-center pl-1">
          {avatarStyles.slice(0, 4).map((className) => (
            <span key={className} className={cn("-ml-1.5 size-6 rounded-full border-2 border-ktr-surface-card", className)} />
          ))}
        </div>
        <span className="min-w-0 truncate text-[12px] font-normal leading-[18px] text-ktr-primary">4 anggota sudah bergabung</span>
      </div>
    </div>
  );
}
function CreateGroupSheet({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = React.useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.warning("Nama kelompok belum diisi", { description: "Isi nama kelompok dulu sebelum membuat kelompok." });
      return;
    }
    toast.success("Kelompok berhasil dibuat", { description: `${trimmed} siap digunakan untuk mulai berdiskusi.` });
    router.push("/student/group");
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader className="space-y-4 pr-0">
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Buat Kelompok Baru</BottomSheetTitle>
          <SheetProjectSummary />
        </BottomSheetHeader>
        <div className="mt-5 space-y-3">
          <SheetTextField label="Nama Kelompok" placeholder="Contoh: Kelompok 4" value={name} onChange={setName} />
          <p className="text-[12px] font-normal leading-[18px] text-ktr-text-secondary">Kamu akan menjadi ketua kelompok dan bisa mengundang temanmu untuk bergabung.</p>
        </div>
        <SheetFooterActions primaryLabel="Buat Kelompok" onPrimary={submit} />
      </BottomSheetContent>
    </BottomSheet>
  );
}

function JoinGroupSheet({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [lookupState, setLookupState] = React.useState<"idle" | "loading" | "found" | "not-found">("idle");
  const lookupTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (lookupTimerRef.current) {
        window.clearTimeout(lookupTimerRef.current);
      }
    };
  }, []);

  function lookupGroup(value: string) {
    const normalized = value.trim().toUpperCase();

    if (lookupTimerRef.current) {
      window.clearTimeout(lookupTimerRef.current);
    }

    if (!normalized) {
      setLookupState("idle");
      return;
    }

    setLookupState("loading");
    lookupTimerRef.current = window.setTimeout(() => {
      setLookupState(normalized === "KLP4UMKM" ? "found" : "not-found");
    }, 650);
  }

  function submit() {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      toast.warning("Kode kelompok belum diisi", { description: "Masukkan kode kelompok dari ketua atau guru." });
      return;
    }
    if (lookupState === "loading") {
      toast.info("Kode sedang dicek", { description: "Tunggu sebentar sampai kelompok ditemukan." });
      return;
    }
    if (lookupState !== "found") {
      setLookupState("not-found");
      toast.warning("Kelompok tidak ditemukan", { description: "Periksa kembali kode kelompokmu." });
      return;
    }
    toast.success("Berhasil bergabung", { description: "Kamu sudah masuk ke Kelompok 4." });
    router.push("/student/group");
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader className="space-y-4 pr-0">
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Gabung Kelompok</BottomSheetTitle>
          <SheetProjectSummary />
        </BottomSheetHeader>
        <div className="mt-5 space-y-3">
          <SheetTextField
            label="Kode Kelompok"
            placeholder="Masukkan kode kelompok"
            value={code}
            onChange={(value) => {
              setCode(value);
              lookupGroup(value);
            }}
          />
          <JoinGroupPtinjauan state={lookupState} />
        </div>
        <SheetFooterActions primaryLabel="Gabung Kelompok" onPrimary={submit} />
      </BottomSheetContent>
    </BottomSheet>
  );
}
const discussionTopics = ["Ide Proyek", "Progres", "Kendala", "Revisi"];

function CreateDiscussionSheet({ trigger }: { trigger: React.ReactNode }) {
  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState(discussionTopics[0]);

  function submit() {
    const trimmed = title.trim();
    if (!trimmed) {
      toast.warning("Judul diskusi belum diisi", { description: "Isi judul diskusi agar anggota tahu topik yang dibahas." });
      return;
    }
    toast.success("Diskusi dimulai", { description: `${topic} siap dibahas bersama kelompok.` });
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader className="space-y-4 pr-0">
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Buat Diskusi Baru</BottomSheetTitle>
          <SheetProjectSummary rightLabel="Kelompok 4" />
        </BottomSheetHeader>
        <div className="mt-5 space-y-4">
          <SheetTextField label="Judul Diskusi" placeholder="Masukkan Judul Diskusi" value={title} onChange={setTitle} />
          <div>
            <p className="text-[13px] font-normal leading-[20px] text-ktr-text-primary">Topik Diskusi</p>
            <div className="mt-3 flex min-w-0 flex-wrap gap-2.5">
              {discussionTopics.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "h-8 rounded-[8px] border px-3 text-[12px] font-normal leading-[18px] transition-colors",
                    topic === item ? "border-ktr-primary bg-ktr-success-bg text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-secondary"
                  )}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[12px] font-normal leading-[18px] text-ktr-text-tertiary">Setelah diskusi diakhiri, anggota akan mengisi umpan balik anggota untuk mencatat proses kontribusi sesi ini.</p>
        </div>
        <SheetFooterActions primaryLabel="Mulai Diskusi" onPrimary={submit} />
      </BottomSheetContent>
    </BottomSheet>
  );
}
const GroupChoiceCard = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button"> & { iconSrc: string; title: string; description: string }>(
  ({ iconSrc, title, description, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn("relative flex h-16 w-full items-center justify-between overflow-hidden rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5 text-left transition-colors hover:border-ktr-primary/40", className)}
      {...props}
    >
      <span className="relative z-10 flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px]">
          <Image src={iconSrc} alt="" width={40} height={40} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-medium leading-[22px] text-ktr-text-primary">{title}</span>
          <span className="block truncate text-[14px] font-normal leading-[22px] text-ktr-text-tertiary">{description}</span>
        </span>
      </span>
      <Icon icon={ArrowRight02Icon} className="relative z-10 shrink-0 text-ktr-text-primary" />
    </button>
  )
);
GroupChoiceCard.displayName = "GroupChoiceCard";
export function GroupStartPage() {
  return (
    <main className="min-h-dvh w-full bg-ktr-surface-bg-app px-4 pb-8 pt-6 text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <AppBackButton href="/student/projects" className="mb-6" />

        <section className="mb-6">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <h1 className="min-w-0 text-[22px] font-semibold leading-[30px] text-ktr-text-primary">Landing Page UMKM</h1>
            <p className="shrink-0 pt-1 text-right text-[13px] font-medium leading-5 text-ktr-text-secondary">XI - Desain Web</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] leading-5">
            <span className="flex items-center gap-1.5 text-ktr-primary">
              <Icon icon={Calendar03Icon} />
              25 Juni 2026
            </span>
            <span className="flex items-center gap-1.5 text-ktr-info">
              <Icon icon={statusIcon()} />
              Belum Dimulai
            </span>
          </div>
        </section>

        <section>
          <h2 className="text-[24px] font-semibold leading-[32px] text-ktr-text-primary">Mulai bersama kelompokmu</h2>
          <p className="mt-3 max-w-[320px] text-[14px] leading-[22px] text-ktr-text-secondary">Pilih cara bergabung agar kamu bisa mulai berdiskusi dan mencatat progres proyek.</p>

          <div className="mt-10 space-y-2">
            <CreateGroupSheet trigger={<GroupChoiceCard iconSrc="/icons/groups/create.svg" title="Buat Kelompok Baru" description="Mulai kelompok dari awal" />} />
            <JoinGroupSheet trigger={<GroupChoiceCard iconSrc="/icons/groups/join.svg" title="Gabung Kelompok yang Ada" description="Pilih kelompok yang sudah dibuat" />} />
          </div>

          <p className="mt-6 rounded-[10px] bg-ktr-project-not-started-bg px-4 py-3 text-[13px] leading-5 text-ktr-text-secondary">Pastikan kamu bergabung dengan kelompok yang sesuai arahan guru.</p>
        </section>
      </div>
    </main>
  );
}

export function InviteMemberSheet({ trigger }: { trigger: React.ReactNode }) {
  return <BottomSheet><BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger><BottomSheetContent className="pb-7"><BottomSheetHeader><BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Undang Anggota</BottomSheetTitle><BottomSheetDescription>Bagikan kode atau link ini agar temanmu bisa bergabung ke kelompok.</BottomSheetDescription></BottomSheetHeader><div className="mt-5 rounded-[20px] border border-ktr-border-light bg-ktr-primary-bg-form p-4 text-center"><p className="text-[12px] font-medium leading-4 text-ktr-text-secondary">Kode Kelompok</p><p className="mt-1 text-[28px] font-semibold leading-[36px] text-ktr-text-primary">KLP4UMKM</p></div><div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2"><QuietButton className="px-2 text-[14px] rounded-[16px]" onClick={() => toast.success("Link siap dibagikan")}><Icon icon={CopyLinkIcon} />Bagikan Link</QuietButton><Button className="h-11 min-w-0 rounded-[16px] px-2 text-[14px]" onClick={() => toast.success("Kode disalin")}><Icon icon={Copy01Icon} />Salin Kode</Button></div><p className="mt-3 text-[12px] leading-[18px] text-ktr-text-secondary">Pastikan anggota bergabung ke kelompok yang sesuai arahan guru.</p></BottomSheetContent></BottomSheet>;
}

type GroupMember = {
  name: string;
  role: "Ketua" | "Anggota";
  initials: string;
  avatarClass: string;
};

type DiscussionItem = {
  title: string;
  status: string;
  statusClass: string;
  messages: string;
  meta: string;
  primary?: boolean;
  unreadCount?: number;
  requiresPeerAssessment?: boolean;
};

type ProgresItem = {
  text: string;
  author: string;
  time: string;
  avatarClass: string;
};

const groupMembers: GroupMember[] = [
  { name: "Alya Putri Ramadhani", role: "Ketua", initials: "AP", avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]" },
  { name: "Bima Aditya Pratama", role: "Anggota", initials: "BA", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9_48%,#f5a623)]" },
  { name: "Raka Maulana Yusuf", role: "Anggota", initials: "RM", avatarClass: "bg-[linear-gradient(135deg,#f7d9c4,#f5a623_42%,#5b8fb9)]" },
  { name: "Nadia Safira Lestari", role: "Anggota", initials: "NS", avatarClass: "bg-[linear-gradient(135deg,#d8ff00,#57c186_48%,#2f536f)]" },
];

const groupDiscussions: DiscussionItem[] = [
  { title: "Pembahasan Konsep Landing Page", status: "Sedang Berjalan", statusClass: "text-ktr-project-in-progress", messages: "4 pesan", meta: "Terakhir 10 menit lalu", primary: true, unreadCount: 1 },
  { title: "Tinjauan Konten Produk", status: "Menunggu Umpan Balik Anggota", statusClass: "text-ktr-project-revision", messages: "2 pesan", meta: "Menunggu 1 anggota", requiresPeerAssessment: true },
  { title: "Revisi Tampilan Kontak", status: "Selesai", statusClass: "text-ktr-project-finished", messages: "2 pesan", meta: "Semua anggota sudah memberi umpan balik" },
];


const groupProgres: ProgresItem[] = [
  { text: "Membuat draft tampilan awal untuk bagian hero landing page.", author: "Bima A.", time: "dikirim 5 menit lalu", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { text: "Menambahkan teks awal untuk bagian produk unggulan UMKM.", author: "Raka M.", time: "dikirim 1 jam lalu", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]" },
  { text: "Mengunggah bukti pengerjaan layout halaman kontak.", author: "Nadia S.", time: "dikirim kemarin", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
  { text: "Menyusun daftar kebutuhan aset gambar dan ikon produk.", author: "Alya P.", time: "dikirim kemarin", avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186)]" },
  { text: "Merapikan copywriting untuk bagian testimoni pelanggan.", author: "Bima A.", time: "dikirim 2 hari lalu", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { text: "Membuat variasi warna tombol CTA sesuai brand UMKM.", author: "Raka M.", time: "dikirim 2 hari lalu", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]" },
];

const projectBriefAttachments = [
  { name: "Brief_LandingPage_UMKM.pdf", size: "1.2 MB" },
  { name: "Referensi_Desain.zip", size: "4.5 MB" },
];

function ProjectBriefSheet({ trigger }: { trigger: React.ReactNode }) {
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Project Brief</BottomSheetTitle>
          <BottomSheetDescription>Informasi lengkap tentang proyek ini.</BottomSheetDescription>
        </BottomSheetHeader>

        <div className="mt-5 space-y-5">
          {/* Header */}
          <div className="rounded-[14px] bg-ktr-primary-bg-form px-4 py-3">
            <h3 className="text-[16px] font-semibold leading-[24px] text-ktr-text-primary">Landing Page UMKM</h3>
            <p className="mt-0.5 text-[13px] leading-5 text-ktr-text-secondary">XI - Desain Web</p>
          </div>

          {/* Deadline & Status */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium leading-4 text-ktr-primary">
              <Icon icon={Calendar03Icon} />
              25 Juni 2026
            </span>
            <StatusChip status="Belum Dimulai" />
          </div>

          {/* Deskripsi */}
          <div>
            <p className="mb-1.5 text-[13px] font-medium leading-5 text-ktr-text-primary">Deskripsi</p>
            <p className="text-[14px] leading-[22px] text-ktr-text-secondary">
              Buat landing page sederhana untuk UMKM lokal yang menampilkan profil usaha, katalog produk, dan informasi kontak. Gunakan HTML, CSS, dan JavaScript dasar.
            </p>
          </div>

          {/* File Lampiran */}
          <div>
            <p className="mb-2 text-[13px] font-medium leading-5 text-ktr-text-primary">File Lampiran</p>
            <div className="space-y-2">
              {projectBriefAttachments.map((file) => (
                <div key={file.name} className="flex items-center justify-between gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Image src="/icons/file-icon.svg" alt="" width={32} height={32} aria-hidden="true" className="size-8 shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium leading-5 text-ktr-text-primary">{file.name}</span>
                      <span className="block text-[11px] leading-4 text-ktr-text-tertiary">{file.size}</span>
                    </span>
                  </span>
                  <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft" onClick={() => toast.info("File diunduh", { description: file.name })}>
                    <Icon icon={Download01Icon} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

function ProjectHeaderBlock({ project = { title: "Landing Page UMKM", className: "XI - Desain Web", dueDate: "25 Juni 2026", status: "Belum Dimulai" } }: { project?: { title: string; className: string; dueDate: string; status: string } }) {
  return (
    <section className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <AppBackButton href="/student/projects" className="px-0" />
        <ProjectBriefSheet
          trigger={
            <button type="button" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 text-[14px] font-medium leading-[22px] text-ktr-primary">
              <Image src="/icons/project-brief.svg" alt="" width={24} height={24} aria-hidden="true" className="size-6 shrink-0" />
              Project Brief
            </button>
          }
        />
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <h1 className="min-w-0 text-[20px] font-semibold leading-[28px] text-ktr-text-primary">{project.title}</h1>
        <p className="shrink-0 pt-0.5 text-right text-[14px] leading-[22px] text-ktr-text-secondary">{project.className}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] leading-5">
        <span className="flex items-center gap-1.5 text-ktr-primary">
          <Icon icon={Calendar03Icon} />
          {project.dueDate}
        </span>
        <span className="flex items-center gap-1.5 text-ktr-info">
          <Icon icon={statusIcon()} />
          {project.status}
        </span>
      </div>
    </section>
  );
}

function MemberAvatar({ member, size = "size-[44px]" }: { member: Pick<GroupMember, "initials" | "avatarClass">; size?: string }) {
  return <span className={cn("flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-ktr-text-white", size, member.avatarClass)}>{member.initials}</span>;
}

function MemberRow({ member, showDivider = true }: { member: GroupMember; showDivider?: boolean }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <>
      <div className="flex h-[46px] min-w-0 items-center gap-3">
        <MemberAvatar member={member} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{member.name}</p>
          <p className={cn("mt-0.5 text-[14px] font-normal leading-[22px]", member.role === "Ketua" ? "text-ktr-project-revision" : "text-ktr-text-secondary")}>{member.role}</p>
        </div>
        {member.role !== "Ketua" ? (
          <AppDropdown
            label={`Aksi ${member.name}`}
            triggerClassName="flex size-9 shrink-0 items-center justify-center rounded-[12px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
            trigger={<Icon icon={MoreVerticalIcon} />}
            items={[
              {
                key: "promote",
                label: "Jadikan ketua",
                description: "Pindahkan peran ketua kelompok",
                onSelect: () => toast.info("Peran belum diubah", { description: "Aksi ini nanti disambungkan ke data kelompok." }),
              },
              {
                key: "remove",
                label: "Keluarkan anggota",
                description: "Butuh konfirmasi sebelum lanjut",
                tone: "danger",
                onSelect: () => setConfirmOpen(true),
              },
            ]}
          />
        ) : null}
      </div>
      {showDivider ? <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" /> : null}
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Keluarkan anggota?"
        description={`${member.name} akan dihapus dari kelompok ini.`}
        confirmText="Keluarkan"
        cancelText="Batal"
        tone="danger"
        onConfirm={() => toast.success("Anggota dikeluarkan", { description: `${member.name} sudah dihapus dari kelompok.` })}
      />
    </>
  );
}

function DiscussionCard({ item }: { item: DiscussionItem }) {
  const href = item.primary ? "/student/discussions/current" : "/student/discussions/summary";

  return (
    <Link
      href={href}
      className="block rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-3 transition-[border-color,background-color,transform] hover:border-ktr-primary/35 hover:bg-ktr-primary-soft/30 active:scale-[0.99]"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          {item.requiresPeerAssessment ? (
            <PulseDot className="mt-[7px]" aria-label="Umpan balik anggota wajib diisi" />
          ) : null}
          <h3 className="min-w-0 text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.title}</h3>
        </div>
        <span className={cn("shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px]", item.statusClass)}>{item.status}</span>
      </div>
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] leading-[18px] text-ktr-text-tertiary">
        {item.requiresPeerAssessment ? (
          <>
            <span>3/4 umpan balik terkirim</span>
            <span className="size-1 rounded-full bg-ktr-text-tertiary/70" aria-hidden="true" />
            <span>{item.meta}</span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5"><Icon icon={BubbleChatIcon} />{item.messages}</span>
            <span className="size-1 rounded-full bg-ktr-text-tertiary/70" aria-hidden="true" />
            <span>{item.meta}</span>
          </>
        )}
      </div>
      {item.requiresPeerAssessment ? <p className="mt-2 text-[12px] font-medium leading-[18px] text-ktr-project-revision">Wajib isi umpan balik anggota sebelum sesi dianggap selesai.</p> : null}
    </Link>
  );
}

function ActiveDiscussionSection({ item, members = groupMembers }: { item: DiscussionItem; members?: GroupMember[] }) {
  return (
    <section className="mb-6">
      <SectionTitle>Diskusi Aktif</SectionTitle>
      <Link href="/student/discussions/current" className="active-discussion-card block rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-4 transition-colors hover:border-ktr-primary/40">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-[24px] text-ktr-text-primary">{item.title}</p>
          </div>
          <span className={cn("shrink-0 pt-0.5 text-[12px] font-medium leading-[18px]", item.statusClass)}>{item.status}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center pl-2">
            {members.slice(0, 4).map((member) => (
              <MemberAvatar key={member.initials} member={member} size="-ml-2 size-7 border-2 border-ktr-surface-card" />
            ))}
          </div>
          <span className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[12px] text-[13px] font-medium leading-5 text-ktr-text-primary">
            {item.unreadCount ? <span>{item.unreadCount} belum dibaca</span> : null}
            <Icon icon={ArrowRight02Icon} className="size-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}
function ProgresRow({ item, showDivider = true }: { item: ProgresItem; showDivider?: boolean }) {
  return (
    <>
      <div>
        <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.text}</p>
        <div className="mt-3 flex min-w-0 items-center gap-2 text-[13px] leading-5 text-ktr-text-tertiary">
          <MemberAvatar member={{ initials: item.author.slice(0, 1), avatarClass: item.avatarClass }} size="size-6" />
          <span className="shrink-0 font-normal text-ktr-text-primary">{item.author}</span>
          <span className="min-w-0 truncate">{item.time}</span>
        </div>
      </div>
      {showDivider ? <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" /> : null}
    </>
  );
}

type StudentGroupApiData = {
  project: { title: string; className: string; dueDate: string; status: string };
  members: GroupMember[];
  progress: ProgresItem[];
  discussions: DiscussionItem[];
};
export function GroupDetailPage({ role = "member" }: { role?: DiscussionRole } = {}) {
  const isLeader = role === "leader";
  const [groupData, setGroupData] = React.useState<StudentGroupApiData | null>(null);
  const [showAllProgress, setShowAllProgress] = React.useState(false);
  const [addMenuState, setAddMenuState] = React.useState<"closed" | "open" | "closing">("closed");
  const addMenuCloseTimer = React.useRef<number | null>(null);
  const addMenuOpen = addMenuState === "open";
  const addMenuVisible = addMenuState !== "closed";
  const addMenuExiting = addMenuState === "closing";
  const projectInfo = groupData?.project ?? { title: "Landing Page UMKM", className: "XI - Desain Web", dueDate: "25 Juni 2026", status: "Belum Dimulai" };
  const members = groupData?.members?.length ? groupData.members : groupMembers;
  const progressItems = groupData?.progress?.length ? groupData.progress : groupProgres;
  const visibleProgressItems = showAllProgress ? progressItems : progressItems.slice(0, 5);
  const discussions = groupData?.discussions?.length ? groupData.discussions : groupDiscussions;
  const currentActiveDiscussion = discussions.find((discussion) => discussion.status === "Sedang Berjalan") ?? null;

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/student/group")
      .then((response) => response.ok ? response.json() : null)
      .then((data: StudentGroupApiData | null) => {
        if (!cancelled && data) setGroupData(data);
      })
      .catch(() => {
        if (!cancelled) setGroupData(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function clearAddMenuTimer() {
    if (!addMenuCloseTimer.current) return;
    window.clearTimeout(addMenuCloseTimer.current);
    addMenuCloseTimer.current = null;
  }

  function openAddMenu() {
    clearAddMenuTimer();
    setAddMenuState("open");
  }

  function closeAddMenu() {
    if (addMenuState === "closed") return;
    clearAddMenuTimer();
    setAddMenuState("closing");
    addMenuCloseTimer.current = window.setTimeout(() => {
      setAddMenuState("closed");
      addMenuCloseTimer.current = null;
    }, 150);
  }

  function toggleAddMenu() {
    if (addMenuOpen) {
      closeAddMenu();
      return;
    }

    openAddMenu();
  }

  React.useEffect(() => () => {
    if (addMenuCloseTimer.current) window.clearTimeout(addMenuCloseTimer.current);
  }, []);

  return (
    <main className="relative min-h-dvh w-full bg-background px-4 pb-[116px] pt-6 text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <ProjectHeaderBlock project={projectInfo} />

        {currentActiveDiscussion ? <ActiveDiscussionSection item={currentActiveDiscussion} members={members} /> : null}

        <SectionTitle>Anggota Kelompok</SectionTitle>
        <section className="mb-6 rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3">
          <div className="space-y-3">
            {members.map((member, index) => <MemberRow key={member.name} member={member} showDivider={index < members.length - 1} />)}
          </div>
        </section>

        <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Progres Kelompok</h2>
        </div>
        <section className="mb-6 rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3">
          <div className="space-y-3">
            {visibleProgressItems.map((item, index) => <ProgresRow key={`${item.author}-${item.text}`} item={item} showDivider={index < visibleProgressItems.length - 1 || progressItems.length > 5} />)}
            {progressItems.length > 5 ? (
              <button type="button" className="flex h-[46px] w-full items-center justify-center gap-2 px-0 text-[14px] font-medium leading-[22px] text-ktr-text-secondary transition-colors hover:text-ktr-primary" onClick={() => setShowAllProgress((value) => !value)}>
                {showAllProgress ? "Tampilkan lebih sedikit" : "Lihat lebih banyak"}
                <Icon icon={ArrowDown02Icon} className={cn("size-4 transition-transform", showAllProgress ? "rotate-180" : "rotate-0")} />
              </button>
            ) : null}
          </div>
        </section>

        <SectionTitle>Diskusi Kelompok</SectionTitle>
        <div className="space-y-3">
          {discussions.map((item) => <DiscussionCard key={item.title} item={item} />)}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto w-full max-w-[430px] px-4">
        <div className="relative flex justify-end">
          {addMenuVisible ? (
            <div className="ktr-dropdown-popover pointer-events-auto absolute bottom-[60px] right-0 w-[224px] rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-1 shadow-[0_14px_34px_rgba(43,48,51,0.10)]" data-entering={addMenuOpen && !addMenuExiting ? true : undefined} data-exiting={addMenuExiting ? true : undefined}>
              <Link
                href="/student/progress/new"
                className="flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[14px] font-medium leading-[22px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                onClick={() => {
                  closeAddMenu();
                  toast.info("Siapkan progresmu", { description: "Tambahkan catatan dan bukti pekerjaan terbaru." });
                }}
              >
                <Icon icon={Upload04Icon} className="size-5 text-ktr-text-primary" />
                Tambah Progres
              </Link>
              {isLeader ? (
                <>
                  <InviteMemberSheet
                    trigger={
                      <button type="button" className="flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[14px] font-medium leading-[22px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft">
                        <Icon icon={UserGroupIcon} className="size-5 text-ktr-text-primary" />
                        Tambah Anggota
                      </button>
                    }
                  />
                  <CreateDiscussionSheet
                    trigger={
                      <button type="button" className="flex h-11 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[14px] font-medium leading-[22px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft">
                        <Icon icon={BubbleChatIcon} className="size-5 text-ktr-text-primary" />
                        Tambah Diskusi
                      </button>
                    }
                  />
                </>
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            className="pointer-events-auto flex size-12 items-center justify-center rounded-full border border-ktr-primary bg-ktr-primary text-ktr-text-white transition-[background-color,transform] duration-150 hover:bg-ktr-primary-hover active:scale-[0.98]"
            aria-label="Tambah aksi proyek"
            aria-expanded={addMenuOpen}
            onClick={toggleAddMenu}
          >
            <Icon icon={Add01Icon} className={cn("size-6 transition-transform duration-200", addMenuOpen ? "rotate-45" : "rotate-0")} />
          </button>
        </div>
      </div>
    </main>
  );
}
export function NewDiscussionPage({ role = "member" }: { role?: DiscussionRole } = {}) {
  if (role !== "leader") {
    return <RoleRestrictedState title="Buat Diskusi Baru" description="Hanya ketua kelompok yang dapat membuat sesi diskusi baru." backHref="/student/group" />;
  }

  return <ScreenShell title="Buat Diskusi Baru" subtitle="Mulai ruang diskusi untuk membahas ide, progres, kendala, atau revisi kelompokmu."><Card className="space-y-4"><Field label="Judul Diskusi" placeholder="Contoh: Pembahasan Konsep Landing Page" /><div><p className="mb-3 text-[16px] font-medium leading-[22px] text-ktr-text-primary">Topik Diskusi</p><Segments items={["Ide Proyek", "Progres", "Kendala", "Revisi", "Lainnya"]} /></div><Field label="Catatan Awal" placeholder="Tulis hal pertama yang ingin dibahas bersama kelompok." as="textarea" /><PrimaryButton href="/student/discussions/current" className="w-full" onClick={() => toast.success("Diskusi baru dibuat", { description: "Ruang diskusi sudah siap digunakan kelompok." })}>Buat Diskusi</PrimaryButton></Card></ScreenShell>;
}

type DiscussionRole = "leader" | "member";
type DiscussionStatus = "ongoing" | "waiting_peer_assessment" | "finished";
type ProjectLifecycleStatus = "in_progres" | "ready_to_submit" | "submitted" | "revision" | "finished";

const sessionParticipants = [
  { initials: "AP", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
  { initials: "BA", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { initials: "NS", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
  { initials: "RM", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#fb7185)]" },
];

const sessionProgres = [
  { author: "Bima A.", title: "Desain hero section", meta: "1 lampiran - 09.24", initials: "BA", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { author: "Raka M.", title: "Draft konten produk", meta: "1 link - 09.36", initials: "RM", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]" },
  { author: "Nadia S.", title: "Layout halaman kontak", meta: "1 lampiran - 09.45", initials: "NS", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
];

function SessionParticipantBadge() {
  return (
    <div className="flex h-11 items-center gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3">
      <div className="flex items-center pl-2">
        {sessionParticipants.map((member) => (
          <MemberAvatar key={member.initials} member={member} size="-ml-2 size-6" />
        ))}
      </div>
      <span className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">6 peserta</span>
    </div>
  );
}

function SessionStatusText({ status }: { status: DiscussionStatus }) {
  if (status === "finished") {
    return <span className="flex items-center gap-3 text-[14px] font-normal leading-[22px] text-ktr-primary"><span className="size-1.5 rounded-full bg-ktr-primary" />Selesai</span>;
  }

  if (status === "waiting_peer_assessment") {
    return <span className="flex items-center gap-3 text-[14px] font-normal leading-[22px] text-ktr-project-revision"><span className="size-1.5 rounded-full bg-ktr-project-revision" />Menunggu Umpan Balik Anggota</span>;
  }

  return <span className="flex items-center gap-3 text-[14px] font-normal leading-[22px] text-ktr-info"><span className="active-discussion-status-dot size-1.5 rounded-full bg-ktr-info" />Sedang berjalan</span>;
}

function SessionMessageCard({ status }: { status: DiscussionStatus }) {
  if (status === "waiting_peer_assessment") {
    return (
      <section className="rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">Diskusi sudah diakhiri</p>
          <SessionStatusText status={status} />
        </div>
        <div className="mt-4 rounded-[12px] bg-ktr-secondary-bg-info-card p-3">
          <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Diskusi sudah diakhiri</p>
          <p className="mt-1 text-[13px] font-normal leading-5 text-ktr-text-secondary">Isi umpan balik anggota agar proses kontribusi sesi ini tercatat lebih lengkap.</p>
          <p className="mt-3 text-[13px] font-medium leading-5 text-ktr-primary">3 dari 6 anggota sudah mengisi umpan balik.</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button asChild className="h-11 rounded-[12px] text-[14px] font-medium"><Link href="/student/peer-assessment">Isi Umpan Balik Anggota</Link></Button>
          <Button asChild variant="outline" className="h-11 rounded-[12px] border-ktr-border-light bg-ktr-surface-card text-[14px] font-medium text-ktr-text-secondary"><Link href="/student/discussions/current?readonly=1">Lihat Chat</Link></Button>
        </div>
      </section>
    );
  }

  if (status === "finished") {
    return (
      <section className="rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">Sesi Diskusi Selesai</p>
          <SessionStatusText status={status} />
        </div>
        <div className="mt-4 rounded-[12px] bg-ktr-primary-soft p-3">
          <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Sesi Diskusi Selesai</p>
          <p className="mt-1 text-[13px] font-normal leading-5 text-ktr-text-secondary">Semua anggota sudah mengisi umpan balik anggota. Ringkasan sesi ini sudah tersimpan sebagai jejak kontribusi kelompok.</p>
        </div>
        <div className="mt-4 grid gap-2">
          <Button asChild className="h-11 rounded-[12px] text-[14px] font-medium"><Link href="/student/discussions/landing-page-umkm/summary">Lihat Ringkasan Sesi</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3", status === "ongoing" ? "active-discussion-card" : "")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">4 pesan belum dibaca</p>
        <SessionStatusText status={status} />
      </div>
      <div className="mt-[14px] rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] rounded-tl-[4px] bg-ktr-primary p-[14px] text-ktr-text-white">
        <div className="flex items-center gap-2">
          <MemberAvatar member={{ initials: "AP", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" }} size="size-8" />
          <p className="text-[16px] font-semibold leading-[24px]">Alya P.</p>
        </div>
        <p className="mt-5 line-clamp-2 text-[14px] font-normal leading-[22px]">Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progres yang sudah dikerjakan.</p>
      </div>
    </section>
  );
}
function SessionActionCard({ iconSrc, label, href, onClick }: { iconSrc: string; label: string; href?: string; onClick?: () => void }) {
  const content = (
    <>
      <Image src={iconSrc} alt="" width={40} height={40} aria-hidden="true" className="size-10 shrink-0" />
      <span className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex h-[60px] items-center gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="flex h-[60px] items-center gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 text-left" onClick={onClick}>
      {content}
    </button>
  );
}

function SessionProgresRow({ item, showDivider = true }: { item: (typeof sessionProgres)[number]; showDivider?: boolean }) {
  return (
    <>
      <div className="flex min-h-10 min-w-0 items-center gap-3">
        <MemberAvatar member={item} size="size-8" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.title}</p>
          <p className="text-[12px] leading-[18px] text-ktr-text-secondary">{item.author} - {item.meta}</p>
        </div>
      </div>
      {showDivider ? <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" /> : null}
    </>
  );
}

function RoleRestrictedState({ title, description, backHref = "/student/group" }: { title: string; description: string; backHref?: string }) {
  return (
    <ScreenShell title={title} subtitle="Aksi ini membutuhkan peran ketua kelompok." backHref={backHref}>
      <Card className="bg-ktr-secondary-bg-info-card">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Akses khusus ketua</p>
        <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">{description}</p>
      </Card>
    </ScreenShell>
  );
}

function FinishedNextSteps({ role, projectReadyToSubmit }: { role: DiscussionRole; projectReadyToSubmit: boolean }) {
  if (role !== "leader") {
    return (
      <Card className="bg-ktr-secondary-bg-info-card p-3">
        <p className="text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Tunggu ketua kelompok memulai diskusi baru atau mengirim hasil akhir proyek.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <CreateDiscussionSheet
        trigger={
          <button type="button" className="block w-full">
            <Card className="flex items-center justify-between gap-3 p-3 text-left">
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Buat Diskusi Baru</span>
                <span className="block text-[13px] font-normal leading-5 text-ktr-text-secondary">Mulai sesi baru jika masih ada hal yang perlu dibahas.</span>
              </span>
              <Icon icon={ArrowRight02Icon} className="shrink-0 text-ktr-primary" />
            </Card>
          </button>
        }
      />
      {projectReadyToSubmit ? (
        <Link href="/student/projects/landing-page-umkm/submit" className="block">
          <Card className="flex items-center justify-between gap-3 border-ktr-primary/50 bg-ktr-primary-soft p-3">
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Kirim Proyek</span>
              <span className="block text-[13px] font-normal leading-5 text-ktr-text-secondary">Kirim hasil akhir proyek jika kelompok sudah sepakat dan semua progres penting sudah tercatat.</span>
            </span>
            <Icon icon={ArrowRight02Icon} className="shrink-0 text-ktr-primary" />
          </Card>
        </Link>
      ) : null}
    </div>
  );
}

function EndDiscussionSheet({ trigger }: { trigger: React.ReactNode }) {
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Akhiri Diskusi?</BottomSheetTitle>
          <BottomSheetDescription>
            Setelah diskusi diakhiri, anggota tidak bisa mengirim pesan baru di sesi ini dan akan diminta mengisi umpan balik anggota.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <p className="mt-5 rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] font-normal leading-5 text-ktr-text-secondary">
          Pastikan pembahasan utama sudah selesai dan progres penting sudah dikirim.
        </p>
        <BottomSheetFooter>
          <BottomSheetClose asChild>
            <QuietButton className="w-full rounded-[12px]">Batal</QuietButton>
          </BottomSheetClose>
          <BottomSheetClose asChild>
            <Link href="/student/discussions/waiting" className="inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-ktr-primary px-4 text-[14px] font-medium text-ktr-text-white transition-colors hover:bg-ktr-primary-hover" onClick={() => toast.success("Diskusi diakhiri", { description: "Anggota sekarang dapat mengisi umpan balik anggota." })}>
              Ya, Akhiri Diskusi
            </Link>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

// Chat Types & Data

type ChatMessage = {
  id: string;
  author: string;
  initials: string;
  avatarClass: string;
  content: string;
  time: string;
  isSelf?: boolean;
  isUnreadDivider?: boolean;
};

const initialChatMessages: ChatMessage[] = [
  {
    id: "m1",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progres yang sudah dikerjakan.",
    time: "11.21",
  },
  {
    id: "m2",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progres yang sudah dikerjakan.",
    time: "11.21",
  },
  {
    id: "m3",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progres yang sudah dikerjakan.",
    time: "11.21",
    isSelf: true,
  },
  { id: "div1", author: "", initials: "", avatarClass: "", content: "1 pesan belum dibaca", time: "", isUnreadDivider: true },
  {
    id: "m4",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progres yang sudah dikerjakan.",
    time: "11.21",
  },
];

const CURRENT_USER_INITIALS = "AP";

const callParticipantsList = [
  { initials: "AP", name: "Alya P.", avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]", speaking: true, muted: false },
  { initials: "BA", name: "Bima A.", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9_48%,#f5a623)]", speaking: false, muted: false },
  { initials: "RM", name: "Raka M.", avatarClass: "bg-[linear-gradient(135deg,#f7d9c4,#f5a623_42%,#5b8fb9)]", speaking: false, muted: true },
  { initials: "NS", name: "Nadia S.", avatarClass: "bg-[linear-gradient(135deg,#d8ff00,#57c186_48%,#2f536f)]", speaking: false, muted: false },
  { initials: "FR", name: "Fira R.", avatarClass: "bg-[linear-gradient(135deg,#7c2d12,#fb7185)]", speaking: false, muted: true },
  { initials: "DN", name: "Doni N.", avatarClass: "bg-[linear-gradient(135deg,#1d4ed8,#38bdf8)]", speaking: false, muted: false },
  { initials: "SL", name: "Salsa L.", avatarClass: "bg-[linear-gradient(135deg,#166534,#86efac)]", speaking: false, muted: true },
  { initials: "YK", name: "Yuki K.", avatarClass: "bg-[linear-gradient(135deg,#78350f,#f59e0b)]", speaking: false, muted: false },
];

function formatCallTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// Call UI (Zoom-style)
function CallMicStatus({ muted, className, variant = "light" }: { muted: boolean; className?: string; variant?: "light" | "dark" }) {
  const statusClass = muted ? (variant === "dark" ? "text-ktr-text-white/45" : "text-ktr-text-tertiary") : "text-ktr-primary";

  return (
    <span
      className={cn("inline-flex size-6 shrink-0 items-center justify-center", statusClass, className)}
      aria-label={muted ? "Mikrofon mati" : "Mikrofon aktif"}
    >
      <HugeiconsIcon icon={muted ? MicOff01Icon : Mic01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
    </span>
  );
}

function CallParticipantsSheet({ open, onOpenChange, selfMuted, hostInitials }: { open: boolean; onOpenChange: (open: boolean) => void; selfMuted: boolean; hostInitials: string }) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Peserta Panggilan</BottomSheetTitle>
          <BottomSheetDescription>{callParticipantsList.length} anggota sedang ikut panggilan kelompok.</BottomSheetDescription>
        </BottomSheetHeader>
        <div className="mt-5 space-y-3">
          {callParticipantsList.map((participant, index) => {
            const participantMuted = participant.initials === "AP" ? selfMuted : participant.muted;

            return (
              <div key={participant.initials} className="flex min-w-0 items-center gap-3 rounded-[14px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5">
                <MemberAvatar member={participant} size="size-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium leading-[22px] text-ktr-text-primary">{participant.name}</p>
                  <p className="text-[12px] leading-[18px] text-ktr-text-secondary">{participant.initials === hostInitials ? "Host" : index === 0 ? "Ketua" : "Anggota"}</p>
                </div>
                <CallMicStatus muted={participantMuted} />
              </div>
            );
          })}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

function CallParticipantTile({ participant, muted, voiceLevel }: { participant: (typeof callParticipantsList)[number]; muted: boolean; voiceLevel: number }) {
  const participantMuted = participant.initials === "AP" ? muted : participant.muted;
  const isSpeaking = participant.speaking && !participantMuted;

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col items-center justify-center gap-3 rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-4 transition-[border-color,box-shadow,transform] duration-200",
        isSpeaking ? "call-participant-speaking" : ""
      )}
      style={isSpeaking ? ({ "--voice-level": voiceLevel.toFixed(2) } as React.CSSProperties) : undefined}
    >
      <CallMicStatus muted={participantMuted} variant="light" className="absolute right-3 top-3" />
      <MemberAvatar member={participant} size="size-16" />
      <p className="text-center text-[14px] font-medium leading-[22px] text-ktr-text-primary">{participant.name}</p>
    </div>
  );
}

function CallOverflowTile({ count, onClick }: { count: number; onClick: () => void }) {
  const overflowParticipants = callParticipantsList.slice(5, 8);

  return (
    <button type="button" className="flex min-h-0 flex-col items-center justify-center gap-3 rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-4 text-ktr-text-primary transition-[border-color,transform] hover:border-ktr-primary/35 active:scale-[0.99]" onClick={onClick}>
      <div className="flex items-center justify-center pl-4">
        {overflowParticipants.map((participant) => (
          <MemberAvatar key={participant.initials} member={participant} size="-ml-4 size-12 border-2 border-ktr-surface-card" />
        ))}
      </div>
      <div className="text-center">
        <p className="text-[16px] font-semibold leading-[24px]">+{count}</p>
        <p className="mt-0.5 text-[11px] leading-4 text-ktr-text-tertiary">peserta lainnya</p>
      </div>
    </button>
  );
}

function CallControlButton({ label, children, onClick, active = false, danger = false }: { label: string; children: React.ReactNode; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex size-14 items-center justify-center rounded-full border transition-[background-color,border-color,transform] active:scale-[0.98]",
          danger ? "border-ktr-project-need-attention bg-ktr-project-need-attention text-ktr-text-white" : active ? "border-ktr-primary/25 bg-ktr-primary-soft text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-soft text-ktr-text-primary"
        )}
      >
        {children}
      </button>
      <span className="text-[11px] leading-4 text-ktr-text-secondary">{label}</span>
    </div>
  );
}

function CallOverlay({ elapsed, hostInitials, onBack, onLeave, onEndCall }: { elapsed: number; hostInitials: string; onBack: () => void; onLeave: () => void; onEndCall: () => void }) {
  const [muted, setMuted] = React.useState(false);
  const [speakerOn, setSpeakerOn] = React.useState(true);
  const [participantsOpen, setParticipantsOpen] = React.useState(false);
  const [exitMenuOpen, setExitMenuOpen] = React.useState(false);
  const isCurrentUserHost = hostInitials === CURRENT_USER_INITIALS;
  const hasOverflow = callParticipantsList.length > 6;
  const visibleParticipants = hasOverflow ? callParticipantsList.slice(0, 5) : callParticipantsList.slice(0, 6);
  const overflowCount = callParticipantsList.length - visibleParticipants.length;
  const voiceLevel = muted ? 0 : 0.45 + Math.abs(Math.sin(elapsed * 1.35)) * 0.35 + Math.abs(Math.sin(elapsed * 3.1)) * 0.2;

  return (
    <>
      <div
        className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col bg-ktr-surface-bg-app text-ktr-text-primary"
        style={{ left: "50%", right: "auto", transform: "translateX(-50%)" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-6 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-[12px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
            aria-label="Kembali ke diskusi"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold leading-[26px] text-ktr-text-primary">Kelompok 1</p>
            <p className="mt-0.5 truncate text-[12px] leading-4 text-ktr-text-secondary">Landing Page UMKM</p>
          </div>
          <p className="shrink-0 pt-1 text-[14px] font-medium tabular-nums text-ktr-text-secondary">{formatCallTime(elapsed)}</p>
        </div>

        {/* Participant grid */}
        <div className="grid min-h-0 flex-1 grid-cols-2 auto-rows-fr gap-3 px-4">
          {visibleParticipants.map((participant) => <CallParticipantTile key={participant.initials} participant={participant} muted={muted} voiceLevel={voiceLevel} />)}
          {hasOverflow ? <CallOverflowTile count={overflowCount} onClick={() => setParticipantsOpen(true)} /> : null}
        </div>

        {/* Controls */}
        <div className="grid shrink-0 grid-cols-4 gap-3 px-6 pb-8 pt-6">
          <CallControlButton label="Peserta" onClick={() => setParticipantsOpen(true)}>
            <HugeiconsIcon icon={UserGroupIcon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
          </CallControlButton>
          <CallControlButton label={muted ? "Bisu" : "Mikrofon"} active={muted} onClick={() => setMuted((m) => !m)}>
            <HugeiconsIcon icon={muted ? MicOff01Icon : Mic01Icon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
          </CallControlButton>
          <CallControlButton label="Speaker" active={speakerOn} onClick={() => setSpeakerOn((s) => !s)}>
            <HugeiconsIcon icon={VolumeHighIcon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
          </CallControlButton>
          <div className="relative flex min-w-0 justify-center">
            {isCurrentUserHost && exitMenuOpen ? (
              <div className="ktr-dropdown-popover absolute bottom-[76px] right-0 z-10 w-[214px] rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-1 shadow-[0_14px_34px_rgba(43,48,51,0.10)]">
                <button
                  type="button"
                  className="block w-full rounded-[12px] px-3 py-2 text-left text-[14px] font-medium leading-[22px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                  onClick={() => {
                    setExitMenuOpen(false);
                    onLeave();
                  }}
                >
                  Keluar saja
                </button>
                <button
                  type="button"
                  className="block w-full rounded-[12px] px-3 py-2 text-left text-[14px] font-medium leading-[22px] text-ktr-project-need-attention transition-colors hover:bg-ktr-project-need-attention-bg"
                  onClick={() => {
                    setExitMenuOpen(false);
                    onEndCall();
                  }}
                >
                  Keluar dan akhiri panggilan
                </button>
              </div>
            ) : null}
            <CallControlButton label={isCurrentUserHost ? "Tutup" : "Keluar"} danger onClick={isCurrentUserHost ? () => setExitMenuOpen((open) => !open) : onLeave}>
              <HugeiconsIcon icon={CallEnd01Icon} size={22} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
            </CallControlButton>
          </div>
        </div>
      </div>
      <CallParticipantsSheet open={participantsOpen} onOpenChange={setParticipantsOpen} selfMuted={muted} hostInitials={hostInitials} />
    </>
  );
}
function ActiveCallBadge({ elapsed, onJoin }: { elapsed: number; onJoin: () => void }) {
  return (
    <button
      type="button"
      onClick={onJoin}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2 shadow-none"
    >
      {/* Pulse dot */}
      <PulseDot colorClass="bg-ktr-warning" pingClassName="opacity-55" />
      {/* Stacked avatars */}
      <div className="flex shrink-0 items-center pl-1">
        {callParticipantsList.slice(0, 4).map((p) => (
          <span
            key={p.initials}
            className={cn("-ml-2 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ktr-surface-card text-[9px] font-semibold text-ktr-text-white", p.avatarClass)}
          >
            {p.initials}
          </span>
        ))}
      </div>
      <span className="text-[13px] font-semibold tabular-nums text-ktr-text-primary">{formatCallTime(elapsed)}</span>
    </button>
  );
}


function CallSummaryPage({ duration, onDone }: { duration: number; onDone: () => void }) {
  const participantCount = 6;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const summaryContent = (
    <main className="fixed inset-0 z-[9999] h-dvh w-screen overflow-hidden rounded-none bg-ktr-surface-bg-app text-ktr-text-primary">
      <div className="call-summary-enter relative h-full w-full overflow-hidden rounded-none bg-ktr-surface-bg-app text-center">
        <Image
          src="/icons/ringkasan-panggilan.svg"
          alt=""
          width={250}
          height={250}
          aria-hidden="true"
          className="absolute left-[90px] top-[102px] size-[250px] object-contain"
        />

        <section className="absolute left-[101px] top-[384px] flex w-[228px] flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-3.5">
            <p className="w-full text-center text-[36px] font-semibold leading-[40px] tabular-nums text-ktr-text-primary">{formatCallTime(duration)}</p>
            <div className="-mx-12 w-[324px] space-y-1 text-center">
              <h1 className="text-[24px] font-semibold leading-8 text-ktr-text-primary">Panggilan Berakhir</h1>
              <p className="whitespace-nowrap text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Lanjutkan pekerjaan Anda di proyek.</p>
            </div>
          </div>

          <div className="inline-flex h-9 w-[154px] items-center rounded-[10px] border border-ktr-border-light bg-ktr-surface-card px-2 py-1.5">
            <div className="flex w-[72px] shrink-0 items-center pl-0">
              {callParticipantsList.slice(0, 4).map((participant) => (
                <MemberAvatar key={participant.initials} member={participant} size="-ml-2 first:ml-0 size-6 border border-ktr-surface-card" />
              ))}
            </div>
            <span className="ml-1.5 shrink-0 text-left text-[14px] font-normal leading-[22px] text-ktr-text-primary">{participantCount} peserta</span>
          </div>
        </section>

        <button
          type="button"
          onClick={onDone}
          className="absolute left-1/2 top-[588px] inline-flex h-[42px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-[12px] bg-ktr-primary px-6 py-2.5 text-[16px] font-semibold leading-[22px] text-ktr-text-white transition-colors hover:bg-ktr-primary-hover"
        >
          Kembali ke Diskusi
        </button>
      </div>
    </main>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(summaryContent, document.body);
  }

  return summaryContent;
}
export function DiscussionChatPage({
  hasActiveCall = true,
}: {
  hasActiveCall?: boolean;
} = {}) {
  const [callActive, setCallActive] = React.useState(hasActiveCall);
  const [inCall, setInCall] = React.useState(false);
  const [callElapsed, setCallElapsed] = React.useState(0);
  const [callSummaryDuration, setCallSummaryDuration] = React.useState<number | null>(null);
  const [callHostInitials, setCallHostInitials] = React.useState(CURRENT_USER_INITIALS);
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialChatMessages);
  const [endConfirmOpen, setEndConfirmOpen] = React.useState(false);
  const [startCallConfirmOpen, setStartCallConfirmOpen] = React.useState(false);
  const router = useRouter();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!callActive) return;
    const timer = window.setInterval(() => setCallElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [callActive]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      if (window.location.hash === "#call" && callActive) setInCall(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [callActive]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startCall() {
    setCallSummaryDuration(null);
    setCallActive(true);
    setInCall(true);
  }

  function sendMessage() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "Alya P.",
        initials: "AP",
        avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
        content: trimmed,
        time,
        isSelf: true,
      },
    ]);
    setInputValue("");
  }

  function transferHostFromCurrentUser() {
    const nextHost = callParticipantsList.find((participant) => participant.initials !== CURRENT_USER_INITIALS);
    if (nextHost) setCallHostInitials(nextHost.initials);
  }

  function leaveCall() {
    if (callHostInitials === CURRENT_USER_INITIALS) transferHostFromCurrentUser();
    setInCall(false);
  }

  function endCall() {
    setCallSummaryDuration(callElapsed);
    setInCall(false);
    setCallActive(false);
  }
  async function copyDiscussionLink() {
    const link = typeof window !== "undefined" ? window.location.href : "/student/discussions/current";

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link diskusi disalin", { description: "Bagikan ke anggota kelompok yang perlu masuk ke sesi ini." });
    } catch {
      toast.info("Link diskusi", { description: link });
    }
  }
  if (inCall) {
    return (
      <CallOverlay
        elapsed={callElapsed}
        hostInitials={callHostInitials}
        onBack={() => setInCall(false)}
        onLeave={leaveCall}
        onEndCall={endCall}
      />
    );
  }

  if (callSummaryDuration !== null) {
    return <CallSummaryPage duration={callSummaryDuration} onDone={() => setCallSummaryDuration(null)} />;
  }

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-background text-ktr-text-primary">
      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col">
        {/* Header Block */}
        <div className="shrink-0 border-b border-ktr-border-light bg-background pb-3">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-6 pb-1">
            <AppBackButton href="/student/group" className="px-0" />
            <div className="flex items-center gap-0.5">
              <ProjectBriefSheet
                trigger={
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center rounded-[10px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                    aria-label="Project Brief"
                  >
                    <Icon icon={Task01Icon} />
                  </button>
                }
              />
              <button
                type="button"
                aria-label={callActive ? "Panggilan sedang berlangsung" : "Mulai Panggilan"}
                disabled={callActive}
                className={cn(
                  "flex size-11 items-center justify-center rounded-[10px] transition-colors",
                  callActive ? "cursor-not-allowed text-ktr-text-tertiary" : "text-ktr-text-primary hover:bg-ktr-surface-soft"
                )}
                onClick={() => setStartCallConfirmOpen(true)}
              >
                <Icon icon={Call02Icon} />
              </button>
              <AppDropdown
                label="Aksi diskusi"
                placement="bottom end"
                triggerClassName="flex size-11 items-center justify-center rounded-[10px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                trigger={<Icon icon={MoreVerticalIcon} />}
                items={[
                  {
                    key: "copy",
                    label: "Salin link diskusi",
                    onSelect: copyDiscussionLink,
                  },
                  {
                    key: "progres",
                    label: "Kirim Progres",
                    onSelect: () => {
                      toast.info("Siapkan progresmu", { description: "Lampiran dan catatan akan tercatat di sesi ini." });
                      router.push("/student/progress/new");
                    },
                  },
                  {
                    key: "end",
                    label: "Akhiri Diskusi",
                    tone: "danger" as const,
                    onSelect: () => setEndConfirmOpen(true),
                  },
                ]}
              />
            </div>
          </div>

          {/* Title + active call badge */}
          <div className="px-4">
            <h1 className="text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Pembahasan Konsep Landing Page</h1>
            {callActive && (
              <div className="mt-2">
                <ActiveCallBadge elapsed={callElapsed} onJoin={() => setInCall(true)} />
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex flex-col pb-4 pt-[14px]">
            {messages.map((msg, index) => {
              const previousMessage = messages[index - 1];
              const isGroupedMessage = Boolean(
                previousMessage &&
                !previousMessage.isUnreadDivider &&
                !msg.isUnreadDivider &&
                previousMessage.author === msg.author &&
                previousMessage.isSelf === msg.isSelf
              );
              const messageSpacing = index === 0 ? "mt-0" : isGroupedMessage ? "mt-1.5" : "mt-4";

              if (msg.isUnreadDivider) {
                return (
                  <div key={msg.id} className={cn("flex items-center gap-3", index === 0 ? "mt-0" : "mt-4")}>
                    <div className="h-px flex-1 bg-ktr-border-light" />
                    <span className="shrink-0 text-[12px] leading-[18px] text-ktr-text-tertiary">{msg.content}</span>
                    <div className="h-px flex-1 bg-ktr-border-light" />
                  </div>
                );
              }

              if (msg.isSelf) {
                return (
                  <div key={msg.id} className={cn("flex justify-end", messageSpacing)}>
                    <div className="inline-block max-w-[min(78%,292px)] rounded-l-[16px] rounded-br-[16px] rounded-tr-[0px] bg-ktr-primary px-3.5 py-2">
                      <p className="text-[14px] font-medium leading-[22px] text-ktr-text-white">{msg.content}</p>
                      <p className="mt-1 text-right text-[12px] text-ktr-border-light">{msg.time}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn("grid grid-cols-[32px_minmax(0,1fr)] items-start gap-2.5", messageSpacing)}>
                  {isGroupedMessage ? <span className="size-8 shrink-0" aria-hidden="true" /> : <MemberAvatar member={msg} size="size-8 mt-[22px] shrink-0" />}
                  <div className="flex min-w-0 flex-col items-start">
                    {!isGroupedMessage ? <span className="mb-1 block text-[14px] text-ktr-text-secondary">{msg.author}</span> : null}
                    <div className="inline-block max-w-[min(78%,292px)] rounded-r-[16px] rounded-bl-[16px] rounded-tl-[0px] bg-ktr-surface-soft px-3.5 py-2">
                      <p className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">{msg.content}</p>
                      <p className="mt-1 text-right text-[12px] text-ktr-text-tertiary">{msg.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="shrink-0 bg-background px-3.5 py-2">
          <div className="flex flex-col gap-2 rounded-[14px] bg-ktr-surface-card px-3 pb-2 pt-3 shadow-[0_8px_24px_rgba(43,48,51,0.08)]">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full bg-transparent text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary"
              placeholder="Tuliskan pesan..."
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-ktr-text-primary">
                <button type="button" aria-label="Galeri" className="text-ktr-text-tertiary hover:text-ktr-primary transition-colors" onClick={() => toast.info("Galeri", { description: "Pilih foto dari galeri (segera hadir)" })}>
                  <HugeiconsIcon icon={Album02Icon} size={22} strokeWidth={1.8} color="currentColor" />
                </button>
                <button type="button" aria-label="Dokumen" className="text-ktr-text-tertiary hover:text-ktr-primary transition-colors" onClick={() => toast.info("Dokumen", { description: "Fitur unggah dokumen (segera hadir)" })}>
                  <HugeiconsIcon icon={File02Icon} size={22} strokeWidth={1.8} color="currentColor" />
                </button>
              </div>
              <button
                type="button"
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-[6px] transition-transform disabled:active:scale-100"
                aria-label="Kirim pesan"
              >
                <Image
                  src={inputValue.trim() ? "/icons/send-active.svg" : "/icons/send-disabled.svg"}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                  className="size-10"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={startCallConfirmOpen}
        onOpenChange={setStartCallConfirmOpen}
        title="Mulai panggilan?"
        description="Anggota kelompok akan melihat sesi panggilan aktif dan bisa langsung bergabung."
        confirmText="Mulai Panggilan"
        cancelText="Batal"
        onConfirm={startCall}
      />
      <ConfirmModal
        open={endConfirmOpen}
        onOpenChange={setEndConfirmOpen}
        title="Akhiri diskusi?"
        description="Setelah diakhiri, anggota dapat mengisi umpan balik dan sesi tidak menerima pesan baru."
        confirmText="Akhiri Diskusi"
        cancelText="Batal"
        tone="danger"
        onConfirm={() => {
          setCallActive(false);
          toast.success("Diskusi diakhiri", { description: "Anggota sekarang dapat mengisi umpan balik anggota." });
          router.push("/student/discussions/summary");
        }}
      />
    </main>
  );
}
export function DiscussionDetailPage({ role = "member", discussionStatus = "ongoing", projectReady = false, projectReadyToSubmit }: { role?: DiscussionRole; discussionStatus?: DiscussionStatus; projectReady?: boolean; projectReadyToSubmit?: boolean } = {}) {
  const showOngoingActions = discussionStatus === "ongoing";
  const showWaitingActions = discussionStatus === "waiting_peer_assessment";
  const isFinished = discussionStatus === "finished";
  const canSubmitProject = projectReadyToSubmit ?? projectReady;

  return (
    <main className="min-h-dvh w-full bg-background px-4 pb-10 pt-6 text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <AppBackButton href="/student/group" className="px-0" />
          <div className="flex items-center gap-[14px]">
            <SessionParticipantBadge />
            <AppDropdown
              label="Aksi sesi diskusi"
              placement="bottom end"
              triggerClassName="flex size-11 items-center justify-center rounded-[10px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
              trigger={<Icon icon={MoreVerticalIcon} />}
              items={[
                { key: "detail", label: "Lihat detail sesi", onSelect: () => toast.info("Detail sesi ditampilkan di halaman ini") },
                { key: "report", label: "Laporkan kendala", onSelect: () => toast.info("Kendala dicatat", { description: "Nanti bagian ini disambungkan ke laporan sesi." }) },
              ]}
            />
          </div>
        </div>

        <header className="mb-6 space-y-2">
          <h1 className="text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Pembahasan Konsep Landing Page</h1>
          <p className="text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Dimulai oleh Alya P. Hari ini, 09.00</p>
        </header>

        <div className="space-y-6">
          <SessionMessageCard status={discussionStatus} />

          {showOngoingActions ? (
            <div className="grid grid-cols-2 gap-3">
              <SessionActionCard iconSrc="/icons/mulai-panggilan.svg" label="Mulai Panggilan" href="/student/discussions/current" onClick={() => toast.info("Panggilan dimulai", { description: "Bantu kelompok tetap fokus pada pembahasan." })} />
              {role === "leader" ? <EndDiscussionSheet trigger={<SessionActionCard iconSrc="/icons/akhiri-diskusi.svg" label="Akhiri Diskusi" />} /> : <SessionActionCard iconSrc="/icons/akhiri-diskusi.svg" label="Kirim Progres" href="/student/progress/new" onClick={() => toast.info("Siapkan progresmu", { description: "Lengkapi catatan dan bukti kerja di halaman kirim progres." })} />}
            </div>
          ) : null}

          {showWaitingActions ? (
            <Card className="bg-ktr-secondary-bg-info-card">
              <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Menunggu anggota lain</p>
              <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">3 dari 6 anggota sudah mengisi umpan balik. Chat sesi ini tetap bisa dibaca, tetapi tidak menerima pesan baru.</p>
            </Card>
          ) : null}


          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Progres Sesi Ini</h2>
            <div className="rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3">
              <div className="space-y-3">
                {sessionProgres.map((item, index) => <SessionProgresRow key={item.title} item={item} showDivider={index < sessionProgres.length - 1} />)}
                {discussionStatus === "ongoing" ? (
                  <Link href="/student/progress/new" className="flex h-8 items-center justify-end gap-2 text-[14px] font-medium leading-[22px] text-ktr-primary" onClick={() => toast.info("Siapkan progresmu", { description: "Lampiran dan catatan akan tercatat di sesi ini." })}>
                    <Icon icon={Add01Icon} className="size-5" />
                    Kirim Progres
                  </Link>
                ) : null}
              </div>
            </div>
          </section>

          <p className="-mt-3 text-[12px] font-normal leading-[19px] text-ktr-text-tertiary">Progres dan lampiran di sesi ini dapat dilihat oleh anggota kelompok dan akan tercatat sebagai jejak kontribusi.</p>

          {isFinished ? (
            <section>
              <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Langkah Berikutnya</h2>
              <FinishedNextSteps role={role} projectReadyToSubmit={canSubmitProject} />
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
function formatAttachmentSize(size: number) {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + " MB";
  if (size >= 1024) return Math.max(1, Math.round(size / 1024)) + " KB";
  return size + " B";
}

export function ProgressInputPage() {
  const [progress, setProgress] = React.useState("");
  const [evidenceLink, setEvidenceLink] = React.useState("");
  const [attachment, setAttachment] = React.useState<{ name: string; size: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canSubmit = progress.trim().length > 0 && (Boolean(attachment) || evidenceLink.trim().length > 0);

  function handleAttachmentChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAttachment({ name: file.name, size: formatAttachmentSize(file.size) });
    event.target.value = "";
  }

  function submitProgress() {
    if (!canSubmit) return;
    toast.success("Progres berhasil dikirim.", { description: "Progresmu sudah tercatat untuk ditinjau kelompok." });
  }

  return (
    <ScreenShell title="Kirim Progres">
      <div className="space-y-5">
        <label className="block space-y-3">
          <span className="block text-[16px] font-medium leading-[22px] text-ktr-text-primary">Progres yang Dikerjakan</span>
          <textarea
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
            className="min-h-28 w-full min-w-0 resize-none rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 py-3 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12"
            placeholder="Contoh: Saya menyelesaikan draft tampilan awal dan menambahkan konten utama."
          />
        </label>

        <div>
          <p className="mb-3 text-[16px] font-medium leading-[22px] text-ktr-text-primary">Bukti Progres</p>
          {attachment ? (
            <div className="flex items-center justify-between gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <Image src="/icons/file-icon.svg" alt="" width={32} height={32} aria-hidden="true" className="size-8 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium leading-5 text-ktr-text-primary">{attachment.name}</span>
                  <span className="block text-[11px] leading-4 text-ktr-text-tertiary">{attachment.size}</span>
                </span>
              </span>
              <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft" onClick={() => setAttachment(null)} aria-label="Hapus lampiran">
                <Icon icon={Cancel01Icon} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="flex min-h-[96px] w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-ktr-border-input bg-ktr-primary-bg-form px-4 py-4 text-center transition-colors hover:border-ktr-primary/50 hover:bg-ktr-primary-soft/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon icon={CloudUploadIcon} className="text-ktr-primary" />
              <span className="mt-2 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Tambahkan Lampiran</span>
              <span className="text-[13px] leading-5 text-ktr-text-secondary">Unggah file atau gambar pendukung.</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip" onChange={handleAttachmentChange} />
        </div>

        <label className="block space-y-3">
          <span className="block text-[16px] font-medium leading-[22px] text-ktr-text-primary">Link Bukti Progres</span>
          <input
            value={evidenceLink}
            onChange={(event) => setEvidenceLink(event.target.value)}
            className="flex h-11 w-full min-w-0 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 text-[14px] leading-none text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12"
            placeholder="Tempel link bukti progress"
          />
        </label>

        <div>
          <p className="mb-3 text-[16px] font-medium leading-[22px] text-ktr-text-primary">Status Progres</p>
          <Segments items={["Sedang Dikerjakan", "Selesai", "Terkendala"]} />
        </div>

        <div className="pt-5">
          <Button className="h-11 w-full rounded-[12px] text-[14px] font-semibold disabled:opacity-45" disabled={!canSubmit} onClick={submitProgress}>Kirim Progres</Button>
        </div>
      </div>
    </ScreenShell>
  );
}

const peerAssessmentStorageKey = "kontrilab-peer-assessment-completed";
const peerAssessmentSelectedKey = "kontrilab-peer-assessment-selected";

function readPeerAssessmentCompleted() {
  if (typeof window === "undefined") return [] as string[];

  try {
    const rawValue = window.localStorage.getItem(peerAssessmentStorageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [] as string[];
  }
}

function writePeerAssessmentCompleted(names: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(peerAssessmentStorageKey, JSON.stringify(names));
  window.dispatchEvent(new Event("peer-assessment-updated"));
}

function setPendingPeerAssessmentMember(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(peerAssessmentSelectedKey, name);
}

const assessmentMembers = groupMembers.map((member) => ({
  name: member.name === "Alya Putri Ramadhani" ? "Alya P." : member.name === "Bima Aditya Pratama" ? "Bima A." : member.name === "Raka Maulana Yusuf" ? "Raka M." : "Nadia S.",
  role: member.role,
  initials: member.initials,
  avatarClass: member.avatarClass,
}));

const assessmentQuestions = [
  { key: "participation", title: "Keaktifan Diskusi", subtitle: "Seberapa aktif anggota ini ikut berdiskusi?" },
  { key: "progress", title: "Kontribusi Progres", subtitle: "Seberapa jelas kontribusi progres yang diberikan?" },
  { key: "teamwork", title: "Kerja Sama", subtitle: "Seberapa baik anggota ini bekerja sama dengan tim?" },
  { key: "responsibility", title: "Tanggung Jawab", subtitle: "Seberapa konsisten anggota ini menyelesaikan bagiannya?" },
] as const;

type AssessmentQuestionKey = (typeof assessmentQuestions)[number]["key"];
type AssessmentRatings = Partial<Record<AssessmentQuestionKey, number>>;

function AssessmentScaleQuestion({ title, subtitle, value, onChange }: { title: string; subtitle: string; value?: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{title}</p>
        <p className="mt-0.5 text-[12px] leading-[18px] text-ktr-text-secondary">{subtitle}</p>
      </div>
      <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={title}>
        {[1, 2, 3, 4].map((score) => {
          const selected = value === score;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={selected}
              className={cn(
                "flex h-10 items-center justify-center rounded-[12px] border text-[14px] font-semibold leading-[22px] transition-colors",
                selected ? "border-ktr-primary bg-ktr-primary-soft text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-secondary",
              )}
              onClick={() => onChange(score)}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PeerAssessmentPage({ currentUserInitials = "AP", allMembersCompleted = false }: { currentUserInitials?: string; allMembersCompleted?: boolean } = {}) {
  const router = useRouter();
  const [member, setMember] = React.useState("");
  const [ratings, setRatings] = React.useState<AssessmentRatings>({});
  const [description, setDescription] = React.useState("");
  const [completedMembers, setCompletedMembers] = React.useState<string[]>([]);
  const assessableMembers = assessmentMembers.filter((item) => item.initials !== currentUserInitials);
  const selectedMember = assessableMembers.find((item) => item.name === member);
  const isComplete = Boolean(member) && assessmentQuestions.every((question) => ratings[question.key]) && description.trim().length > 0;

  React.useEffect(() => {
    const storedCompleted = readPeerAssessmentCompleted();
    const targetMembers = assessmentMembers.filter((item) => item.initials !== currentUserInitials);
    const pendingMember = window.localStorage.getItem(peerAssessmentSelectedKey) ?? "";
    const pendingIsValid = targetMembers.some((item) => item.name === pendingMember) && !storedCompleted.includes(pendingMember);
    const firstIncompleteMember = targetMembers.find((item) => !storedCompleted.includes(item.name))?.name ?? "";
    const nextMember = pendingIsValid ? pendingMember : firstIncompleteMember;

    const id = window.setTimeout(() => {
      setCompletedMembers(storedCompleted);
      setMember(nextMember);
      setRatings({});
      setDescription("");
      window.localStorage.removeItem(peerAssessmentSelectedKey);
    }, 0);
    return () => window.clearTimeout(id);
  }, [currentUserInitials]);

  function updateRating(key: AssessmentQuestionKey, value: number) {
    setRatings((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    if (!isComplete) {
      toast.warning("Lengkapi semua penilaian terlebih dahulu.");
      return;
    }

    const nextCompleted = Array.from(new Set([...completedMembers, member]));
    setCompletedMembers(nextCompleted);
    writePeerAssessmentCompleted(nextCompleted);
    setRatings({});
    setDescription("");

    toast.success("Umpan balik tersimpan", { description: (selectedMember?.name ?? "Anggota") + " sudah ditandai selesai." });
    router.push(allMembersCompleted ? "/student/discussions/waiting" : "/student/discussions/summary");
  }

  return (
    <ScreenShell title="Umpan Balik Sesi" backHref="/student/discussions/summary">
      <Card className="mb-5 space-y-1 bg-ktr-primary-bg-form">
        <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Pembahasan Konsep Landing Page</h2>
        <p className="text-[13px] leading-5 text-ktr-text-secondary">Kelompok 4</p>
        <p className="text-[13px] leading-5 text-ktr-text-secondary">Selesai didiskusikan hari ini, 10.15</p>
      </Card>

      {selectedMember ? (
        <div className="space-y-7">
          <div className="flex min-w-0 items-center gap-3">
            <MemberAvatar member={selectedMember} size="size-9" />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Penilaian untuk {selectedMember.name}</p>
              <p className="text-[12px] leading-[18px] text-ktr-text-secondary">Pilih skala 1 sampai 4 untuk tiap pertanyaan.</p>
            </div>
          </div>

          <div className="space-y-5">
            {assessmentQuestions.map((question) => (
              <AssessmentScaleQuestion key={question.key} title={question.title} subtitle={question.subtitle} value={ratings[question.key]} onChange={(value) => updateRating(question.key, value)} />
            ))}
            <label className="block min-w-0">
              <span className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Deskripsi</span>
              <span className="mt-0.5 block text-[12px] leading-[18px] text-ktr-text-secondary">Jelaskan singkat kontribusi atau catatan untuk anggota ini.</span>
              <textarea
                className="mt-3 min-h-24 w-full min-w-0 resize-none rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 py-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20"
                placeholder="Tulis penjelasan singkat..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>

          <Button className="h-11 w-full rounded-[12px] text-[14px] font-medium disabled:opacity-45" disabled={!isComplete} onClick={submit}>Kirim Umpan Balik</Button>
        </div>
      ) : (
        <Card className="bg-ktr-secondary-bg-info-card p-3">
          <p className="text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Semua anggota sudah diberi umpan balik.</p>
        </Card>
      )}
    </ScreenShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3">
      <p className="text-[18px] font-semibold leading-[26px] text-ktr-text-primary">{value}</p>
      <p className="mt-1 text-[12px] leading-[18px] text-ktr-text-secondary">{label}</p>
    </div>
  );
}

export function SessionSummaryPage({ role = "member", projectReadyToSubmit = false, currentUserInitials = "AP" }: { role?: DiscussionRole; projectReadyToSubmit?: boolean; currentUserInitials?: string } = {}) {
  void role;
  void projectReadyToSubmit;
  const progresItems = [
    ["Bima A.", "Desain hero section", "1 lampiran", "09.24", "bg-[linear-gradient(135deg,#233046,#5b8fb9)]"],
    ["Raka M.", "Draft konten produk", "1 link", "09.36", "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]"],
    ["Nadia S.", "Layout halaman kontak", "1 lampiran", "09.45", "bg-[linear-gradient(135deg,#57c186,#2f536f)]"],
  ];
  const peerTargets = assessmentMembers.filter((member) => member.initials !== currentUserInitials);
  const [completedPeerNames, setCompletedPeerNames] = React.useState<string[]>([]);
  const hasPendingPeerAssessment = peerTargets.some((member) => !completedPeerNames.includes(member.name));

  React.useEffect(() => {
    function syncCompleted() {
      setCompletedPeerNames(readPeerAssessmentCompleted());
    }

    syncCompleted();
    window.addEventListener("peer-assessment-updated", syncCompleted);
    window.addEventListener("storage", syncCompleted);
    return () => {
      window.removeEventListener("peer-assessment-updated", syncCompleted);
      window.removeEventListener("storage", syncCompleted);
    };
  }, []);

  return (
    <ScreenShell title="Ringkasan Sesi" backHref="/student/discussions/finished">
      <Card className="mb-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Pembahasan Konsep Landing Page</h2>
            <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Hari ini, 09.00 - 10.15</p>
          </div>
          <span className="shrink-0 rounded-full bg-ktr-primary-soft px-2.5 py-1 text-[12px] font-medium leading-4 text-ktr-primary">Selesai</span>
        </div>
        <p className="text-[13px] leading-5 text-ktr-text-secondary">6 peserta</p>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-2">
        <SummaryStat value="12" label="pesan diskusi" />
        <SummaryStat value="3" label="progres terkirim" />
        <SummaryStat value="4" label="lampiran ditambahkan" />
        <SummaryStat value={`${completedPeerNames.length}/${peerTargets.length}`} label="umpan balik anggota selesai" />
      </div>

      <SectionTitle>Progres Sesi Ini</SectionTitle>
      <Card className="mb-6 p-3">
        <div className="space-y-3">
          {progresItems.map(([name, title, file, time, avatar], index) => (
            <div key={title} className="space-y-3">
              <div>
                <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{title}</p>
                <div className="mt-2 flex min-w-0 items-center gap-2 text-[12px] leading-[18px] text-ktr-text-tertiary">
                  <MemberAvatar member={{ initials: name.slice(0, 1), avatarClass: avatar }} size="size-6" />
                  <span className="shrink-0 font-normal text-ktr-text-primary">{name}</span>
                  <span className="size-1 rounded-full bg-ktr-text-tertiary/70" aria-hidden="true" />
                  <span className="shrink-0">{file}</span>
                  <span className="size-1 rounded-full bg-ktr-text-tertiary/70" aria-hidden="true" />
                  <span className="min-w-0 truncate">{time}</span>
                </div>
              </div>
              {index < progresItems.length - 1 ? <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Umpan Balik Anggota</h2>
        {hasPendingPeerAssessment ? (
          <PulseDot aria-label="Ada umpan balik anggota yang wajib diisi" />
        ) : null}
      </div>
      <Card className="mb-6 p-3">
        <div className="space-y-3">
          {peerTargets.map((member, index) => {
            const completed = completedPeerNames.includes(member.name);
            const rowContent = (
              <>
                <MemberAvatar member={member} size="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{member.name}</p>
                  <p className="text-[12px] leading-[18px] text-ktr-text-secondary">{completed ? "Umpan balik sudah dikirim" : "Belum mengisi umpan balik"}</p>
                </div>
                <span className={cn("flex size-8 shrink-0 items-center justify-center", completed ? "text-ktr-primary" : "text-ktr-text-tertiary")} aria-label={completed ? "Sudah diberi umpan balik" : "Isi umpan balik"}>
                  <Icon icon={completed ? CheckmarkCircle02Icon : ArrowRight02Icon} className="size-5" />
                </span>
              </>
            );

            return (
              <div key={member.initials} className="space-y-3">
                {completed ? (
                  <div className="flex min-w-0 items-center gap-3">{rowContent}</div>
                ) : (
                  <Link href="/student/peer-assessment" className="flex min-w-0 items-center gap-3 rounded-[12px] transition-colors hover:bg-ktr-primary-soft/40" onClick={() => setPendingPeerAssessmentMember(member.name)}>
                    {rowContent}
                  </Link>
                )}
                {index < peerTargets.length - 1 ? <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" /> : null}
              </div>
            );
          })}
        </div>
        <p className="mt-3 rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[12px] leading-[18px] text-ktr-text-secondary">Isi umpan balik anggota tidak ditampilkan ke anggota lain.</p>
      </Card>
    </ScreenShell>
  );
}

function SubmitProjectConfirmSheet({ open, onOpenChange, result }: { open: boolean; onOpenChange: (open: boolean) => void; result: string }) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Kirim Proyek?</BottomSheetTitle>
          <BottomSheetDescription>Setelah proyek dikirim, anggota tidak bisa mengubah hasil akhir kecuali guru memberikan revisi.</BottomSheetDescription>
        </BottomSheetHeader>
        <p className="mt-5 rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] leading-5 text-ktr-text-secondary">Pastikan link atau file hasil akhir sudah benar dan semua anggota sudah menyepakati pengiriman proyek.</p>
        <div className="mt-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3 text-[13px] leading-5 text-ktr-text-secondary">{result}</div>
        <BottomSheetFooter>
          <BottomSheetClose asChild><QuietButton className="w-full rounded-[16px]">Cek Lagi</QuietButton></BottomSheetClose>
          <BottomSheetClose asChild>
            <Link href="/student/projects/submit/success" className="inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-ktr-primary px-4 text-[14px] font-medium text-ktr-text-white" onClick={() => toast.success("Proyek dikirim", { description: "Status proyek berubah menjadi menunggu tinjauan guru." })}>Ya, Kirim Proyek</Link>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export function SubmitProjectPage({ role = "member", projectReadyToSubmit = false }: { role?: DiscussionRole; projectReadyToSubmit?: boolean } = {}) {
  const checklistItems = [
    "Semua sesi diskusi utama sudah selesai",
    "Progres anggota sudah tercatat",
    "Lampiran penting sudah ditambahkan",
    "Peer assessment sesi terakhir sudah selesai",
    "Kelompok sudah sepakat untuk submit",
  ];
  const [result, setResult] = React.useState("");
  const [checked, setChecked] = React.useState<boolean[]>(checklistItems.map(() => false));
  const [open, setOpen] = React.useState(false);
  const allChecked = checked.every(Boolean);

  function submit() {
    if (!result.trim() || !allChecked) {
      toast.warning("Lengkapi hasil akhir proyek sebelum submit.");
      return;
    }
    setOpen(true);
  }

  if (role !== "leader") {
    return <RoleRestrictedState title="Kirim Proyek" description="Hanya ketua kelompok yang dapat mengirim hasil akhir proyek." backHref="/student/discussions/summary" />;
  }

  if (!projectReadyToSubmit) {
    return <RoleRestrictedState title="Kirim Proyek" description="Proyek belum siap dikirim. Pastikan sesi terakhir sudah selesai dan umpan balik anggota lengkap." backHref="/student/discussions/summary" />;
  }

  return (
    <ScreenShell title="Kirim Proyek" subtitle="Pastikan hasil proyek dan kontribusi kelompok sudah tercatat sebelum dikirim ke guru." backHref="/student/discussions/summary">
      <Card className="mb-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Landing Page UMKM</h2>
            <p className="text-[13px] leading-5 text-ktr-text-secondary">XI - Desain Web &bull; Kelompok 4</p>
          </div>
          <span className="shrink-0 rounded-full bg-ktr-primary-soft px-2.5 py-1 text-[12px] font-medium leading-4 text-ktr-primary">Siap Dikirim</span>
        </div>
      </Card>

      <SectionTitle>Checklist Sebelum Kirim</SectionTitle>
      <Card className="mb-6 p-3">
        <div className="space-y-3">
          {checklistItems.map((item, index) => (
            <button key={item} type="button" className="flex w-full items-center gap-3 text-left" onClick={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))}>
              <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-[10px] border", checked[index] ? "border-ktr-primary bg-ktr-primary-soft text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-tertiary")}><Icon icon={TaskDone02Icon} /></span>
              <span className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item}</span>
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle>Hasil Akhir Proyek</SectionTitle>
      <Card className="mb-6 space-y-4">
        <label className="block min-w-0">
          <span className="text-[12px] font-medium leading-4 text-ktr-text-primary">Link atau File Hasil Proyek</span>
          <input value={result} onChange={(event) => setResult(event.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder="Tempel link Figma, Drive, GitHub, atau dokumen hasil akhir" />
        </label>
        <Field label="Catatan untuk Guru" placeholder="Tulis catatan singkat jika ada hal yang perlu diketahui guru." as="textarea" />
      </Card>

      <Card className="mb-6 bg-ktr-primary-bg-form">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Ringkasan Kontribusi</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[13px] leading-5 text-ktr-text-secondary">
          <span>6 sesi diskusi selesai</span><span>14 progres terkirim</span><span>18 lampiran ditambahkan</span><span>Semua umpan balik anggota selesai</span>
        </div>
        <p className="mt-3 text-[12px] leading-[18px] text-ktr-text-tertiary">Ringkasan ini membantu guru meninjau proses kerja kelompok, bukan menggantikan penilaian guru.</p>
      </Card>

      <Button className="h-11 w-full rounded-[12px] text-[14px] font-medium" onClick={submit}>Kirim Proyek</Button>
      <SubmitProjectConfirmSheet open={open} onOpenChange={setOpen} result={result || "Belum ada link"} />
    </ScreenShell>
  );
}
export function SubmitSuccessPage() {
  return (
    <ScreenShell title="Proyek Berhasil Dikirim!" subtitle="Hasil proyek kelompokmu sudah dikirim ke guru untuk ditinjau." backHref="/student/projects">
      <Card className="mb-6 bg-ktr-success-bg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-[16px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={TaskDone02Icon} className="size-7" /></div>
        <p className="mt-4 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Status proyek sekarang:</p>
        <p className="mt-1 text-[18px] font-semibold leading-[28px] text-ktr-primary">Menunggu Tinjauan Guru</p>
      </Card>
      <div className="space-y-2">
        <Button asChild className="h-11 w-full rounded-[12px] text-[14px] font-medium"><Link href="/student/projects/submitted">Kembali ke Proyek</Link></Button>
        <Button asChild variant="outline" className="h-11 w-full rounded-[12px] border-transparent bg-ktr-primary-soft text-[14px] font-medium text-ktr-primary"><Link href="/student/activities/contribution">Lihat Ringkasan Kontribusi</Link></Button>
      </div>
    </ScreenShell>
  );
}

export function ProjectRevisionPage() {
  return (
    <ScreenShell title="Revisi Proyek" subtitle="Guru memberikan catatan agar hasil proyek bisa diperbaiki sebelum dinilai akhir." backHref="/student/projects/submitted">
      <Card className="mb-6 bg-ktr-project-revision-bg">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Catatan Guru</p>
        <p className="mt-2 text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Perbaiki bagian tampilan halaman kontak dan tambahkan bukti pengerjaan dari tiap anggota.</p>
      </Card>
      <div className="space-y-2">
        <CreateDiscussionSheet trigger={<Button className="h-11 w-full rounded-[12px] text-[14px] font-medium">Buka Diskusi Revisi</Button>} />
        <Button asChild variant="outline" className="h-11 w-full rounded-[12px] border-transparent bg-ktr-primary-soft text-[14px] font-medium text-ktr-primary"><Link href="/student/progress/new">Kirim Progres Revisi</Link></Button>
      </div>
    </ScreenShell>
  );
}
export function ActivitiesPage() {
  const items = [
    { title: "Bima mengirim progres desain hero section", meta: "Website Profil Sekolah - 5 menit lalu", important: false },
    { title: "Alya memulai diskusi baru", meta: "Pembahasan Konsep Landing Page - 18 menit lalu", important: true },
    { title: "Raka mengunggah bukti kerja", meta: "Website Profil Sekolah - 1 jam lalu", important: false },
    { title: "Nadia memberi umpan balik anggota", meta: "Kelompok 4 - Kemarin", important: true },
  ] as const;

  return (
    <ScreenShell title="Aktivitas" showBottomNav>
      <Segments items={["Semua", "Diskusi", "Progres", "Umpan Balik"]} />
      <section className="mt-5 rounded-[16px] bg-ktr-surface-card px-3">
        <div className="divide-y divide-ktr-border-light">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3 py-3.5">
              <span className="mt-[7px] shrink-0">
                {item.important ? <PulseDot colorClass="bg-ktr-primary" pingClassName="opacity-45" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">{item.title}</p>
                <p className="mt-0.5 text-[13px] leading-5 text-ktr-text-secondary">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ScreenShell>
  );
}

export function ContributionSummaryPage() {
  const members = [["Alya", "Ketua Kelompok", "2 diskusi dimulai", "2 progres diunggah"], ["Bima", "Anggota", "3 pesan diskusi", "1 bukti kerja"], ["Raka", "Anggota", "2 pesan diskusi", "1 progres diunggah"], ["Nadia", "Anggota", "1 progres diunggah", "1 umpan balik diberikan"]];
  return <ScreenShell title="Ringkasan Kontribusi" subtitle="Lihat gambaran kontribusi anggota berdasarkan diskusi, progres, bukti kerja, dan umpan balik."><Card className="mb-4 bg-ktr-primary text-ktr-text-white"><p className="text-[14px] font-semibold leading-[22px] text-ktr-accent-lime">Minggu Ini</p><div className="mt-3 grid min-w-0 grid-cols-2 gap-3 text-[13px] leading-5"><span>4 anggota aktif</span><span>6 progres diunggah</span><span>3 bukti kerja ditambahkan</span><span>2 sesi diskusi berlangsung</span></div></Card><div className="space-y-3">{members.map(([name, role, a, b]) => <Card key={name}><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">{name}</h3><p className="text-[13px] leading-5 text-ktr-text-secondary">{role}</p></div><Icon icon={StarIcon} className="text-ktr-warning" /></div><div className="mt-3 flex min-w-0 flex-wrap gap-2"><span className="min-w-0 rounded-full bg-ktr-primary-soft px-3 py-1 text-[12px] text-ktr-primary">{a}</span><span className="min-w-0 rounded-full bg-ktr-secondary-bg-info-card px-3 py-1 text-[12px] text-ktr-secondary">{b}</span></div></Card>)}</div><Card className="mt-4 bg-ktr-secondary-bg-info-card"><p className="text-[13px] leading-5 text-ktr-text-secondary">Ringkasan ini membantu membaca aktivitas kelompok, bukan menentukan nilai akhir.</p></Card></ScreenShell>;
}

function ProfileStatusBadge({ status }: { status: StudentProfileOverview["user"]["activityStatus"] }) {
  const className = status === "Perlu Perhatian" ? "text-ktr-project-need-attention" : status === "Tidak Ada Aktivitas Terbaru" ? "text-ktr-text-secondary" : "text-ktr-primary";
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-ktr-border-light bg-ktr-surface-card px-2.5 py-1 text-[12px] font-semibold leading-4", className)}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{status}</span>;
}

function ProfileEmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <Card className="text-center"><p className="text-[15px] font-semibold leading-[22px] text-ktr-text-primary">{title}</p>{description ? <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">{description}</p> : null}{action ? <div className="mt-3">{action}</div> : null}</Card>;
}

function ProfileLoadingState() {
  return <div className="space-y-4" aria-label="Memuat profil"><Card className="h-[190px] animate-pulse bg-ktr-surface-soft" /><div className="grid grid-cols-2 gap-2">{Array.from({ length: 4 }).map((_, index) => <Card key={index} className="h-[96px] animate-pulse bg-ktr-surface-soft" />)}</div><Card className="h-[150px] animate-pulse bg-ktr-surface-soft" /></div>;
}

const activityIconMap: Record<RecentActivity["type"], Parameters<typeof HugeiconsIcon>[0]["icon"]> = {
  "Upload Progress": Upload04Icon,
  "Feedback Guru": ChatFeedback01Icon,
  "Respons Feedback": MessageDone02Icon,
  "Pesan Diskusi": BubbleChatIcon,
  "Submit Final Kelompok": TaskDone02Icon,
  Asesmen: UserGroupIcon,
};

export function ProfilePage() {
  const [data, setData] = React.useState<StudentProfileOverview | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [openedFeedbackIds, setOpenedFeedbackIds] = React.useState<string[]>([]);

  const loadProfile = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const overview = await getStudentProfileOverview();
      const savedProfile = studentSettingsStorage.getProfile();
      setData({
        ...overview,
        user: {
          ...overview.user,
          fullName: savedProfile.name || overview.user.fullName,
          email: savedProfile.email || overview.user.email,
          avatarUrl: savedProfile.avatarDataUrl || overview.user.avatarUrl,
        },
      });
    } catch {
      setError("Profil belum bisa dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const id = window.setTimeout(() => { void loadProfile(); }, 0);
    return () => window.clearTimeout(id);
  }, [loadProfile]);

  const unreadFeedbackCount = data ? Math.max(0, data.summary.unreadFeedbackCount - openedFeedbackIds.length) : 0;
  const summaryItems = data ? [
    { label: "Upload Progress", value: data.summary.uploadProgressCount, icon: Upload04Icon },
    { label: "Bukti Tervalidasi", value: data.summary.validatedEvidenceCount, icon: FileCheckIcon },
    { label: "Proyek Aktif", value: data.summary.activeProjectCount, icon: Briefcase01Icon },
    { label: "Feedback Baru", value: unreadFeedbackCount, icon: ChatFeedback01Icon },
  ] : [];
  const visibleProjects = data?.projects.slice(0, 3) ?? [];
  const visibleActivities = data?.recentActivities.slice(0, 5) ?? [];
  const statusRows: Array<{ label: string; value?: string; icon: Parameters<typeof HugeiconsIcon>[0]["icon"] }> = data ? [
    { label: "Upload Terakhir", value: data.activityStatus.lastProgressUpload, icon: Upload04Icon },
    { label: "Respons Feedback", value: data.activityStatus.lastFeedbackResponse, icon: MessageDone02Icon },
    { label: "Aktivitas Diskusi", value: data.activityStatus.lastDiscussionActivity, icon: BubbleChatIcon },
  ] : [];
  const initials = data?.user.fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AK";

  return (
    <ScreenShell
      title="Profil"
      showBottomNav
      action={<Link href="/settings" aria-label="Buka pengaturan" className="flex size-11 items-center justify-center rounded-[14px] border border-ktr-border-light bg-ktr-surface-card text-ktr-text-primary transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.995]"><Icon icon={Settings02Icon} /></Link>}
    >
      {loading ? <ProfileLoadingState /> : error ? (
        <ProfileEmptyState title="Profil Belum Tersedia" description={error} action={<Button type="button" variant="outline" className="h-10 rounded-[12px] border-ktr-border-light px-4 text-[14px] font-semibold text-ktr-text-primary" onClick={() => void loadProfile()}>Coba Lagi</Button>} />
      ) : data ? (
        <div className="space-y-5">
          <Card className="border-ktr-primary/20 bg-ktr-primary-soft p-4">
            <div className="flex items-start gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-ktr-primary/15 bg-ktr-surface-card text-[22px] font-semibold text-ktr-primary">
                {data.user.avatarUrl ? <Image src={data.user.avatarUrl} alt="Foto profil" width={72} height={72} unoptimized className="h-full w-full object-cover" /> : initials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-[20px] font-semibold leading-[28px] text-ktr-text-primary">{data.user.fullName}</h2>
                {data.user.username ? <p className="mt-0.5 truncate text-[14px] leading-[22px] text-ktr-text-secondary">@{data.user.username}</p> : data.user.displayName ? <p className="mt-0.5 truncate text-[14px] leading-[22px] text-ktr-text-secondary">{data.user.displayName}</p> : null}
                <p className="mt-2 break-words text-[13px] leading-5 text-ktr-text-secondary">{data.user.email}</p>
                <div className="mt-3"><ProfileStatusBadge status={data.user.activityStatus} /></div>
              </div>
            </div>
            <Button asChild className="mt-4 h-11 w-full rounded-[12px] text-[14px] font-semibold"><Link href="/settings/profile">Edit Profil</Link></Button>
          </Card>

          <section>
            <SectionTitle>Ringkasan Aktivitas</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {summaryItems.map((item) => <Card key={item.label} className="p-3"><Icon icon={item.icon} className="mb-3 text-ktr-primary" /><p className="text-[22px] font-semibold leading-[30px] text-ktr-text-primary">{item.value}</p><p className="text-[13px] leading-5 text-ktr-text-secondary">{item.label}</p></Card>)}
            </div>
          </section>

          <section>
            <SectionTitle>Status Aktivitas</SectionTitle>
            <Card>
              <div className="flex items-start justify-between gap-3"><p className="min-w-0 text-[14px] leading-[22px] text-ktr-text-secondary">{data.activityStatus.reason || "Belum Ada Aktivitas"}</p><ProfileStatusBadge status={data.activityStatus.status} /></div>
              <div className="mt-4 space-y-3 text-[13px] leading-5">
                {statusRows.map((row) => <div key={row.label} className="flex items-center gap-3"><Icon icon={row.icon} className="shrink-0 text-ktr-primary" /><span className="min-w-0 flex-1 text-ktr-text-secondary">{row.label}</span><span className="max-w-[45%] text-right font-semibold text-ktr-text-primary">{row.value || "Belum Ada Aktivitas"}</span></div>)}
              </div>
            </Card>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Proyek yang Diikuti</h2>{data.projects.length > visibleProjects.length ? <Link href="/student/projects" className="text-[13px] font-semibold leading-5 text-ktr-primary">Lihat Semua</Link> : null}</div>
            {visibleProjects.length ? <div className="space-y-2">{visibleProjects.map((project) => <Link key={project.projectId} href={project.targetRoute} className="block"><Card className="transition-[border-color,transform] hover:border-ktr-primary/35 active:scale-[0.995]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-[15px] font-semibold leading-[22px] text-ktr-text-primary">{project.projectName}</h3><p className="mt-0.5 text-[13px] leading-5 text-ktr-text-secondary">{[project.groupName, project.role].filter(Boolean).join(" - ")}</p></div><Icon icon={ArrowRight02Icon} className="mt-1 shrink-0 text-ktr-text-primary" /></div><div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] leading-[18px]"><span className="text-ktr-text-tertiary">Upload Terakhir</span><span className="text-right font-semibold text-ktr-text-primary">{project.lastProgressUpload || "Belum Ada Aktivitas"}</span><span className="text-ktr-text-tertiary">Deadline Submit Final</span><span className="text-right font-semibold text-ktr-text-primary">{project.finalSubmissionDeadline}</span><span className="text-ktr-text-tertiary">Submit Final</span><span className="text-right font-semibold text-ktr-text-primary">{project.finalSubmissionStatus}</span></div></Card></Link>)}</div> : <ProfileEmptyState title="Belum Ada Proyek" description="Kamu belum tergabung di proyek aktif." action={<Button asChild variant="outline" className="h-10 rounded-[12px] border-ktr-border-light px-4 text-[14px] font-semibold text-ktr-text-primary"><Link href="/student/projects">Jelajahi Proyek</Link></Button>} />}
          </section>

          <section>
            <SectionTitle>Feedback Terbaru</SectionTitle>
            {data.feedback ? <Link href={data.feedback.targetRoute} className="block" onClick={() => setOpenedFeedbackIds((current) => current.includes(data.feedback!.id) ? current : [...current, data.feedback!.id])}><Card className="border-ktr-primary/20 bg-ktr-primary-soft/60 transition-[border-color,transform] hover:border-ktr-primary/35 active:scale-[0.995]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[13px] font-semibold leading-5 text-ktr-primary">{data.feedback.status}</p><h3 className="mt-1 text-[15px] font-semibold leading-[22px] text-ktr-text-primary">{data.feedback.projectName}</h3><p className="mt-0.5 text-[13px] leading-5 text-ktr-text-secondary">{data.feedback.senderName} - {data.feedback.createdAt}</p></div><Icon icon={ArrowRight02Icon} className="mt-1 shrink-0 text-ktr-text-primary" /></div><p className="mt-3 line-clamp-3 text-[14px] leading-[22px] text-ktr-text-secondary">{data.feedback.contentPreview}</p></Card></Link> : <ProfileEmptyState title="Belum Ada Feedback" description="Feedback terbaru akan muncul di sini." />}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Aktivitas Terbaru</h2>{data.recentActivities.length > visibleActivities.length ? <Link href="/student/activities" className="text-[13px] font-semibold leading-5 text-ktr-primary">Lihat Semua</Link> : null}</div>
            {visibleActivities.length ? <Card className="px-[14px] py-3"><div className="divide-y divide-ktr-border-light">{visibleActivities.map((activity) => <Link key={activity.id} href={activity.targetRoute} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={activityIconMap[activity.type] || Activity01Icon} /></span><span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{activity.title}</span><span className="mt-0.5 block text-[13px] leading-5 text-ktr-text-secondary">{activity.context}</span></span><span className="shrink-0 text-[12px] leading-[18px] text-ktr-text-tertiary">{activity.createdAt}</span></Link>)}</div></Card> : <ProfileEmptyState title="Belum Ada Aktivitas" description="Aktivitas terbaru akan muncul setelah kamu mulai berkontribusi." />}
          </section>
        </div>
      ) : null}
    </ScreenShell>
  );
}




















