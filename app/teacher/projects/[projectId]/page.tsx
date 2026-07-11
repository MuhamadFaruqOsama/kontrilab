"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon, CheckListIcon } from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import { getProject, teacherGroups } from "@/components/teacher/mock-data";

export default function ProjectDetail() {
  const params = useParams<{ projectId: string }>();
  const project = getProject(params.projectId);
  const groups = teacherGroups.filter((group) => group.projectId === project.id);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5">
        <Link href="/teacher/projects" className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-[14px] border border-ktr-border-light bg-white px-4 py-2 text-sm font-semibold text-ktr-text-primary transition-colors hover:border-ktr-border-input hover:bg-white active:scale-[0.995]" aria-label="Kembali ke daftar proyek">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={17} />
          Kembali
        </Link>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">{project.className}</span>
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-normal text-ktr-text-primary">{project.name}</h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProjectMeta icon={Calendar03Icon} label="Mulai" value={project.startDate} />
            <ProjectMeta icon={CheckListIcon} label="Deadline Final" value={project.finalDeadline} />
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-ktr-text-primary">Kelompok</h2>
          </div>
          <span className="rounded-full bg-ktr-primary-light px-3 py-1 text-sm font-semibold text-ktr-primary">{groups.length} kelompok</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Link key={group.id} href={`/teacher/projects/${project.id}/groups/${group.id}`} className="group block cursor-pointer rounded-[18px] border border-ktr-border-light bg-white p-5 transition-[border-color,background,transform] hover:border-ktr-border-input hover:bg-white active:scale-[0.998]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-ktr-text-primary">{group.name}</h3>
                  <p className="mt-1 text-sm font-medium text-ktr-text-secondary">{group.members.length} siswa</p>
                </div>
                <StatusBadge status={group.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoPill label="Upload terakhir" value={group.latestUpload} />
                <InfoPill label="Aktif upload" value={group.activeUploaders} />
                <InfoPill label="Review" value={`${group.pendingReviews} tertunda`} tone={group.pendingReviews > 0 ? "warning" : "neutral"} />
                <InfoPill label="Submit final" value={group.submitStatus} tone={group.submitStatus === "Menunggu Review" || group.submitStatus === "Perlu Revisi" ? "warning" : "neutral"} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.members.map((member) => (
                  <span key={member} className="rounded-full border border-ktr-border-light bg-white px-3 py-1 text-xs font-semibold text-ktr-text-secondary">{member}</span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-ktr-border-light pt-4 text-sm font-semibold">
                <span className={group.attention === "Aktif" ? "text-ktr-success" : "text-[#9a620b]"}>{group.attention}</span>
                <span className="inline-flex items-center gap-1 text-ktr-primary">Lihat detail <HugeiconsIcon icon={ArrowRight01Icon} size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectMeta({ icon, label, value }: { icon: IconSvgElement; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-ktr-border-light bg-white px-4 py-3">
      <span className="flex size-9 items-center justify-center rounded-[12px] bg-ktr-secondary-bg-info-card text-ktr-secondary"><HugeiconsIcon icon={icon} size={18} /></span>
      <div>
        <p className="text-xs font-semibold text-ktr-text-tertiary">{label}</p>
        <p className="text-sm font-semibold text-ktr-text-primary">{value}</p>
      </div>
    </div>
  );
}

function InfoPill({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "warning" }) {
  return (
    <div className={tone === "warning" ? "rounded-[14px] border border-ktr-warning/25 bg-ktr-warning-bg px-3 py-3" : "rounded-[14px] border border-ktr-border-light bg-white px-3 py-3"}>
      <p className="text-xs font-semibold text-ktr-text-tertiary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ktr-text-primary">{value}</p>
    </div>
  );
}
