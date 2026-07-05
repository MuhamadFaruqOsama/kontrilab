"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  Copy01Icon, 
  BrainIcon, 
  EyeIcon, 
  CheckmarkSquare02Icon, 
  RefreshIcon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";

const mockProject = {
  id: 1,
  name: "Website Profil Sekolah",
  class: "XII RPL 1",
  deadline: "2026-07-20",
  joinCode: "RPL1-WEB",
  description: "Proyek akhir semester untuk membuat website profil sekolah yang responsif dan informatif menggunakan HTML, CSS, dan JavaScript murni.",
  status: "Sedang Berjalan",
};

const mockGroups = [
  { 
    id: 1, 
    name: "Kelompok 1", 
    members: ["Bima A.", "Raka M.", "Nadia S."], 
    sessions: 3, 
    progress: 75, 
    attachments: 2, 
    peerAssessment: "3/3", 
    submitStatus: "Menunggu Review",
    contributionStatus: "Tercatat Baik" 
  },
  { 
    id: 2, 
    name: "Kelompok 2", 
    members: ["Alya P.", "Dimas F.", "Siti N."], 
    sessions: 4, 
    progress: 90, 
    attachments: 4, 
    peerAssessment: "2/3", 
    submitStatus: "Sedang Berjalan",
    contributionStatus: "Perlu Ditinjau" 
  },
];

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.projectId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/projects" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default-200 bg-transparent text-sm font-medium hover:bg-default-100">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">{mockProject.name}</h1>
          <StatusBadge status={mockProject.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info & Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-none border border-default-200">
            <Card.Content className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-foreground">Brief Proyek</h3>
                <p className="text-default-500 text-sm">{mockProject.class} • Deadline: {mockProject.deadline}</p>
              </div>
              <p className="text-sm text-default-500">{mockProject.description}</p>
              
              <div className="mt-6 flex items-center justify-between rounded-lg bg-default-50 p-4 border border-default-200">
                <div>
                  <p className="text-xs font-medium text-default-500">Kode Bergabung</p>
                  <p className="text-lg font-bold font-mono tracking-wider text-foreground mt-1">{mockProject.joinCode}</p>
                </div>
                <Button size="sm" variant="outline" className="border-default-200 shadow-none font-medium text-foreground">
                  <HugeiconsIcon icon={Copy01Icon} size={16} className="mr-1" /> Salin Kode
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Group Table using native html */}
          <Card className="shadow-none border border-default-200 overflow-hidden">
            <div className="border-b border-default-200 p-4 flex items-center justify-between bg-default-50/50">
              <h3 className="font-semibold text-foreground">Daftar Kelompok</h3>
              <div className="text-sm font-medium text-default-500 flex items-center gap-2">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
                {mockGroups.length} Kelompok
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-default-50 text-default-500 font-medium">
                  <tr>
                    <th className="px-6 py-4 font-medium">Kelompok & Anggota</th>
                    <th className="px-6 py-4 text-center font-medium">Diskusi</th>
                    <th className="px-6 py-4 text-center font-medium">Progress</th>
                    <th className="px-6 py-4 text-center font-medium">Lampiran</th>
                    <th className="px-6 py-4 text-center font-medium">Peer Ass.</th>
                    <th className="px-6 py-4 text-center font-medium">Status</th>
                    <th className="px-6 py-4 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {mockGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-default-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{group.name}</p>
                        <p className="text-xs text-default-500 mt-1">{group.members.join(", ")}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-default-500">{group.sessions}</td>
                      <td className="px-6 py-4 text-center text-default-500">{group.progress}%</td>
                      <td className="px-6 py-4 text-center text-default-500">{group.attachments}</td>
                      <td className="px-6 py-4 text-center text-default-500">{group.peerAssessment}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-center">
                          <StatusBadge status={group.submitStatus} />
                          <StatusBadge status={group.contributionStatus} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/teacher/projects/${projectId}/groups/${group.id}`} className="p-1.5 text-default-500 hover:text-primary hover:bg-primary-50 rounded-md transition-colors">
                            <HugeiconsIcon icon={EyeIcon} size={16} />
                          </Link>
                          {group.submitStatus === "Menunggu Review" && (
                            <Link href={`/teacher/review/1`} className="p-1.5 text-primary hover:bg-primary-50 rounded-md transition-colors">
                              <HugeiconsIcon icon={CheckmarkSquare02Icon} size={16} />
                            </Link>
                          )}
                          <button className="p-1.5 text-warning hover:bg-warning-50 rounded-md transition-colors">
                            <HugeiconsIcon icon={RefreshIcon} size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar AI Insight */}
        <div className="space-y-6">
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-primary-200/50 pb-3 mb-4">
                <HugeiconsIcon icon={BrainIcon} size={20} className="text-primary" />
                <h3 className="font-semibold text-primary-900">AI Project Insight</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-primary-800 capitalize tracking-wider">Rangkuman Proyek</h4>
                  <p className="mt-1 text-sm text-primary-900/80 leading-relaxed">
                    Secara umum, 80% kelompok sudah mencapai progress di atas 50%. Terdapat peningkatan aktivitas diskusi pada H-3 deadline.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-primary-800 capitalize tracking-wider">Perhatian Khusus</h4>
                  <ul className="mt-1 text-sm text-primary-900/80 list-disc list-inside space-y-1">
                    <li>Kelompok 2 perlu ditinjau karena ada anggota yang belum mengisi peer assessment.</li>
                    <li>Siswa bernama "Siti N." di Kelompok 2 belum menunjukkan aktivitas diskusi sejak awal sesi.</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-primary-200/50">
                  <p className="text-[11px] italic text-primary-700/70 leading-tight">
                    Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
