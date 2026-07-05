"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { Chip } from "@heroui/react/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Folder01Icon, 
  UserGroupIcon, 
  Alert01Icon,
  BrainIcon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";

const mockProjects = [
  { id: 1, name: "Website Profil Sekolah", class: "XII RPL 1", progress: 75, status: "Sedang Berjalan" },
  { id: 2, name: "Landing Page UMKM", class: "XI Desain Web", progress: 100, status: "Selesai" },
];

const mockNeedsReview = [
  { id: 1, group: "Kelompok 2", project: "Website Profil Sekolah", reason: "Progress tidak merata" },
  { id: 2, group: "Kelompok 4", project: "Aplikasi Kas Sederhana", reason: "Revisi dikirimkan ulang" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      {/* Date & Headline */}
      <div>
        <p className="text-sm font-medium text-default-500 mb-1">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
          Good Morning! Guru,
        </h1>
      </div>

      {/* Top Stat Pills */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 rounded-full border border-default-200 bg-white px-4 py-2 text-sm font-medium text-default-700">
          <HugeiconsIcon icon={Folder01Icon} size={16} className="text-default-500" />
          5 Proyek Aktif
        </div>
        <div className="flex items-center gap-2 rounded-full border border-default-200 bg-white px-4 py-2 text-sm font-medium text-default-700">
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-default-500" />
          18 Kelompok
        </div>
        <div className="flex items-center gap-2 rounded-full border border-default-200 bg-white px-4 py-2 text-sm font-medium text-default-700">
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-default-500" />
          84 Siswa
        </div>
      </div>

      {/* AI Insight Highlight */}
      <Card className="shadow-none border border-blue-200 bg-blue-50/60">
        <Card.Content className="p-4 flex flex-row items-start gap-4">
          <div className="rounded-lg bg-blue-100 p-2 shrink-0">
            <HugeiconsIcon icon={BrainIcon} size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">AI Insight Hari Ini</h3>
            <p className="mt-1 text-sm text-blue-800/80">
              AI menemukan beberapa kelompok yang perlu ditinjau karena progress anggota belum merata pada sesi terakhir.
              <span className="block mt-1 text-xs italic opacity-70">
                *Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
              </span>
            </p>
          </div>
          <Link href="/teacher/ai-insight" className="shrink-0 ml-auto self-center text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
            Lihat Semua <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Link>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Projects */}
        <Card className="shadow-none border border-default-200 bg-white">
          <Card.Header className="flex items-center justify-between border-b border-default-200 px-6 py-4">
            <h3 className="text-base font-semibold text-foreground">Proyek Berjalan</h3>
            <Link href="/teacher/projects" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Lihat Semua <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Card.Header>
          <Card.Content className="p-5 space-y-3">
            {mockProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50">
                <div>
                  <p className="font-medium text-sm text-foreground">{project.name}</p>
                  <p className="text-xs text-default-500 mt-1">{project.class}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <Chip size="sm" color={project.progress === 100 ? "success" : "accent"} variant="soft">{project.status}</Chip>
                  <div className="w-24 bg-default-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>

        {/* Perlu Ditinjau */}
        <Card className="shadow-none border border-default-200 bg-white">
          <Card.Header className="flex items-center justify-between border-b border-default-200 px-6 py-4">
            <h3 className="text-base font-semibold text-foreground">Kelompok Perlu Ditinjau</h3>
            <Link href="/teacher/ai-insight" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Lihat Insight <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Card.Header>
          <Card.Content className="p-5 space-y-3">
            {mockNeedsReview.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-default-100 bg-default-50/50">
                <div className="rounded-full bg-danger-100 p-2 shrink-0">
                  <HugeiconsIcon icon={Alert01Icon} size={16} className="text-danger-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{item.group}</p>
                  <p className="text-xs text-default-500 mt-0.5">{item.project}</p>
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
