"use client";

import Link from "next/link";
import { Card } from "@heroui/react/card";
import { Chip } from "@heroui/react/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, UserGroupIcon, Alert01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const mockProjects = [
  { id: 1, name: "Website Profil Sekolah", class: "XII RPL 1", progress: 75, status: "Sedang Berjalan" },
  { id: 2, name: "Landing Page UMKM", class: "XI Desain Web", progress: 100, status: "Selesai" },
];

const mockNeedsTinjauan = [
  { id: 1, group: "Kelompok 2", project: "Website Profil Sekolah", reason: "Progres belum merata" },
  { id: 2, group: "Kelompok 4", project: "Aplikasi Kas Sederhana", reason: "Revisi dikirimkan ulang" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-ktr-text-tertiary mb-1">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-3xl font-bold font-heading text-ktr-text-primary tracking-tight">Selamat Pagi, Guru</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-ktr-border-light bg-ktr-surface-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-tertiary"><HugeiconsIcon icon={Folder01Icon} size={18} />Proyek Aktif</div>
          <p className="mt-3 text-4xl font-bold font-heading text-ktr-text-primary">5</p>
        </div>
        <div className="rounded-xl border border-ktr-border-light bg-ktr-surface-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-tertiary"><HugeiconsIcon icon={UserGroupIcon} size={18} />Kelompok</div>
          <p className="mt-3 text-4xl font-bold font-heading text-ktr-text-primary">18</p>
        </div>
        <div className="rounded-xl border border-ktr-border-light bg-ktr-surface-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ktr-text-tertiary"><HugeiconsIcon icon={UserGroupIcon} size={18} />Siswa</div>
          <p className="mt-3 text-4xl font-bold font-heading text-ktr-text-primary">84</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-none border border-ktr-border-light bg-ktr-surface-card">
          <Card.Header className="flex items-center justify-between border-b border-ktr-border-light px-6 py-4">
            <h3 className="text-base font-semibold text-ktr-text-primary">Proyek Berjalan</h3>
            <Link href="/teacher/projects" className="flex items-center gap-1 text-xs font-medium text-ktr-primary hover:underline">
              Lihat Semua <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Card.Header>
          <Card.Content className="p-5 space-y-3">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border border-ktr-border-light bg-ktr-surface-soft/50">
                <div>
                  <p className="font-medium text-sm text-ktr-text-primary">{project.name}</p>
                  <p className="text-xs text-ktr-text-tertiary mt-1">{project.class}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <Chip size="sm" color={project.progress === 100 ? "success" : "accent"} variant="soft">{project.status}</Chip>
                  <div className="w-24 bg-ktr-border-light rounded-full h-1.5 overflow-hidden">
                    <div className="bg-ktr-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>

        <Card className="shadow-none border border-ktr-border-light bg-ktr-surface-card">
          <Card.Header className="flex items-center justify-between border-b border-ktr-border-light px-6 py-4">
            <h3 className="text-base font-semibold text-ktr-text-primary">Kelompok Perlu Ditinjau</h3>
            <Link href="/teacher/projects" className="flex items-center gap-1 text-xs font-medium text-ktr-primary hover:underline">
              Lihat Proyek <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Card.Header>
          <Card.Content className="p-5 space-y-3">
            {mockNeedsTinjauan.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-ktr-border-light bg-ktr-surface-soft/50">
                <div className="rounded-full bg-danger-100 p-2 shrink-0">
                  <HugeiconsIcon icon={Alert01Icon} size={16} className="text-danger-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ktr-text-primary">{item.group}</p>
                  <p className="text-xs text-ktr-text-tertiary mt-0.5">{item.project}</p>
                  <p className="mt-1.5 text-xs font-medium text-danger-600">{item.reason}</p>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
