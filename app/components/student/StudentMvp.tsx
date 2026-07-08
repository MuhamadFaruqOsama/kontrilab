"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Album02Icon,
  ArrowRight02Icon,
  BubbleChatIcon,
  Briefcase01Icon,
  Calendar03Icon,
  Call02Icon,
  CallEnd01Icon,
  Camera01Icon,
  CameraAdd01Icon,
  Clock01Icon,
  Copy01Icon,
  CopyLinkIcon,
  Download04Icon,
  File02Icon,
  FileCheckIcon,
  Flag01Icon,
  LabelImportantIcon,
  Login02Icon,
  MessageDone02Icon,
  Mic01Icon,
  MicOff01Icon,
  MoreVerticalIcon,
  SentIcon,
  Task01Icon,
  TaskDone02Icon,
  Search01Icon,
  StarIcon,
  Upload04Icon,
  UserGroupIcon,
  VideoOffIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "@/components/ui/toast";
import * as React from "react";

import BottomNav from "@/app/components/student/BottomNav";
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

type Status = "Belum Dimulai" | "Sedang Berjalan" | "Revisi" | "Selesai";

type Project = {
  title: string;
  className: string;
  group: string;
  members: string;
  deadline: string;
  status: Status;
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
];

const statusClass: Record<Status, string> = {
  "Belum Dimulai": "bg-ktr-project-not-started-bg text-ktr-project-not-started",
  "Sedang Berjalan": "bg-ktr-project-in-progress-bg text-ktr-project-in-progress",
  Revisi: "bg-ktr-project-revision-bg text-ktr-project-revision",
  Selesai: "bg-ktr-project-finished-bg text-ktr-project-finished",
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
    <main className={cn("relative min-h-dvh w-full bg-background pt-[14px] text-foreground", showBottomNav ? "pb-[112px]" : "pb-8")}>
      <div className="mx-auto min-w-0 w-full max-w-[430px] px-4">
        {!showBottomNav ? <AppBackButton href={backHref} className="mb-6" /> : null}
        <header className="mb-5 flex min-w-0 items-start justify-between gap-3">
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

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("relative min-w-0 overflow-hidden rounded-[18px] border border-ktr-border-light bg-ktr-surface-card p-[14px]", className)}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">{children}</h2>;
}

function statusIcon() {
  return LabelImportantIcon;
}

