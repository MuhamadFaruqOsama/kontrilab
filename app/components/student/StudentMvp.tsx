"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddTeamIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  BubbleChatIcon,
  Calendar03Icon,
  CallIcon,
  Clock01Icon,
  Copy01Icon,
  CopyLinkIcon,
  FileCheckIcon,
  FileEditIcon,
  Flag01Icon,
  FilterHorizontalIcon,
  Link05Icon,
  Login03Icon,
  MessageDone02Icon,
  TaskDone02Icon,
  Search01Icon,
  StarIcon,
  Upload04Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import * as React from "react";

import BottomNav from "@/app/components/student/BottomNav";
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
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  }

  return (
    <main className={cn("relative min-h-screen w-full bg-background pt-[14px] text-foreground", showBottomNav ? "pb-[96px]" : "pb-8")}>
      <div className="mx-auto min-w-0 w-full max-w-[430px] px-4">
        {!showBottomNav ? (
          <button
            className="mb-4 flex h-11 items-center gap-2 rounded-[10px] px-1 text-[14px] font-semibold leading-5 text-ktr-text-primary"
            type="button"
            onClick={goBack}
          >
            <Icon icon={ArrowLeft02Icon} />
            Kembali
          </button>
        ) : null}
        <header className="mb-5 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold leading-[36px] text-ktr-text-primary">{title}</h1>
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
  return <section className={cn("relative min-w-0 overflow-hidden rounded-[14px] border border-ktr-border-light bg-ktr-surface-card p-[14px]", className)}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">{children}</h2>;
}

function statusIcon(status: Status) {
  if (status === "Sedang Berjalan") return Flag01Icon;
  if (status === "Revisi") return FileEditIcon;
  if (status === "Selesai") return TaskDone02Icon;
  return Clock01Icon;
}

function StatusChip({ status }: { status: Status }) {
  return <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium leading-4", statusClass[status])}><Icon icon={statusIcon(status)} />{status}</span>;
}

function PrimaryButton({ href, children, className }: { href?: string; children: React.ReactNode; className?: string }) {
  const content = <>{children}<Icon icon={ArrowRight02Icon} /></>;
  if (href) {
    return <Button asChild className={cn("h-11 min-w-0 overflow-hidden rounded-[10px] text-[14px] font-semibold leading-5", className)}><Link href={href}>{content}</Link></Button>;
  }
  return <Button className={cn("h-11 min-w-0 overflow-hidden rounded-[10px] text-[14px] font-semibold leading-5", className)}>{content}</Button>;
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
  }

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="pb-7">
        <BottomSheetHeader>
          <BottomSheetTitle className="text-[18px] font-bold leading-[28px]">Gabung Proyek</BottomSheetTitle>
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
          <BottomSheetClose asChild><QuietButton className="w-full">Batal</QuietButton></BottomSheetClose>
          <Button className="h-11 w-full rounded-[10px]" type="button" onClick={submit}>Gabung Sekarang</Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}

