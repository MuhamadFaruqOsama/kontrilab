"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Message02Icon, Edit01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";

const mockGroup = {
  id: 1,
  name: "Kelompok 1",
  projectName: "Website Profil Sekolah",
  submitStatus: "Menunggu Tinjauan",
};

const mockMembers = [
  { id: 1, name: "Faruq", participation: "3/5", latestProgress: "Menyelesaikan layout hero dan mengunggah bukti Figma", peerAverage: "4.5/5", indication: "Baik" },
  { id: 2, name: "Bima Aditya", participation: "4/5", latestProgress: "Merapikan responsive navbar", peerAverage: "4.7/5", indication: "Baik" },
  { id: 3, name: "Nadia Safira", participation: "2/5", latestProgress: "Belum ada update sejak sesi terakhir", peerAverage: "3.2/5", indication: "Perlu Ditinjau" },
];

const mockSessions = [
  { id: 1, title: "Sesi 1: Perencanaan Desain", date: "2026-06-25", messages: 24, status: "Selesai" },
  { id: 2, title: "Sesi 2: Coding Homepage", date: "2026-06-28", messages: 45, status: "Selesai" },
  { id: 3, title: "Sesi 3: Integrasi dan Finalisasi", date: "2026-07-02", messages: 12, status: "Berjalan" },
];

export default function GroupDetail() {
  const params = useParams();
  const projectId = params.projectId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/projects/${projectId}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default-200 bg-transparent text-sm font-medium hover:bg-default-100">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">{mockGroup.name}</h1>
            <StatusBadge status={mockGroup.submitStatus} />
          </div>
          <p className="mt-1 text-sm text-default-500">{mockGroup.projectName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-none border border-default-200 overflow-hidden">
            <div className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Kontribusi Anggota</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-default-50 text-default-500 font-medium border-b border-default-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama</th>
                    <th className="px-6 py-4 text-center font-medium">Partisipasi</th>
                    <th className="px-6 py-4 font-medium">Progres Terakhir</th>
                    <th className="px-6 py-4 text-center font-medium">Rata-rata Nilai Peer Assessment</th>
                    <th className="px-6 py-4 text-center font-medium">Indikasi</th>
                    <th className="px-6 py-4 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {mockMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-default-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{member.name}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.participation}</td>
                      <td className="px-6 py-4 text-default-500">{member.latestProgress}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.peerAverage}</td>
                      <td className="px-6 py-4 text-center"><StatusBadge status={member.indication} /></td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/teacher/students/${member.id}`} className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-primary hover:bg-primary-50 transition-colors">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="shadow-none border border-default-200">
            <Card.Header className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Riwayat Sesi Diskusi</h3>
            </Card.Header>
            <Card.Content className="p-4 space-y-3">
              {mockSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl border border-default-200 bg-default-50/50 hover:bg-default-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary-100 p-2.5">
                      <HugeiconsIcon icon={Message02Icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{session.title}</p>
                      <p className="text-xs text-default-500 mt-0.5">{session.date} - {session.messages} pesan</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">Lihat Chat</Button>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-none border border-default-200">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-default-200 pb-3 mb-4">
                <HugeiconsIcon icon={Edit01Icon} size={20} className="text-default-500" />
                <h3 className="font-semibold text-foreground">Catatan Guru</h3>
              </div>
              <textarea
                placeholder="Tambahkan catatan untuk kelompok ini..."
                rows={5}
                className="w-full rounded-lg border border-default-200 bg-content1 p-3 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
              <Button variant="primary" className="mt-4 shadow-none font-medium text-white w-full">
                <HugeiconsIcon icon={FloppyDiskIcon} size={16} className="mr-1" />
                Simpan Catatan
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