function StatusChip({ status }: { status: Status }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium leading-4", statusClass[status])}><Icon icon={statusIcon()} />{status}</span>;
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
      setMessage({ type: "error", text: "Kode join belum diisi." });
      return;
    }
    if (normalized !== "WEB12A") {
      setMessage({ type: "error", text: "Kode tidak ditemukan. Coba cek kembali kode dari gurumu." });
      return;
    }
    setMessage({ type: "success", text: "Kamu berhasil bergabung ke proyek!" });
    toast.success("Kamu berhasil bergabung ke proyek!", { description: "Yuk lanjutkan progressmu bersama kelompok." });
    router.push("/student/projects/detail");
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Gabung Proyek</BottomSheetTitle>
          <BottomSheetDescription>Masukkan kode join dari gurumu untuk mulai bergabung ke proyek kelas.</BottomSheetDescription>
        </BottomSheetHeader>
        <div className="mt-5 space-y-3">
          <label className="block min-w-0">
            <span className="text-[12px] font-medium leading-4 text-ktr-text-primary">Kode Join</span>
            <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder="Contoh: WEB12A" />
          </label>
          <p className="text-[12px] leading-[18px] text-ktr-text-secondary">Kode join biasanya dibagikan oleh guru melalui kelas atau grup belajar.</p>
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
          className={cn("-ml-1.5 size-8 rounded-full border-2 border-white", className)}
          aria-label={`Anggota ${index + 1}`}
        />
      ))}
      {overflowCount > 0 ? (
        <span className="-ml-1.5 flex size-8 items-center justify-center rounded-full border-2 border-white bg-ktr-primary-light text-[12px] font-semibold leading-4 text-ktr-text-primary">
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
    <div ref={panelRef} className="mt-5 space-y-3 rounded-[18px] border border-ktr-border-light bg-ktr-surface-card p-3">
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
  const searchPanelRef = React.useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProjects = projects.filter((project) => {
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
    <main className="relative min-h-dvh w-full bg-ktr-surface-bg-app pb-[112px] pt-[14px] text-foreground">
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

      <div className="pointer-events-none fixed inset-x-0 bottom-[96px] z-40 mx-auto w-full max-w-[430px] px-4">
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
export function ProjectDetailPage({ projectStatus = "in_progress" }: { projectStatus?: ProjectLifecycleStatus } = {}) {
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
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ktr-info-bg px-2.5 py-1 text-[12px] font-medium leading-4 text-ktr-info"><Icon icon={statusIcon()} />Menunggu Review Guru</span>
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
              <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Lihat jejak diskusi, progress, dan lampiran.</p>
            </Card>
          </Link>
        </div>

        <Card className="mt-4 bg-ktr-secondary-bg-info-card">
          <p className="text-[13px] leading-5 text-ktr-text-secondary">Aksi buat diskusi, upload progress, dan submit proyek dinonaktifkan sampai guru memberi hasil tinjauan.</p>
        </Card>
      </ScreenShell>
    );
  }

  const discussionActions = [
    { title: "Buat Sesi Diskusi Baru", description: "Mulai pembahasan untuk ide, kendala, revisi, atau progress.", href: "/student/discussions/new", icon: BubbleChatIcon },
    { title: "Riwayat Sesi Diskusi", description: "Lihat semua sesi dan catatan diskusi kelompok.", href: "/student/activities", icon: Clock01Icon },
    { title: "Diskusi Sedang Berjalan", description: "Masuk ke chat dan telepon kelompok yang aktif.", href: "/student/discussions/current", icon: MessageDone02Icon },
  ] as const;

  const contributionActions = [
    { title: "Input Progress", description: "Unggah progress dan bukti kerja terbaru.", href: "/student/progress/new", icon: Upload04Icon },
    { title: "Peer Assessment", description: "Berikan umpan balik anggota kelompok.", href: "/student/peer-assessment", icon: UserGroupIcon },
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
        <Link href="/student/projects/submit">Submit Proyek</Link>
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

function JoinGroupPreview({ state }: { state: "idle" | "loading" | "found" | "not-found" }) {
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
            <span key={className} className={cn("-ml-1.5 size-6 rounded-full border-2 border-white", className)} />
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
          <JoinGroupPreview state={lookupState} />
        </div>
        <SheetFooterActions primaryLabel="Gabung Kelompok" onPrimary={submit} />
      </BottomSheetContent>
    </BottomSheet>
  );
}
const discussionTopics = ["Ide Proyek", "Progress", "Kendala", "Revisi"];

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
          <p className="text-[12px] font-normal leading-[18px] text-ktr-text-tertiary">Setelah diskusi diakhiri, anggota akan mengisi peer assessment untuk mencatat proses kontribusi sesi ini.</p>
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
    <main className="min-h-dvh w-full bg-ktr-surface-bg-app px-4 pb-8 pt-[32px] text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <AppBackButton href="/student/projects" className="mb-6" />

        <section className="mb-10">
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
};

type ProgressItem = {
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
  { title: "Pembahasan Konsep Landing Page", status: "Sedang Berjalan", statusClass: "text-ktr-project-in-progress", messages: "4 pesan", meta: "Terakhir 10 menit lalu", primary: true },
  { title: "Review Konten Produk", status: "Menunggu Peer Assessment", statusClass: "text-ktr-project-revision", messages: "2 pesan", meta: "3 dari 4 anggota sudah memberi umpan balik" },
  { title: "Revisi Tampilan Kontak", status: "Selesai", statusClass: "text-ktr-project-finished", messages: "2 pesan", meta: "Semua anggota sudah memberi umpan balik" },
];

const groupProgress: ProgressItem[] = [
  { text: "Membuat draft tampilan awal untuk bagian hero landing page.", author: "Bima A.", time: "dikirim 5 menit lalu", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { text: "Menambahkan teks awal untuk bagian produk unggulan UMKM.", author: "Raka M.", time: "dikirim 1 jam lalu", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]" },
  { text: "Mengunggah bukti pengerjaan layout halaman kontak.", author: "Nadia S.", time: "dikirim kemarin", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
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
            <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-ktr-primary bg-ktr-success-bg px-2.5 py-1 text-[12px] font-medium leading-[18px] text-ktr-primary">
              <Icon icon={Calendar03Icon} />
              25 Juni 2026
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-ktr-info bg-ktr-info-bg px-2.5 py-1 text-[12px] font-medium leading-[18px] text-ktr-info">
              <Icon icon={statusIcon()} />
              Belum Dimulai
            </span>
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
                    <Icon icon={FileCheckIcon} className="shrink-0 text-ktr-primary" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium leading-5 text-ktr-text-primary">{file.name}</span>
                      <span className="block text-[11px] leading-4 text-ktr-text-tertiary">{file.size}</span>
                    </span>
                  </span>
                  <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-ktr-primary transition-colors hover:bg-ktr-primary-soft" onClick={() => toast.info("File diunduh", { description: file.name })}>
                    <Icon icon={Download04Icon} />
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

function ProjectHeaderBlock() {
  return (
    <section className="mb-10">
      <div className="mb-8 flex items-center justify-between">
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
        <h1 className="min-w-0 text-[20px] font-semibold leading-[28px] text-ktr-text-primary">Landing Page UMKM</h1>
        <p className="shrink-0 pt-0.5 text-right text-[14px] leading-[22px] text-ktr-text-secondary">XI - Desain Web</p>
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
  );
}

function MemberAvatar({ member, size = "size-[44px]" }: { member: Pick<GroupMember, "initials" | "avatarClass">; size?: string }) {
  return <span className={cn("flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-white", size, member.avatarClass)}>{member.initials}</span>;
}

function MemberRow({ member }: { member: GroupMember }) {
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
      <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" />
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
  if (item.primary) {
    return (
      <Link href="/student/discussions/current" className={cn("block rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3 transition-colors hover:border-ktr-primary/40", item.status === "Sedang Berjalan" ? "active-discussion-card" : "")}>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h3 className="min-w-0 text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.title}</h3>
          <span className={cn("shrink-0 pt-0.5 text-[12px] font-medium leading-[18px]", item.statusClass)}>{item.status}</span>
        </div>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] leading-[18px] text-ktr-text-tertiary">
          <span className="flex items-center gap-1.5"><Icon icon={BubbleChatIcon} />{item.messages}</span>
          <span className="text-ktr-text-disabled">&bull;</span>
          <span>{item.meta}</span>
        </div>
      </Link>
    );
  }

  return (
    <>
      <div>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h3 className="min-w-0 text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.title}</h3>
          <span className={cn("shrink-0 pt-0.5 text-right text-[12px] font-medium leading-[18px]", item.statusClass)}>{item.status}</span>
        </div>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] leading-[18px] text-ktr-text-tertiary">
          <span className="flex items-center gap-1.5"><Icon icon={BubbleChatIcon} />{item.messages}</span>
          <span className="text-ktr-text-disabled">&bull;</span>
          <span>{item.meta}</span>
        </div>
      </div>
      <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" />
    </>
  );
}

function ProgressRow({ item }: { item: ProgressItem }) {
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
      <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" />
    </>
  );
}

export function GroupDetailPage({ role = "member" }: { role?: DiscussionRole } = {}) {
  return (
    <main className="min-h-dvh w-full bg-background px-4 pb-10 pt-[32px] text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <ProjectHeaderBlock />

        <SectionTitle>Anggota Kelompok</SectionTitle>
        <section className="mb-8 rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3">
          <div className="space-y-3">
            {groupMembers.map((member) => <MemberRow key={member.name} member={member} />)}
            {role === "leader" ? (
              <InviteMemberSheet
                trigger={
                  <button type="button" className="flex h-[46px] w-full items-center gap-3 px-0 text-left text-[14px] font-medium leading-[22px] text-ktr-primary">
                    <Icon icon={Add01Icon} className="size-6" />
                    Tambah Anggota
                  </button>
                }
              />
            ) : null}
          </div>
        </section>

        <SectionTitle>Diskusi Kelompok</SectionTitle>
        <div className="mb-8 space-y-4">
          <DiscussionCard item={groupDiscussions[0]} />
          <section className="rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3">
            <div className="space-y-3">
              {groupDiscussions.slice(1).map((item) => <DiscussionCard key={item.title} item={item} />)}
              {role === "leader" ? (
                <CreateDiscussionSheet trigger={
                  <button type="button" className="flex h-[46px] w-full items-center gap-3 px-0 text-left text-[14px] font-medium leading-[22px] text-ktr-primary">
                    <Icon icon={Add01Icon} className="size-6" />
                    Buat Diskusi Baru
                  </button>
                } />
              ) : null}
            </div>
          </section>
        </div>

        <SectionTitle>Progress Kelompok</SectionTitle>
        <section className="rounded-[20px] border border-ktr-border-light bg-ktr-surface-card p-3">
          <div className="space-y-3">
            {groupProgress.map((item) => <ProgressRow key={item.text} item={item} />)}
            <Link href="/student/progress/new" className="flex h-[46px] items-center gap-3 px-0 text-[14px] font-medium leading-[22px] text-ktr-primary">
              <Icon icon={Add01Icon} className="size-6" />
              Tambah Progres
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
export function NewDiscussionPage({ role = "member" }: { role?: DiscussionRole } = {}) {
  if (role !== "leader") {
    return <RoleRestrictedState title="Buat Diskusi Baru" description="Hanya ketua kelompok yang dapat membuat sesi diskusi baru." backHref="/student/group" />;
  }

  return <ScreenShell title="Buat Diskusi Baru" subtitle="Mulai ruang diskusi untuk membahas ide, progress, kendala, atau revisi kelompokmu."><Card className="space-y-4"><Field label="Judul Diskusi" placeholder="Contoh: Pembahasan Konsep Landing Page" /><div><p className="mb-2 text-[12px] font-medium leading-4 text-ktr-text-primary">Topik Diskusi</p><Segments items={["Ide Proyek", "Progress", "Kendala", "Revisi", "Lainnya"]} /></div><Field label="Catatan Awal" placeholder="Tulis hal pertama yang ingin dibahas bersama kelompok." as="textarea" /><PrimaryButton href="/student/discussions/current" className="w-full" onClick={() => toast.success("Diskusi dibuat", { description: "Ruang diskusi baru siap dipakai kelompok." })}>Buat Diskusi</PrimaryButton></Card></ScreenShell>;
}

type DiscussionRole = "leader" | "member";
type DiscussionStatus = "ongoing" | "waiting_peer_assessment" | "finished";
type ProjectLifecycleStatus = "in_progress" | "ready_to_submit" | "submitted" | "revision" | "finished";

const sessionParticipants = [
  { initials: "AP", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
  { initials: "BA", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { initials: "NS", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
  { initials: "RM", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#fb7185)]" },
];

const sessionProgress = [
  { author: "Bima A.", title: "Desain hero section", meta: "1 lampiran • 09.24", initials: "BA", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9)]" },
  { author: "Raka M.", title: "Draft konten produk", meta: "1 link • 09.36", initials: "RM", avatarClass: "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]" },
  { author: "Nadia S.", title: "Layout halaman kontak", meta: "1 lampiran • 09.45", initials: "NS", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" },
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
    return <span className="flex items-center gap-3 text-[14px] font-normal leading-[22px] text-ktr-project-revision"><span className="size-1.5 rounded-full bg-ktr-project-revision" />Menunggu Peer Assessment</span>;
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
          <Button asChild className="h-11 rounded-[12px] text-[14px] font-medium"><Link href="/student/peer-assessment">Isi Peer Assessment</Link></Button>
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
          <p className="mt-1 text-[13px] font-normal leading-5 text-ktr-text-secondary">Semua anggota sudah mengisi peer assessment. Ringkasan sesi ini sudah tersimpan sebagai jejak kontribusi kelompok.</p>
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
      <div className="mt-[14px] rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] rounded-tl-[4px] bg-ktr-primary p-[14px] text-white">
        <div className="flex items-center gap-2">
          <MemberAvatar member={{ initials: "AP", avatarClass: "bg-[linear-gradient(135deg,#57c186,#2f536f)]" }} size="size-8" />
          <p className="text-[16px] font-semibold leading-[24px]">Alya P.</p>
        </div>
        <p className="mt-5 line-clamp-2 text-[14px] font-normal leading-[22px]">Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progress yang sudah dikerjakan.</p>
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

function SessionProgressRow({ item }: { item: (typeof sessionProgress)[number] }) {
  return (
    <>
      <div className="flex min-h-10 min-w-0 items-center gap-3">
        <MemberAvatar member={item} size="size-8" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.title}</p>
          <p className="text-[12px] leading-[18px] text-ktr-text-secondary">{item.author} • {item.meta}</p>
        </div>
      </div>
      <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" />
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
              <span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Submit Proyek</span>
              <span className="block text-[13px] font-normal leading-5 text-ktr-text-secondary">Kirim hasil akhir proyek jika kelompok sudah sepakat dan semua progress penting sudah tercatat.</span>
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
            Setelah diskusi diakhiri, anggota tidak bisa mengirim pesan baru di sesi ini dan akan diminta mengisi peer assessment.
          </BottomSheetDescription>
        </BottomSheetHeader>
        <p className="mt-5 rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] font-normal leading-5 text-ktr-text-secondary">
          Pastikan pembahasan utama sudah selesai dan progress penting sudah dikirim.
        </p>
        <BottomSheetFooter>
          <BottomSheetClose asChild>
            <QuietButton className="w-full rounded-[12px]">Batal</QuietButton>
          </BottomSheetClose>
          <BottomSheetClose asChild>
            <Link href="/student/discussions/waiting" className="inline-flex h-11 w-full items-center justify-center rounded-[12px] bg-ktr-primary px-4 text-[14px] font-medium text-ktr-text-white transition-colors hover:bg-ktr-primary-hover" onClick={() => toast.success("Diskusi diakhiri", { description: "Anggota sekarang dapat mengisi peer assessment." })}>
              Ya, Akhiri Diskusi
            </Link>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

// ─── Chat Types & Data ────────────────────────────────────────────────────

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
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progress yang sudah dikerjakan.",
    time: "11.21",
  },
  {
    id: "m2",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progress yang sudah dikerjakan.",
    time: "11.21",
  },
  {
    id: "m3",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progress yang sudah dikerjakan.",
    time: "11.21",
    isSelf: true,
  },
  { id: "div1", author: "", initials: "", avatarClass: "", content: "1 pesan belum dibaca", time: "", isUnreadDivider: true },
  {
    id: "m4",
    author: "Alya P.",
    initials: "AP",
    avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
    content: "Kita mulai dari konsep hero section dulu ya. Nanti setiap anggota bisa kirim progress yang sudah dikerjakan.",
    time: "11.21",
  },
];

const callParticipantsList = [
  { initials: "AP", name: "Alya P.", avatarClass: "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]", speaking: true },
  { initials: "BA", name: "Bima A.", avatarClass: "bg-[linear-gradient(135deg,#233046,#5b8fb9_48%,#f5a623)]", speaking: false },
  { initials: "RM", name: "Raka M.", avatarClass: "bg-[linear-gradient(135deg,#f7d9c4,#f5a623_42%,#5b8fb9)]", speaking: false },
  { initials: "NS", name: "Nadia S.", avatarClass: "bg-[linear-gradient(135deg,#d8ff00,#57c186_48%,#2f536f)]", speaking: false },
];

function formatCallTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Call UI (Zoom-style) ─────────────────────────────────────────────────

function CallOverlay({ elapsed, onHangUp }: { elapsed: number; onHangUp: () => void }) {
  const [muted, setMuted] = React.useState(false);
  const [cameraOn, setCameraOn] = React.useState(false);
  const [speakerOn, setSpeakerOn] = React.useState(true);

  return (
    <div
      className="fixed inset-0 z-50 mx-auto flex w-full flex-col bg-[#1a2026]"
      style={{ maxWidth: "430px", left: "50%", transform: "translateX(-50%)" }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between px-5 pt-14 pb-6">
        <div>
          <p className="text-[12px] leading-4 text-white/50">Panggilan Kelompok</p>
          <p className="mt-1 text-[17px] font-semibold leading-[26px] text-white">Pembahasan Konsep Landing Page</p>
        </div>
        <p className="shrink-0 pt-1 text-[14px] font-medium tabular-nums text-white/60">{formatCallTime(elapsed)}</p>
      </div>

      {/* Participant grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 px-4">
        {callParticipantsList.map((p) => (
          <div key={p.initials} className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-[#252d34] py-8">
            <MemberAvatar member={p} size="size-16" />
            <div className="text-center">
              <p className="text-[14px] font-medium leading-[22px] text-white">{p.name}</p>
              {p.speaking ? (
                <p className="mt-0.5 text-[11px] leading-4 text-ktr-primary">Berbicara...</p>
              ) : muted && p.initials === "AP" ? (
                <p className="mt-0.5 text-[11px] leading-4 text-white/40">Dibisukan</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-end justify-around px-6 pb-16 pt-8">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className={cn(
              "flex size-[60px] items-center justify-center rounded-full transition-colors",
              muted ? "bg-white/25" : "bg-white/[0.12]"
            )}
          >
            <HugeiconsIcon icon={muted ? MicOff01Icon : Mic01Icon} size={22} strokeWidth={1.8} color="white" aria-hidden="true" />
          </button>
          <span className="text-[11px] leading-4 text-white/50">{muted ? "Bisu" : "Mikrofon"}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setCameraOn((c) => !c)}
            className={cn(
              "flex size-[60px] items-center justify-center rounded-full transition-colors",
              cameraOn ? "bg-white/25" : "bg-white/[0.12]"
            )}
          >
            <HugeiconsIcon icon={cameraOn ? Camera01Icon : VideoOffIcon} size={22} strokeWidth={1.8} color="white" aria-hidden="true" />
          </button>
          <span className="text-[11px] leading-4 text-white/50">Kamera</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeakerOn((s) => !s)}
            className={cn(
              "flex size-[60px] items-center justify-center rounded-full transition-colors",
              speakerOn ? "bg-white/25" : "bg-white/[0.12]"
            )}
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={22} strokeWidth={1.8} color="white" aria-hidden="true" />
          </button>
          <span className="text-[11px] leading-4 text-white/50">Speaker</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onHangUp}
            className="flex size-[60px] items-center justify-center rounded-full bg-red-500 transition-colors active:bg-red-600"
          >
            <HugeiconsIcon icon={CallEnd01Icon} size={22} strokeWidth={1.8} color="white" aria-hidden="true" />
          </button>
          <span className="text-[11px] leading-4 text-white/50">Tutup</span>
        </div>
      </div>
    </div>
  );
}

function ActiveCallBadge({ elapsed, onJoin }: { elapsed: number; onJoin: () => void }) {
  return (
    <button
      type="button"
      onClick={onJoin}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-ktr-border-light bg-white px-3 py-2 shadow-none"
    >
      {/* Pulse dot */}
      <span className="relative flex size-2.5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#F5A623] opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-[#F5A623]" />
      </span>
      {/* Stacked avatars */}
      <div className="flex shrink-0 items-center pl-1">
        {callParticipantsList.slice(0, 4).map((p) => (
          <span
            key={p.initials}
            className={cn("-ml-2 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold text-white", p.avatarClass)}
          >
            {p.initials}
          </span>
        ))}
      </div>
      <span className="text-[13px] font-semibold tabular-nums text-ktr-text-primary">{formatCallTime(elapsed)}</span>
    </button>
  );
}

export function DiscussionChatPage({
  hasActiveCall = true,
}: {
  hasActiveCall?: boolean;
} = {}) {
  const [callActive, setCallActive] = React.useState(hasActiveCall);
  const [inCall, setInCall] = React.useState(false);
  const [callElapsed, setCallElapsed] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialChatMessages);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!callActive) return;
    const timer = window.setInterval(() => setCallElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [callActive]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (inCall) {
    return (
      <CallOverlay
        elapsed={callElapsed}
        onHangUp={() => {
          setInCall(false);
          setCallActive(false);
        }}
      />
    );
  }

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-background text-ktr-text-primary">
      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col">
        {/* Header Block */}
        <div className="shrink-0 border-b border-ktr-border-light bg-background pb-3">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-[14px] pb-1">
            <AppBackButton href="/student/group" className="px-0" />
            <div className="flex items-center gap-0.5">
              <BottomSheet>
                <BottomSheetTrigger asChild>
                  <button
                    type="button"
                    className="flex size-11 items-center justify-center rounded-[10px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                    aria-label="Project Brief"
                  >
                    <Icon icon={Task01Icon} />
                  </button>
                </BottomSheetTrigger>
                <BottomSheetContent>
                  <BottomSheetHeader className="mb-4">
                    <BottomSheetTitle>Brief Proyek</BottomSheetTitle>
                    <BottomSheetDescription>Detail dan persyaratan tugas yang harus diselesaikan.</BottomSheetDescription>
                  </BottomSheetHeader>
                  
                  <div className="space-y-4 pb-2">
                    <div className="flex gap-4">
                      <div className="flex-1 rounded-[10px] border border-ktr-border-light bg-ktr-surface-soft/50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ktr-text-tertiary">Deadline</p>
                        <p className="mt-1 text-[13px] font-medium text-ktr-text-primary">12 Agustus 2026</p>
                      </div>
                      <div className="flex-1 rounded-[10px] border border-ktr-border-light bg-ktr-surface-soft/50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ktr-text-tertiary">Status</p>
                        <p className="mt-1 text-[13px] font-medium text-[#F5A623]">Sedang Berjalan</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1.5 text-[13px] font-semibold text-ktr-text-primary">Deskripsi Tugas</h4>
                      <p className="text-[13px] leading-relaxed text-ktr-text-secondary">
                        Buatlah landing page yang responsif dengan fokus utama pada hero section dan tombol call-to-action yang menarik. Pastikan mengikuti panduan warna dari brand.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1.5 text-[13px] font-semibold text-ktr-text-primary">Lampiran</h4>
                      <button type="button" className="flex w-full items-center gap-3 rounded-[10px] border border-ktr-border-light p-2.5 text-left transition-colors hover:bg-ktr-surface-soft">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-red-100 text-red-500">
                          <HugeiconsIcon icon={File02Icon} size={18} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-ktr-text-primary">Panduan_Brand_Visual.pdf</p>
                          <p className="text-[11px] text-ktr-text-tertiary">PDF • 2.4 MB</p>
                        </div>
                        <HugeiconsIcon icon={Download04Icon} size={18} className="text-ktr-text-tertiary" />
                      </button>
                    </div>
                  </div>
                </BottomSheetContent>
              </BottomSheet>
              <button
                type="button"
                aria-label="Mulai Panggilan"
                className="flex size-11 items-center justify-center rounded-[10px] text-ktr-text-primary transition-colors hover:bg-ktr-surface-soft"
                onClick={() => {
                  setCallActive(true);
                  setInCall(true);
                }}
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
                    key: "progress",
                    label: "Upload Progress",
                    onSelect: () =>
                      toast.info("Siapkan progressmu", { description: "Lampiran dan catatan akan tercatat di sesi ini." }),
                  },
                  {
                    key: "end",
                    label: "Akhiri Diskusi",
                    tone: "danger" as const,
                    onSelect: () => toast.info("Akhiri diskusi", { description: "Fitur ini akan aktif dalam versi berikutnya." }),
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
          <div className="space-y-4 pb-4 pt-1">
            {messages.map((msg) => {
              if (msg.isUnreadDivider) {
                return (
                  <div key={msg.id} className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-ktr-border-light" />
                    <span className="shrink-0 text-[12px] leading-[18px] text-ktr-text-tertiary">{msg.content}</span>
                    <div className="h-px flex-1 bg-ktr-border-light" />
                  </div>
                );
              }

              if (msg.isSelf) {
                return (
                  <div key={msg.id} className="flex items-start justify-end gap-2.5">
                    <div className="flex flex-col items-end min-w-0">
                      <span className="mb-1 block text-[14px] text-ktr-text-secondary">{msg.author}</span>
                      <div className="inline-block max-w-[100%] rounded-l-[10px] rounded-br-[10px] rounded-tr-[0px] bg-ktr-primary px-3.5 py-2">
                        <p className="text-[14px] font-medium leading-[22px] text-white">{msg.content}</p>
                        <p className="mt-1 text-right text-[12px] text-[#eeeeee]">{msg.time}</p>
                      </div>
                    </div>
                    <MemberAvatar member={msg} size="size-8 mt-[22px] shrink-0" />
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-2.5">
                  <MemberAvatar member={msg} size="size-8 mt-[22px] shrink-0" />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="mb-1 block text-[14px] text-ktr-text-secondary">{msg.author}</span>
                    <div className="inline-block max-w-[100%] rounded-r-[10px] rounded-bl-[10px] rounded-tl-[0px] bg-[#f9f9f9] px-3.5 py-2">
                      <p className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">{msg.content}</p>
                      <p className="mt-1 text-right text-[12px] text-[#879196]">{msg.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="shrink-0 bg-background px-3.5 py-3">
          <div className="flex flex-col gap-3 rounded-[14px] bg-white p-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border border-black/5">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="w-full bg-transparent px-1 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary"
              placeholder="Tuliskan pesan..."
            />
            <div className="flex items-center justify-between pl-1 pr-0.5">
              <div className="flex items-center gap-4 text-ktr-text-primary">
                <button type="button" aria-label="Kamera" className="text-[#879196] hover:text-ktr-primary transition-colors" onClick={() => toast.info("Kamera", { description: "Fitur kamera akan segera hadir" })}>
                  <HugeiconsIcon icon={CameraAdd01Icon} size={22} strokeWidth={1.8} color="currentColor" />
                </button>
                <button type="button" aria-label="Galeri" className="text-[#879196] hover:text-ktr-primary transition-colors" onClick={() => toast.info("Galeri", { description: "Pilih foto dari galeri (segera hadir)" })}>
                  <HugeiconsIcon icon={Album02Icon} size={22} strokeWidth={1.8} color="currentColor" />
                </button>
                <button type="button" aria-label="Dokumen" className="text-[#879196] hover:text-ktr-primary transition-colors" onClick={() => toast.info("Dokumen", { description: "Fitur unggah dokumen (segera hadir)" })}>
                  <HugeiconsIcon icon={File02Icon} size={22} strokeWidth={1.8} color="currentColor" />
                </button>
              </div>
              <button
                type="button"
                onClick={sendMessage}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-[6px] transition-colors",
                  inputValue.trim()
                    ? "bg-ktr-primary text-white"
                    : "bg-[#f9f9f9] text-[#879196]"
                )}
              >
                <HugeiconsIcon icon={SentIcon} size={20} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function DiscussionDetailPage({ role = "member", discussionStatus = "ongoing", projectReady = false, projectReadyToSubmit }: { role?: DiscussionRole; discussionStatus?: DiscussionStatus; projectReady?: boolean; projectReadyToSubmit?: boolean } = {}) {
  const showOngoingActions = discussionStatus === "ongoing";
  const showWaitingActions = discussionStatus === "waiting_peer_assessment";
  const isFinished = discussionStatus === "finished";
  const canSubmitProject = projectReadyToSubmit ?? projectReady;

  return (
    <main className="min-h-dvh w-full bg-background px-4 pb-10 pt-[32px] text-ktr-text-primary">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="mb-8 flex items-center justify-between gap-3">
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
              {role === "leader" ? <EndDiscussionSheet trigger={<SessionActionCard iconSrc="/icons/akhiri-diskusi.svg" label="Akhiri Diskusi" />} /> : <SessionActionCard iconSrc="/icons/akhiri-diskusi.svg" label="Upload Progress" href="/student/progress/new" onClick={() => toast.info("Siapkan progressmu", { description: "Lengkapi catatan dan bukti kerja di halaman upload." })} />}
            </div>
          ) : null}

          {showWaitingActions ? (
            <Card className="bg-ktr-secondary-bg-info-card">
              <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Menunggu anggota lain</p>
              <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">3 dari 6 anggota sudah mengisi umpan balik. Chat sesi ini tetap bisa dibaca, tetapi tidak menerima pesan baru.</p>
            </Card>
          ) : null}


          <section>
            <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Progress Sesi Ini</h2>
            <div className="rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3">
              <div className="space-y-3">
                {sessionProgress.map((item) => <SessionProgressRow key={item.title} item={item} />)}
                {discussionStatus === "ongoing" ? (
                  <Link href="/student/progress/new" className="flex h-8 items-center justify-end gap-2 text-[14px] font-medium leading-[22px] text-ktr-primary" onClick={() => toast.info("Siapkan progressmu", { description: "Lampiran dan catatan akan tercatat di sesi ini." })}>
                    <Icon icon={Add01Icon} className="size-5" />
                    Upload Progres
                  </Link>
                ) : null}
              </div>
            </div>
          </section>

          <p className="-mt-3 text-[12px] font-normal leading-[19px] text-ktr-text-tertiary">Progress dan lampiran di sesi ini dapat dilihat oleh anggota kelompok dan akan tercatat sebagai jejak kontribusi.</p>

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
export function ProgressInputPage() {
  return <ScreenShell title="Upload Progress" subtitle="Ceritakan progress yang kamu kerjakan setelah diskusi. Progress ini akan membantu kontribusimu terlihat lebih jelas."><Card className="space-y-4"><Field label="Progress yang Dikerjakan" placeholder="Contoh: Saya membuat draft layout hero section dan menyesuaikan warna utama." as="textarea" /><div className="relative overflow-hidden rounded-[20px] border border-dashed border-ktr-border-input bg-ktr-primary-bg-form p-4 text-center"><Icon icon={FileCheckIcon} className="mx-auto text-ktr-primary" /><p className="mt-2 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Tambahkan Bukti Kerja</p><p className="text-[13px] leading-5 text-ktr-text-secondary">Upload foto, file, atau link jika ada.</p></div><Field label="Link Bukti Kerja" placeholder="Tempel link Figma, Drive, atau dokumen" /><div><p className="mb-2 text-[12px] font-medium leading-4 text-ktr-text-primary">Status Progress</p><Segments items={["Sedang Dikerjakan", "Selesai", "Terkendala"]} /></div><Button className="h-11 w-full rounded-[10px]" onClick={() => toast.success("Progress berhasil diunggah!", { description: "Keren, kontribusimu sudah tercatat." })}>Kirim Progress</Button></Card></ScreenShell>;
}

const assessmentMembers = groupMembers.map((member) => ({
  name: member.name === "Alya Putri Ramadhani" ? "Alya P." : member.name === "Bima Aditya Pratama" ? "Bima A." : member.name === "Raka Maulana Yusuf" ? "Raka M." : "Nadia S.",
  role: member.role,
  initials: member.initials,
  avatarClass: member.avatarClass,
}));

function AssessmentOptionGroup({ title, items, value, onChange }: { title: string; items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{title}</p>
      <div className="flex min-w-0 flex-wrap gap-2">
        {items.map((item) => {
          const selected = value === item;
          return (
            <button key={item} type="button" className={cn("rounded-[10px] border px-3 py-2 text-[12px] font-medium leading-[18px] transition-colors", selected ? "border-ktr-primary bg-ktr-primary-soft text-ktr-primary" : "border-ktr-border-light bg-ktr-surface-card text-ktr-text-secondary")} onClick={() => onChange(item)}>
              {item}
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
  const [activity, setActivity] = React.useState("");
  const [contribution, setContribution] = React.useState("");
  const [teamwork, setTeamwork] = React.useState("");
  const assessableMembers = assessmentMembers.filter((item) => item.initials !== currentUserInitials);

  function submit() {
    if (!member || !activity || !contribution || !teamwork) {
      toast.warning("Lengkapi pilihan umpan balik terlebih dahulu.");
      return;
    }

    toast.success("Umpan balik berhasil dikirim.");
    router.push(allMembersCompleted ? "/student/discussions/finished" : "/student/discussions/waiting");
  }

  return (
    <ScreenShell title="Umpan Balik Sesi" subtitle="Berikan umpan balik berdasarkan diskusi dan progress pada sesi ini. Isi dengan jujur dan tetap menghargai temanmu." backHref="/student/discussions/waiting">
      <Card className="mb-4 space-y-1 bg-ktr-primary-bg-form">
        <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Pembahasan Konsep Landing Page</h2>
        <p className="text-[13px] leading-5 text-ktr-text-secondary">Kelompok 4</p>
        <p className="text-[13px] leading-5 text-ktr-text-secondary">Selesai didiskusikan hari ini, 10.15</p>
      </Card>

      <Card className="space-y-5">
        <div>
          <p className="mb-3 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Pilih Anggota</p>
          <div className="space-y-2">
            {assessableMembers.map((item) => {
              const selected = member === item.name;
              return (
                <button key={item.name} type="button" className={cn("flex h-[58px] w-full items-center gap-3 rounded-[12px] border px-3 text-left transition-colors", selected ? "border-ktr-primary bg-ktr-success-bg" : "border-ktr-border-light bg-ktr-surface-card")} onClick={() => setMember(item.name)}>
                  <MemberAvatar member={item} size="size-9" />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-normal leading-[22px] text-ktr-text-primary">{item.name}</span>
                    <span className="block text-[12px] leading-[18px] text-ktr-text-secondary">{item.role}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AssessmentOptionGroup title="Keaktifan Diskusi" items={["Belum Terlihat", "Cukup Terlihat", "Sangat Terlihat"]} value={activity} onChange={setActivity} />
        <AssessmentOptionGroup title="Kontribusi Progress" items={["Belum Terlihat", "Cukup Terlihat", "Sangat Terlihat"]} value={contribution} onChange={setContribution} />
        <AssessmentOptionGroup title="Kerja Sama" items={["Perlu Dibantu", "Cukup Baik", "Sangat Baik"]} value={teamwork} onChange={setTeamwork} />

        <Field label="Catatan Tambahan" placeholder="Tulis masukan singkat dengan sopan." as="textarea" />
        <p className="rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] leading-5 text-ktr-text-secondary">Umpan balik ini digunakan sebagai data pendukung. Guru tetap meninjau keputusan akhir.</p>
        <Button className="h-11 w-full rounded-[12px] text-[14px] font-medium" onClick={submit}>Kirim Umpan Balik</Button>
      </Card>
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

export function SessionSummaryPage({ role = "member", projectReadyToSubmit = false }: { role?: DiscussionRole; projectReadyToSubmit?: boolean } = {}) {
  const progressItems = [
    ["Bima A.", "Desain hero section", "1 lampiran", "09.24", "bg-[linear-gradient(135deg,#233046,#5b8fb9)]"],
    ["Raka M.", "Draft konten produk", "1 link", "09.36", "bg-[linear-gradient(135deg,#f5a623,#5b8fb9)]"],
    ["Nadia S.", "Layout halaman kontak", "1 lampiran", "09.45", "bg-[linear-gradient(135deg,#57c186,#2f536f)]"],
  ];

  return (
    <ScreenShell title="Ringkasan Sesi" subtitle="Lihat rangkuman diskusi, progress, dan lampiran yang tercatat pada sesi ini." backHref="/student/discussions/finished">
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

      <div className="mb-5 grid grid-cols-2 gap-2">
        <SummaryStat value="12" label="pesan diskusi" />
        <SummaryStat value="3" label="progress terkirim" />
        <SummaryStat value="4" label="lampiran ditambahkan" />
        <SummaryStat value="6" label="peer assessment selesai" />
      </div>

      <SectionTitle>Progress Sesi Ini</SectionTitle>
      <Card className="mb-5 p-3">
        <div className="space-y-3">
          {progressItems.map(([name, title, file, time, avatar]) => (
            <div key={title} className="space-y-3">
              <div className="flex min-w-0 items-center gap-3">
                <MemberAvatar member={{ initials: name.slice(0, 1), avatarClass: avatar }} size="size-8" />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-normal leading-[22px] text-ktr-text-primary">{title}</p>
                  <p className="text-[12px] leading-[18px] text-ktr-text-secondary">{name} &bull; {file} &bull; {time}</p>
                </div>
              </div>
              <div className="h-[0.6px] w-full bg-ktr-border-light" aria-hidden="true" />
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>Peer Assessment</SectionTitle>
      <Card className="mb-5 bg-ktr-primary-bg-form">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Semua anggota sudah mengisi umpan balik untuk sesi ini.</p>
        <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Isi peer assessment tidak ditampilkan ke anggota lain.</p>
      </Card>

      <SectionTitle>Langkah Berikutnya</SectionTitle>
      <div className="space-y-2">
        {role === "leader" ? (
          <>
            <CreateDiscussionSheet trigger={<button type="button" className="block w-full"><Card className="flex items-center justify-between gap-3 p-3 text-left"><span><span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Buat Diskusi Baru</span><span className="block text-[13px] leading-5 text-ktr-text-secondary">Mulai sesi baru jika masih ada hal yang perlu dibahas.</span></span><Icon icon={ArrowRight02Icon} className="text-ktr-primary" /></Card></button>} />
            {projectReadyToSubmit ? <Link href="/student/projects/landing-page-umkm/submit" className="block"><Card className="flex items-center justify-between gap-3 p-3"><span><span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Submit Proyek</span><span className="block text-[13px] leading-5 text-ktr-text-secondary">Kirim hasil akhir proyek untuk ditinjau guru.</span></span><Icon icon={ArrowRight02Icon} className="text-ktr-primary" /></Card></Link> : null}
          </>
        ) : (
          <Card className="bg-ktr-secondary-bg-info-card p-3"><p className="text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Tunggu ketua kelompok memulai diskusi baru atau mengirim hasil akhir proyek.</p></Card>
        )}
      </div>
    </ScreenShell>
  );
}

function SubmitProjectConfirmSheet({ open, onOpenChange, result }: { open: boolean; onOpenChange: (open: boolean) => void; result: string }) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-semibold leading-[28px]">Submit Proyek?</BottomSheetTitle>
          <BottomSheetDescription>Setelah proyek dikirim, anggota tidak bisa mengubah hasil akhir kecuali guru memberikan revisi.</BottomSheetDescription>
        </BottomSheetHeader>
        <p className="mt-5 rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] leading-5 text-ktr-text-secondary">Pastikan link atau file hasil akhir sudah benar dan semua anggota sudah menyepakati pengiriman proyek.</p>
        <div className="mt-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card p-3 text-[13px] leading-5 text-ktr-text-secondary">{result}</div>
        <BottomSheetFooter>
          <BottomSheetClose asChild><QuietButton className="w-full rounded-[16px]">Cek Lagi</QuietButton></BottomSheetClose>
          <BottomSheetClose asChild>
            <Link href="/student/projects/submit/success" className="inline-flex h-11 w-full items-center justify-center rounded-[16px] bg-ktr-primary px-4 text-[14px] font-medium text-ktr-text-white" onClick={() => toast.success("Proyek dikirim", { description: "Status proyek berubah menjadi menunggu review guru." })}>Ya, Submit Proyek</Link>
          </BottomSheetClose>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

export function SubmitProjectPage({ role = "member", projectReadyToSubmit = false }: { role?: DiscussionRole; projectReadyToSubmit?: boolean } = {}) {
  const checklistItems = [
    "Semua sesi diskusi utama sudah selesai",
    "Progress anggota sudah tercatat",
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
    return <RoleRestrictedState title="Submit Proyek" description="Hanya ketua kelompok yang dapat mengirim hasil akhir proyek." backHref="/student/discussions/summary" />;
  }

  if (!projectReadyToSubmit) {
    return <RoleRestrictedState title="Submit Proyek" description="Proyek belum siap dikirim. Pastikan sesi terakhir sudah selesai dan peer assessment lengkap." backHref="/student/discussions/summary" />;
  }

  return (
    <ScreenShell title="Submit Proyek" subtitle="Pastikan hasil proyek dan kontribusi kelompok sudah tercatat sebelum dikirim ke guru." backHref="/student/discussions/summary">
      <Card className="mb-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Landing Page UMKM</h2>
            <p className="text-[13px] leading-5 text-ktr-text-secondary">XI - Desain Web &bull; Kelompok 4</p>
          </div>
          <span className="shrink-0 rounded-full bg-ktr-primary-soft px-2.5 py-1 text-[12px] font-medium leading-4 text-ktr-primary">Siap Dikirim</span>
        </div>
      </Card>

      <SectionTitle>Checklist Sebelum Submit</SectionTitle>
      <Card className="mb-5 p-3">
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
      <Card className="mb-5 space-y-4">
        <label className="block min-w-0">
          <span className="text-[12px] font-medium leading-4 text-ktr-text-primary">Link atau File Hasil Proyek</span>
          <input value={result} onChange={(event) => setResult(event.target.value)} className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] leading-[22px] outline-none placeholder:text-ktr-text-tertiary focus:border-ktr-border-focus focus:ring-3 focus:ring-ring/20" placeholder="Tempel link Figma, Drive, GitHub, atau dokumen hasil akhir" />
        </label>
        <Field label="Catatan untuk Guru" placeholder="Tulis catatan singkat jika ada hal yang perlu diketahui guru." as="textarea" />
      </Card>

      <Card className="mb-5 bg-ktr-primary-bg-form">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Ringkasan Kontribusi</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[13px] leading-5 text-ktr-text-secondary">
          <span>6 sesi diskusi selesai</span><span>14 progress terkirim</span><span>18 lampiran ditambahkan</span><span>Semua peer assessment selesai</span>
        </div>
        <p className="mt-3 text-[12px] leading-[18px] text-ktr-text-tertiary">Ringkasan ini membantu guru meninjau proses kerja kelompok, bukan menggantikan penilaian guru.</p>
      </Card>

      <Button className="h-11 w-full rounded-[12px] text-[14px] font-medium" onClick={submit}>Submit Proyek</Button>
      <SubmitProjectConfirmSheet open={open} onOpenChange={setOpen} result={result || "Belum ada link"} />
    </ScreenShell>
  );
}
export function SubmitSuccessPage() {
  return (
    <ScreenShell title="Proyek Berhasil Dikirim!" subtitle="Hasil proyek kelompokmu sudah dikirim ke guru untuk ditinjau." backHref="/student/projects">
      <Card className="mb-5 bg-ktr-success-bg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-[16px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={TaskDone02Icon} className="size-7" /></div>
        <p className="mt-4 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Status proyek sekarang:</p>
        <p className="mt-1 text-[18px] font-semibold leading-[28px] text-ktr-primary">Menunggu Review Guru</p>
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
      <Card className="mb-5 bg-ktr-project-revision-bg">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Catatan Guru</p>
        <p className="mt-2 text-[14px] font-normal leading-[22px] text-ktr-text-secondary">Perbaiki bagian tampilan halaman kontak dan tambahkan bukti pengerjaan dari tiap anggota.</p>
      </Card>
      <div className="space-y-2">
        <CreateDiscussionSheet trigger={<Button className="h-11 w-full rounded-[12px] text-[14px] font-medium">Buka Diskusi Revisi</Button>} />
        <Button asChild variant="outline" className="h-11 w-full rounded-[12px] border-transparent bg-ktr-primary-soft text-[14px] font-medium text-ktr-primary"><Link href="/student/progress/new">Upload Progress Revisi</Link></Button>
      </div>
    </ScreenShell>
  );
}
export function ActivitiesPage() {
  const items = [["Bima mengirim progress desain hero section", "Website Profil Sekolah - 5 menit lalu", Upload04Icon], ["Alya memulai diskusi baru", "Pembahasan Konsep Landing Page - 18 menit lalu", BubbleChatIcon], ["Raka mengunggah bukti kerja", "Website Profil Sekolah - 1 jam lalu", FileCheckIcon], ["Nadia memberi umpan balik anggota", "Kelompok 4 - Kemarin", MessageDone02Icon]] as const;
  return <ScreenShell title="Aktivitas" subtitle="Lihat perkembangan diskusi dan progress kelompokmu." showBottomNav action={<Button asChild className="mt-1 h-11 rounded-[10px] px-3 text-[14px]"><Link href="/student/activities/contribution">Ringkasan</Link></Button>}><Segments items={["Semua", "Diskusi", "Progress", "Umpan Balik"]} /><div className="mt-4 space-y-3">{items.map(([title, meta, icon]) => <Card key={title} className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={icon} /></span><div className="min-w-0"><p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{title}</p><p className="text-[13px] leading-5 text-ktr-text-secondary">{meta}</p></div></Card>)}</div></ScreenShell>;
}

export function ContributionSummaryPage() {
  const members = [["Alya", "Ketua Kelompok", "2 diskusi dimulai", "2 progress diunggah"], ["Bima", "Anggota", "3 pesan diskusi", "1 bukti kerja"], ["Raka", "Anggota", "2 pesan diskusi", "1 progress diunggah"], ["Nadia", "Anggota", "1 progress diunggah", "1 umpan balik diberikan"]];
  return <ScreenShell title="Ringkasan Kontribusi" subtitle="Lihat gambaran kontribusi anggota berdasarkan diskusi, progress, bukti kerja, dan umpan balik."><Card className="mb-4 bg-ktr-primary text-ktr-text-white"><p className="text-[14px] font-semibold leading-[22px] text-ktr-accent-lime">Minggu Ini</p><div className="mt-3 grid min-w-0 grid-cols-2 gap-3 text-[13px] leading-5"><span>4 anggota aktif</span><span>6 progress diunggah</span><span>3 bukti kerja ditambahkan</span><span>2 sesi diskusi berlangsung</span></div></Card><div className="space-y-3">{members.map(([name, role, a, b]) => <Card key={name}><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">{name}</h3><p className="text-[13px] leading-5 text-ktr-text-secondary">{role}</p></div><Icon icon={StarIcon} className="text-ktr-warning" /></div><div className="mt-3 flex min-w-0 flex-wrap gap-2"><span className="min-w-0 rounded-full bg-ktr-primary-soft px-3 py-1 text-[12px] text-ktr-primary">{a}</span><span className="min-w-0 rounded-full bg-ktr-secondary-bg-info-card px-3 py-1 text-[12px] text-ktr-secondary">{b}</span></div></Card>)}</div><Card className="mt-4 bg-ktr-secondary-bg-info-card"><p className="text-[13px] leading-5 text-ktr-text-secondary">Ringkasan ini membantu membaca aktivitas kelompok, bukan menentukan nilai akhir.</p></Card></ScreenShell>;
}

export function ProfilePage() {
  return (
    <ScreenShell title="Profil" subtitle="Identitas dan ringkasan aktivitasmu di KontriLab." showBottomNav>
      <Card className="mb-4 flex items-center gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ktr-primary-soft text-ktr-primary"><Icon icon={UserGroupIcon} /></span>
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Akagami</h2>
          <p className="text-[14px] leading-[22px] text-ktr-text-secondary">Student - XII Pemrograman Web</p>
        </div>
      </Card>
      <div className="grid min-w-0 grid-cols-2 gap-2">
        <Card><Icon icon={Flag01Icon} className="mb-3 text-ktr-primary" /><p className="text-[20px] font-semibold leading-[28px] text-ktr-text-primary">1</p><p className="text-[13px] leading-5 text-ktr-text-secondary">Proyek aktif</p></Card>
        <Card><Icon icon={TaskDone02Icon} className="mb-3 text-ktr-primary" /><p className="text-[20px] font-semibold leading-[28px] text-ktr-text-primary">6</p><p className="text-[13px] leading-5 text-ktr-text-secondary">Kontribusi tercatat</p></Card>
      </div>
      <Card className="mt-4">
        <p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Akun MVP</p>
        <p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Data profil ini mengikuti alur IA student dan akan tersambung ke tabel users serta user_profile.</p>
      </Card>
    </ScreenShell>
  );
}









