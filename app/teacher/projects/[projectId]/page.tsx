"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, EyeIcon, Folder01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
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
    members: [
      { name: "Bima A.", role: "Ketua", progress: "Desain hero section" },
      { name: "Raka M.", role: "Anggota", progress: "Draft konten" },
      { name: "Nadia S.", role: "Anggota", progress: "Layout kontak" },
    ],
    sessions: 3,
    attachments: 2,
    peerAssessment: "3/3",
    submitStatus: "Menunggu Tinjauan",
    contributionStatus: "Tercatat Baik",
  },
  {
    id: 2,
    name: "Kelompok 2",
    members: [
      { name: "Alya P.", role: "Ketua", progress: "Wireframe" },
      { name: "Dimas F.", role: "Anggota", progress: "Asset gambar" },
      { name: "Siti N.", role: "Anggota", progress: "Belum update" },
    ],
    sessions: 4,
    attachments: 4,
    peerAssessment: "2/3",
    submitStatus: "Sedang Berjalan",
    contributionStatus: "Perlu Ditinjau",
  },
];

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.projectId;

  return (
    <div className="min-h-dvh bg-default-50 px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/teacher/projects" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-default-200 bg-white text-sm font-medium hover:bg-default-100">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">{mockProject.name}</h1>
                <StatusBadge status={mockProject.status} />
              </div>
              <p className="mt-1 text-sm text-default-500">{mockProject.class} - Deadline: {mockProject.deadline}</p>
            </div>
          </div>
        </div>

        <Card className="border border-default-200 bg-white shadow-none">
          <Card.Content className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-semibold text-foreground">Brief Proyek</h2>
                <p className="mt-2 text-sm leading-6 text-default-500">{mockProject.description}</p>
              </div>
              <div className="min-w-64 rounded-lg border border-default-200 bg-default-50 p-4">
                <p className="text-xs font-medium text-default-500">Kode Bergabung</p>
                <p className="mt-1 text-lg font-bold font-sans tracking-wide text-foreground">{mockProject.joinCode}</p>
                <Button size="sm" variant="outline" className="mt-3 border-default-200 font-medium text-foreground shadow-none">
                  <HugeiconsIcon icon={Copy01Icon} size={16} className="mr-1" /> Salin Kode
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Daftar Kelompok</h2>
            <div className="flex items-center gap-2 text-sm font-medium text-default-500">
              <HugeiconsIcon icon={UserGroupIcon} size={16} />
              {mockGroups.length} Kelompok
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {mockGroups.map((group) => (
              <Card key={group.id} className="border border-default-200 bg-white shadow-none transition-colors hover:border-primary">
                <Card.Content className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary-100 p-3 text-primary">
                        <HugeiconsIcon icon={Folder01Icon} size={26} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{group.name}</h3>
                        <p className="mt-1 text-xs text-default-500">{group.sessions} diskusi - {group.attachments} lampiran - Peer {group.peerAssessment}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={group.submitStatus} />
                      <StatusBadge status={group.contributionStatus} />
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-lg border border-default-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-default-50 text-xs font-medium text-default-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Anggota</th>
                          <th className="px-4 py-3 font-medium">Peran</th>
                          <th className="px-4 py-3 font-medium">Progres Terakhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-default-100">
                        {group.members.map((member) => (
                          <tr key={member.name}>
                            <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                            <td className="px-4 py-3 text-default-500">{member.role}</td>
                            <td className="px-4 py-3 text-default-500">{member.progress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link href={`/teacher/projects/${projectId}/groups/${group.id}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
                      Detail <HugeiconsIcon icon={EyeIcon} size={16} />
                    </Link>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