function ProjectDetailSheet({ project, trigger }: { project: Project; trigger: React.ReactNode }) {
  const noGroup = project.title === "Landing Page UMKM";
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
      <BottomSheetContent className="max-h-[92vh] pb-7">
        <BottomSheetHeader className="pr-0">
          <BottomSheetTitle className="text-[18px] font-bold leading-[28px]">Detail Proyek</BottomSheetTitle>
        </BottomSheetHeader>
        <Card className="mt-4 p-3.5">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <h3 className="min-w-0 break-words text-[18px] font-bold leading-[28px] text-ktr-text-primary">{project.title}</h3>
            <p className="shrink-0 text-right text-[14px] font-semibold leading-5 text-ktr-text-primary">{project.className}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[12px] font-medium leading-4">
            <span className="flex items-center gap-1 text-ktr-primary"><Icon icon={Calendar03Icon} />{project.deadline}</span>
            <StatusChip status={project.status} />
          </div>
          <div className="my-4 border-t border-ktr-border-light" />
          <div className="space-y-4 text-[13px] leading-5 text-ktr-text-secondary">
            <div><h4 className="mb-1 text-[14px] font-medium leading-[22px] text-ktr-text-primary">Deskripsi Proyek</h4><p>Buat landing page sederhana untuk membantu UMKM menampilkan profil usaha, produk unggulan, dan kontak pemesanan.</p></div>
            <div><h4 className="mb-1 text-[14px] font-medium leading-[22px] text-ktr-text-primary">Kriteria Kontribusi</h4><p>Kontribusimu akan terlihat dari diskusi, progress yang kamu unggah, bukti kerja, dan umpan balik anggota kelompok.</p></div>
            <div><h4 className="mb-1 text-[14px] font-medium leading-[22px] text-ktr-text-primary">Kelompok</h4><p>{noGroup ? "Kamu belum masuk kelompok." : `${project.group} - ${project.members}`}</p></div>
          </div>
        </Card>
        <BottomSheetFooter className="grid grid-cols-2">
          <BottomSheetClose asChild><QuietButton className="min-w-0 whitespace-normal px-2">Batal</QuietButton></BottomSheetClose>
          <Button asChild className="h-11 min-w-0 whitespace-normal rounded-[10px] px-2 text-center"><Link href={noGroup ? "/student/projects/group/start" : "/student/group"}>{noGroup ? "Buat / Gabung Kelompok" : "Masuk Ruang Kelompok"}</Link></Button>
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

function ProjectMemberStack() {
  return (
    <div className="flex items-center pl-1">
      {avatarStyles.map((className, index) => (
        <span
          key={className}
          className={cn("-ml-1.5 size-8 rounded-full border-2 border-white", className)}
          aria-label={`Anggota ${index + 1}`}
        />
      ))}
      <span className="-ml-1.5 flex size-8 items-center justify-center rounded-full border-2 border-white bg-ktr-primary-light text-[12px] font-semibold leading-4 text-ktr-text-primary">
        +3
      </span>
    </div>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  return (
    <article className="border-b border-ktr-border-light py-5 last:border-b-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className="min-w-0 text-[18px] font-semibold leading-[28px] text-ktr-text-primary">{project.title}</h3>
        <p className="shrink-0 pt-0.5 text-right text-[14px] font-medium leading-[22px] text-ktr-text-primary">{project.className}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[22px]">
        <span className="text-ktr-text-primary">{project.group}</span>
        <span className="flex items-center gap-1 text-ktr-primary"><Icon icon={UserGroupIcon} />{project.members}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium leading-5">
        <span className="flex items-center gap-1 text-ktr-primary"><Icon icon={Calendar03Icon} />{project.deadline}</span>
        <span className={cn("flex items-center gap-1", project.status === "Revisi" ? "text-ktr-project-revision" : project.status === "Selesai" ? "text-ktr-project-finished" : project.status === "Belum Dimulai" ? "text-ktr-project-not-started" : "text-ktr-project-in-progress")}><Icon icon={statusIcon(project.status)} />{project.status}</span>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <ProjectMemberStack />
        <ProjectDetailSheet
          project={project}
          trigger={
            <Button className="h-11 min-w-[158px] rounded-[10px] px-4 text-[14px] font-semibold leading-5">
              Lanjutkan Proyek
              <Icon icon={ArrowRight02Icon} />
            </Button>
          }
        />
      </div>
    </article>
  );
}

function ProjectsSearchDock({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filter: "Semua" | Status;
  onFilterChange: (value: "Semua" | Status) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dockRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && dockRef.current?.contains(target)) {
        return;
      }
      setExpanded(false);
      setFiltersOpen(false);
      inputRef.current?.blur();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function focusSearch() {
    setExpanded(true);
    setFiltersOpen(false);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div ref={dockRef} className="fixed inset-x-0 bottom-[92px] z-40 mx-auto w-full max-w-[430px] px-4">
      {filtersOpen ? (
        <div className="mb-3 rounded-[24px] border border-white/70 bg-white/85 p-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            {projectFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "h-10 rounded-[18px] px-3 text-[13px] font-semibold leading-5 transition-colors",
                  filter === item ? "bg-ktr-primary text-white" : "bg-white/70 text-ktr-text-primary hover:bg-ktr-primary-soft hover:text-ktr-primary"
                )}
                onClick={() => {
                  onFilterChange(item);
                  setFiltersOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-[338px] items-center justify-center gap-2">
        <button
          type="button"
          className={cn(
            "flex h-[52px] min-w-0 items-center gap-2 rounded-[14px] border border-ktr-border-light bg-ktr-surface-card px-4 text-ktr-text-tertiary transition-all",
            expanded ? "w-[278px]" : "w-[186px]"
          )}
          onClick={focusSearch}
          aria-label="Cari proyek"
        >
          <Icon icon={Search01Icon} className="shrink-0 text-ktr-text-secondary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => setExpanded(true)}
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary"
            placeholder="Cari proyek..."
          />
        </button>
        <button
          type="button"
          className={cn(
            "flex size-[52px] shrink-0 items-center justify-center rounded-[14px] border border-ktr-border-light bg-ktr-surface-card text-ktr-text-primary transition-colors",
            filter !== "Semua" || filtersOpen ? "border-ktr-primary text-ktr-primary" : ""
          )}
          onClick={() => {
            setExpanded(false);
            inputRef.current?.blur();
            setFiltersOpen((value) => !value);
          }}
          aria-label="Filter proyek"
        >
          <Icon icon={FilterHorizontalIcon} />
        </button>
      </div>
    </div>
  );
}
export function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"Semua" | Status>("Semua");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleProjects = projects.filter((project) => {
    const matchesQuery = normalizedQuery.length === 0 || `${project.title} ${project.className} ${project.group}`.toLowerCase().includes(normalizedQuery);
    const matchesFilter = filter === "Semua" || project.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <main className="relative flex h-screen min-h-screen w-full flex-col overflow-hidden bg-ktr-surface-bg-app pt-[14px] text-foreground">
      <section className="px-4 pb-5 pt-0">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[24px] font-semibold leading-[32px] text-ktr-text-primary">Proyek Saya</h1>
          <JoinProjectSheet
            trigger={
              <Button className="h-10 rounded-[10px] px-3 text-[14px] font-semibold leading-5">
                Gabung Proyek
                <Icon icon={Login03Icon} />
              </Button>
            }
          />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {projectStats.map((item) => (
            <div key={item.label} className="min-w-0 rounded-[10px] border border-ktr-border-light bg-ktr-surface-card p-3">
              <Image src={item.icon} alt="" width={40} height={40} aria-hidden="true" />
              <div className="mt-4 flex min-w-0 items-end gap-1">
                <p className="text-[20px] font-semibold leading-[28px] text-ktr-text-primary">{item.value}</p>
                <p className="min-w-0 pb-1 text-[12px] leading-4 text-ktr-text-secondary">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-ktr-surface-card px-4">
        <div className="min-h-0 flex-1 overflow-y-auto pb-[190px]">
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, index) => <ProjectListItem key={`${project.title}-${index}`} project={project} />)
          ) : (
            <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden px-8 text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-[16px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={Search01Icon} /></div>
              <h2 className="relative z-10 mt-4 text-[18px] font-semibold leading-[28px] text-ktr-text-primary">Proyek tidak ditemukan</h2>
              <p className="relative z-10 mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Coba kata kunci lain atau ubah filter proyek.</p>
            </div>
          )}
        </div>
      </section>

      <ProjectsSearchDock query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} />
      <BottomNav />
    </main>
  );
}
export function ProjectDetailPage() {
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
            <h2 className="text-[18px] font-bold leading-[28px] text-ktr-text-primary">Website Profil Sekolah</h2>
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
        {discussionActions.map((item) => (
          <Link key={item.title} href={item.href} className="block">
            <Card className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-ktr-primary-soft text-ktr-primary"><Icon icon={item.icon} /></span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{item.title}</span>
                <span className="block text-[13px] leading-5 text-ktr-text-secondary">{item.description}</span>
              </span>
            </Card>
          </Link>
        ))}
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
    </ScreenShell>
  );
}
export function GroupStartPage() {
  return (
    <ScreenShell title="Mulai Bersama Kelompokmu" subtitle="Pilih cara bergabung agar kamu bisa mulai berdiskusi dan mencatat progress proyek.">
      <Card className="mb-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-[18px] font-bold leading-[28px] text-ktr-text-primary">Landing Page UMKM</h2><p className="text-[14px] leading-[22px] text-ktr-text-secondary">XI - Desain Web</p></div><StatusChip status="Belum Dimulai" /></div></Card>
      <div className="space-y-3">
        <Card><Icon icon={UserGroupIcon} className="mb-3 text-ktr-primary" /><h3 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Buat Kelompok Baru</h3><p className="mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Kamu akan menjadi ketua kelompok dan bisa mengundang anggota.</p><PrimaryButton href="/student/group" className="mt-4 w-full">Buat Kelompok</PrimaryButton></Card>
        <Card><Icon icon={Link05Icon} className="mb-3 text-ktr-primary" /><h3 className="text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Gabung Kelompok yang Ada</h3><p className="mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Pilih kelompok yang sudah dibuat oleh temanmu.</p><Button asChild variant="outline" className="mt-4 h-11 w-full rounded-[10px] border-transparent bg-ktr-primary-soft text-[14px] font-semibold leading-5 text-ktr-primary hover:bg-ktr-primary-light hover:text-ktr-primary"><Link href="/student/group">Pilih Kelompok</Link></Button></Card>
      </div>
    </ScreenShell>
  );
}

export function InviteMemberSheet({ trigger }: { trigger: React.ReactNode }) {
  return <BottomSheet><BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger><BottomSheetContent className="pb-7"><BottomSheetHeader><BottomSheetTitle className="text-[18px] font-bold leading-[28px]">Undang Anggota</BottomSheetTitle><BottomSheetDescription>Bagikan kode atau link ini agar temanmu bisa bergabung ke kelompok.</BottomSheetDescription></BottomSheetHeader><div className="mt-5 rounded-[14px] border border-ktr-border-light bg-ktr-primary-bg-form p-4 text-center"><p className="text-[12px] font-medium leading-4 text-ktr-text-secondary">Kode Kelompok</p><p className="mt-1 text-[28px] font-bold leading-[36px] text-ktr-text-primary">KLP4UMKM</p></div><div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2"><Button className="h-11 min-w-0 rounded-[10px] px-2 text-[14px]" onClick={() => toast.success("Kode disalin")}><Icon icon={Copy01Icon} />Salin Kode</Button><QuietButton className="px-2 text-[14px]" onClick={() => toast.success("Link siap dibagikan")}><Icon icon={CopyLinkIcon} />Bagikan Link</QuietButton></div><p className="mt-3 text-[12px] leading-[18px] text-ktr-text-secondary">Pastikan anggota bergabung ke kelompok yang sesuai arahan guru.</p></BottomSheetContent></BottomSheet>;
}

export function GroupDetailPage() {
  const members = [["Alya", "Ketua"], ["Bima", "Anggota"], ["Raka", "Anggota"], ["Nadia", "Anggota"]];
  return (
    <ScreenShell title="Ruang Kelompok" subtitle="Ajak anggota bergabung dan mulai diskusi agar progress kelompok lebih terarah.">
      <Card className="mb-4"><p className="text-[13px] font-medium leading-5 text-ktr-primary">Kamu adalah Ketua Kelompok</p><h2 className="mt-1 text-[18px] font-bold leading-[28px] text-ktr-text-primary">Landing Page UMKM</h2><p className="text-[14px] leading-[22px] text-ktr-text-secondary">Kelompok 4</p></Card>
      <SectionTitle>Anggota Kelompok</SectionTitle>
      <Card className="mb-5"><p className="mb-3 text-[14px] leading-[22px] text-ktr-text-secondary">4 anggota sudah bergabung</p><div className="min-w-0 space-y-2">{members.map(([name, role]) => <div key={name} className="flex min-w-0 items-center justify-between gap-3 rounded-[12px] bg-ktr-primary-light px-3 py-2"><span className="min-w-0 truncate text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{name}</span><span className="shrink-0 text-[12px] leading-[18px] text-ktr-text-secondary">{role}</span></div>)}</div><InviteMemberSheet trigger={<Button className="mt-4 h-11 w-full overflow-hidden rounded-[10px]"><Icon icon={AddTeamIcon} />Undang Anggota</Button>} /></Card>
      <SectionTitle>Diskusi Kelompok</SectionTitle>
      <Card className="mb-5"><p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Belum ada diskusi</p><p className="mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Mulai diskusi pertama untuk membahas ide, kendala, atau rencana pengerjaan proyek.</p><PrimaryButton href="/student/discussions/new" className="mt-4 w-full">Buat Diskusi Baru</PrimaryButton></Card>
      <SectionTitle>Progress Anggota</SectionTitle>
      <Card><p className="text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Belum ada progress yang diunggah</p><p className="mt-1 text-[14px] leading-[22px] text-ktr-text-secondary">Setelah diskusi berjalan, setiap anggota bisa mengunggah progress dan bukti kerja masing-masing.</p></Card>
    </ScreenShell>
  );
}

export function NewDiscussionPage() {
  return <ScreenShell title="Buat Diskusi Baru" subtitle="Mulai ruang diskusi untuk membahas ide, progress, kendala, atau revisi kelompokmu."><Card className="space-y-4"><Field label="Judul Diskusi" placeholder="Contoh: Pembahasan Konsep Landing Page" /><div><p className="mb-2 text-[12px] font-medium leading-4 text-ktr-text-primary">Topik Diskusi</p><Segments items={["Ide Proyek", "Progress", "Kendala", "Revisi", "Lainnya"]} /></div><Field label="Catatan Awal" placeholder="Tulis hal pertama yang ingin dibahas bersama kelompok." as="textarea" /><PrimaryButton href="/student/discussions/current" className="w-full">Buat Diskusi</PrimaryButton></Card></ScreenShell>;
}

export function DiscussionDetailPage() {
  const messages = [["Alya", "Kita mulai dari konsep hero section dulu ya."], ["Bima", "Aku setuju, bisa pakai visual produk UMKM di bagian atas."], ["Raka", "Nanti aku coba bantu susun copy produknya."]];
  return <ScreenShell title="Pembahasan Konsep Landing Page" subtitle="Kelompok 4 - 4 peserta" action={<span className="mt-2"><StatusChip status="Sedang Berjalan" /></span>}><Card className="mb-4 space-y-3">{messages.map(([name, text]) => <div key={name} className="rounded-[12px] bg-ktr-primary-light p-3"><p className="text-[13px] font-semibold leading-5 text-ktr-text-primary">{name}</p><p className="text-[14px] leading-[22px] text-ktr-text-secondary">{text}</p></div>)}</Card><div className="sticky bottom-4 min-w-0 overflow-hidden rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-3"><input className="h-11 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] outline-none" placeholder="Tulis pesan diskusi..." /><div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2"><PrimaryButton href="/student/progress/new" className="w-full"><Icon icon={Upload04Icon} />Upload Progress</PrimaryButton><QuietButton className="w-full" onClick={() => toast("Telepon dimulai", { description: "Bantu kelompokmu tetap terarah." })}><Icon icon={CallIcon} />Mulai Telepon</QuietButton></div></div></ScreenShell>;
}

export function ProgressInputPage() {
  return <ScreenShell title="Upload Progress" subtitle="Ceritakan progress yang kamu kerjakan setelah diskusi. Progress ini akan membantu kontribusimu terlihat lebih jelas."><Card className="space-y-4"><Field label="Progress yang Dikerjakan" placeholder="Contoh: Saya membuat draft layout hero section dan menyesuaikan warna utama." as="textarea" /><div className="relative overflow-hidden rounded-[14px] border border-dashed border-ktr-border-input bg-ktr-primary-bg-form p-4 text-center"><Icon icon={FileCheckIcon} className="mx-auto text-ktr-primary" /><p className="mt-2 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">Tambahkan Bukti Kerja</p><p className="text-[13px] leading-5 text-ktr-text-secondary">Upload foto, file, atau link jika ada.</p></div><Field label="Link Bukti Kerja" placeholder="Tempel link Figma, Drive, atau dokumen" /><div><p className="mb-2 text-[12px] font-medium leading-4 text-ktr-text-primary">Status Progress</p><Segments items={["Sedang Dikerjakan", "Selesai", "Terkendala"]} /></div><Button className="h-11 w-full rounded-[10px]" onClick={() => toast.success("Progress berhasil diunggah!", { description: "Keren, kontribusimu sudah tercatat." })}>Kirim Progress</Button></Card></ScreenShell>;
}

export function PeerAssessmentPage() {
  return <ScreenShell title="Umpan Balik Anggota" subtitle="Bantu guru memahami proses kerja kelompok dari sudut pandangmu. Berikan umpan balik dengan jujur dan tetap menghargai temanmu."><Card className="space-y-5"><label className="block min-w-0"><span className="text-[12px] font-medium leading-4 text-ktr-text-primary">Pilih Anggota</span><select className="mt-2 h-12 w-full min-w-0 rounded-[12px] border border-ktr-border-input bg-ktr-primary-bg-form px-3 text-[14px] outline-none"><option>Bima</option><option>Raka</option><option>Nadia</option></select></label>{["Keaktifan Diskusi", "Kerja Sama", "Progress yang Dibagikan"].map((item) => <div key={item}><p className="mb-2 text-[14px] font-semibold leading-[22px] text-ktr-text-primary">{item}</p><Segments items={["Kurang Terlihat", "Cukup Terlihat", "Sangat Terlihat"]} /></div>)}<Field label="Catatan Tambahan" placeholder="Tulis dengan sopan dan jelas." as="textarea" /><p className="rounded-[12px] bg-ktr-secondary-bg-info-card p-3 text-[13px] leading-5 text-ktr-text-secondary">Umpan balikmu digunakan sebagai data pembanding. Guru tetap meninjau keputusan akhir.</p><Button className="h-11 w-full rounded-[10px]" onClick={() => toast.success("Umpan balik terkirim", { description: "Terima kasih sudah menghargai proses temanmu." })}>Kirim Umpan Balik</Button></Card></ScreenShell>;
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