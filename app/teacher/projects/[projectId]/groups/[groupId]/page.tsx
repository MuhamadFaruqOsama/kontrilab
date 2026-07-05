"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  BrainIcon, 
  MessageMultiple01Icon, 
  Folder01Icon, 
  Attachment01Icon, 
  UserGroupIcon,
  Message02Icon,
  Edit01Icon,
  FloppyDiskIcon,
  ViewIcon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";

const mockGroup = {
  id: 1,
  name: "Kelompok 1",
  projectName: "Website Profil Sekolah",
  stats: {
    members: 3,
    sessions: 3,
    progress: 75,
    attachments: 2,
    peerAssessment: "3/3 Lengkap",
    submitStatus: "Menunggu Review"
  }
};

const mockMembers = [
  { id: 1, name: "Bima Aditya Pratama", messages: 15, progress: 2, attachments: 1, peerAss: "Selesai", indication: "Tercatat Baik" },
  { id: 2, name: "Raka Maulana Yusuf", messages: 12, progress: 1, attachments: 1, peerAss: "Selesai", indication: "Tercatat Baik" },
  { id: 3, name: "Nadia Safira Lestari", messages: 5, progress: 0, attachments: 0, peerAss: "Selesai", indication: "Cukup Terlihat" },
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/teacher/projects/${projectId}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default-200 bg-transparent text-sm font-medium hover:bg-default-100">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">{mockGroup.name}</h1>
          <StatusBadge status={mockGroup.stats.submitStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Group Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-none border border-default-200">
              <Card.Content className="p-4">
                <div className="flex items-center gap-2 text-default-500 mb-2">
                  <HugeiconsIcon icon={UserGroupIcon} size={16} />
                  <span className="text-xs font-medium capitalize">Anggota</span>
                </div>
                <p className="text-2xl font-bold font-heading">{mockGroup.stats.members}</p>
              </Card.Content>
            </Card>
            <Card className="shadow-none border border-default-200">
              <Card.Content className="p-4">
                <div className="flex items-center gap-2 text-default-500 mb-2">
                  <HugeiconsIcon icon={MessageMultiple01Icon} size={16} />
                  <span className="text-xs font-medium capitalize">Diskusi</span>
                </div>
                <p className="text-2xl font-bold font-heading">{mockGroup.stats.sessions}</p>
              </Card.Content>
            </Card>
            <Card className="shadow-none border border-default-200">
              <Card.Content className="p-4">
                <div className="flex items-center gap-2 text-default-500 mb-2">
                  <HugeiconsIcon icon={Folder01Icon} size={16} />
                  <span className="text-xs font-medium capitalize">Progress</span>
                </div>
                <p className="text-2xl font-bold font-heading">{mockGroup.stats.progress}%</p>
              </Card.Content>
            </Card>
            <Card className="shadow-none border border-default-200">
              <Card.Content className="p-4">
                <div className="flex items-center gap-2 text-default-500 mb-2">
                  <HugeiconsIcon icon={Attachment01Icon} size={16} />
                  <span className="text-xs font-medium capitalize">Lampiran</span>
                </div>
                <p className="text-2xl font-bold font-heading">{mockGroup.stats.attachments}</p>
              </Card.Content>
            </Card>
          </div>

          {/* Members Table */}
          <Card className="shadow-none border border-default-200 overflow-hidden">
            <div className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Kontribusi Anggota</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-default-50 text-default-500 font-medium border-b border-default-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Siswa</th>
                    <th className="px-6 py-4 text-center font-medium">Pesan</th>
                    <th className="px-6 py-4 text-center font-medium">Progress</th>
                    <th className="px-6 py-4 text-center font-medium">Lampiran</th>
                    <th className="px-6 py-4 text-center font-medium">Peer Ass.</th>
                    <th className="px-6 py-4 text-center font-medium">Indikasi</th>
                    <th className="px-6 py-4 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {mockMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-default-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{member.name}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.messages}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.progress}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.attachments}</td>
                      <td className="px-6 py-4 text-center text-default-500">{member.peerAss}</td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={member.indication} />
                      </td>
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

          {/* Session List */}
          <Card className="shadow-none border border-default-200">
            <Card.Header className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Riwayat Sesi Diskusi</h3>
            </Card.Header>
            <Card.Content className="p-4 space-y-3">
              {mockSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl border border-default-200 bg-default-50/50 hover:bg-default-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary-100 p-2.5">
                      <HugeiconsIcon icon={Message02Icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{session.title}</p>
                      <p className="text-xs text-default-500 mt-0.5">{session.date} • {session.messages} pesan</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    Lihat Chat
                  </Button>
                </div>
              ))}
            </Card.Content>
          </Card>

        </div>

        {/* Sidebar right: AI & Notes */}
        <div className="space-y-6">
          {/* AI Insight */}
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-primary-200/50 pb-3 mb-4">
                <HugeiconsIcon icon={BrainIcon} size={20} className="text-primary" />
                <h3 className="font-semibold text-primary-900">AI Group Insight</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-primary-800 capitalize tracking-wider">Rangkuman Kontribusi</h4>
                  <p className="mt-1 text-sm text-primary-900/80 leading-relaxed">
                    Bima dan Raka mendominasi diskusi dan pengerjaan tugas (progress upload). Nadia cenderung pasif di diskusi namun telah menyelesaikan tugas Peer Assessment.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-primary-800 capitalize tracking-wider">Saran Tindak Lanjut</h4>
                  <p className="mt-1 text-sm text-primary-900/80">
                    Tinjau kembali keterlibatan Nadia. Guru mungkin perlu memberikan motivasi agar Nadia lebih aktif di sesi ke-3.
                  </p>
                </div>

                <div className="pt-3 border-t border-primary-200/50">
                  <p className="text-[11px] italic text-primary-700/70 leading-tight">
                    Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Teacher Notes */}
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
