"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  CheckmarkCircle01Icon, 
  RefreshIcon, 
  File01Icon, 
  LinkSquare02Icon,
  BrainIcon,
  MessageMultiple01Icon,
  Attachment01Icon,
  CheckmarkSquare02Icon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";

const mockSubmission = {
  id: 1,
  project: "Website Profil Sekolah",
  group: "Kelompok 1",
  submitDate: "2026-07-18",
  status: "Menunggu Tinjauan",
  finalResult: {
    type: "file",
    name: "school-profile-final.zip",
    size: "4.2 MB",
    url: "#"
  },
  members: ["Bima A.", "Raka M.", "Nadia S."],
  contributionStatus: "Tercatat Baik"
};

export default function TinjauanDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/tinjauan" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default-200 bg-transparent text-sm font-medium hover:bg-default-100 shrink-0">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
                Tinjauan: {mockSubmission.group}
              </h1>
              <StatusBadge status={mockSubmission.status} />
            </div>
            <p className="text-default-500 mt-1 text-sm">
              {mockSubmission.project} • Dikirim: {mockSubmission.submitDate}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="ghost"
            className="font-medium shadow-none text-warning border-warning border"
          >
            <HugeiconsIcon icon={RefreshIcon} size={16} /> Minta Revisi
          </Button>
          <Button 
            variant="primary"
            className="font-medium shadow-none bg-success text-white"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} /> Terima Proyek
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Result & Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Final Result Card */}
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Hasil Akhir Proyek</h3>
              <div className="flex items-center justify-between p-4 rounded-xl border border-default-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-default-100 p-3">
                    <HugeiconsIcon icon={File01Icon} size={24} className="text-default-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{mockSubmission.finalResult.name}</p>
                    <p className="text-xs text-default-500 mt-0.5">{mockSubmission.finalResult.size}</p>
                  </div>
                </div>
                <a 
                  href={mockSubmission.finalResult.url}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 text-sm font-medium text-primary hover:bg-primary/20 transition-colors gap-2"
                >
                  Unduh / Lihat <HugeiconsIcon icon={LinkSquare02Icon} size={16} />
                </a>
              </div>
            </Card.Content>
          </Card>

          {/* Group Contribution Summary */}
          <Card className="shadow-none border border-default-200">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Ringkasan Kontribusi Kelompok</h3>
                <StatusBadge status={mockSubmission.contributionStatus} />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 text-center">
                  <HugeiconsIcon icon={MessageMultiple01Icon} size={20} className="mx-auto mb-2 text-default-500" />
                  <p className="text-2xl font-bold font-heading">3</p>
                  <p className="text-xs text-default-500 mt-1">Sesi Diskusi</p>
                </div>
                <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 text-center">
                  <HugeiconsIcon icon={Attachment01Icon} size={20} className="mx-auto mb-2 text-default-500" />
                  <p className="text-2xl font-bold font-heading">4</p>
                  <p className="text-xs text-default-500 mt-1">Unggahan Progres</p>
                </div>
                <div className="p-4 rounded-xl border border-default-200 bg-default-50/50 text-center">
                  <HugeiconsIcon icon={CheckmarkSquare02Icon} size={20} className="mx-auto mb-2 text-default-500" />
                  <p className="text-2xl font-bold font-heading">3/3</p>
                  <p className="text-xs text-default-500 mt-1">Peer Assessment</p>
                </div>
              </div>

              <p className="text-sm text-default-500 mb-3">Anggota Kelompok:</p>
              <div className="flex flex-wrap gap-2">
                {mockSubmission.members.map((member, i) => (
                  <span key={i} className="inline-flex items-center rounded-lg bg-default-100 px-3 py-1.5 text-xs font-medium text-foreground border border-default-200">
                    {member}
                  </span>
                ))}
              </div>
              
              <div className="mt-5 pt-4 border-t border-default-200 text-right">
                <Link href="/teacher/projects/1/groups/1" className="text-sm font-medium text-primary hover:underline">
                  Lihat Detail Grup Lengkap →
                </Link>
              </div>
            </Card.Content>
          </Card>

        </div>

        {/* Right: AI Insight & Decision Form */}
        <div className="space-y-6">
          
          {/* AI Insight */}
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-primary-200/50 pb-3 mb-4">
                <HugeiconsIcon icon={BrainIcon} size={20} className="text-primary" />
                <h3 className="font-semibold text-primary-900">AI Tinjauan Insight</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-primary-900/80 leading-relaxed">
                  Berdasarkan riwayat progres dan lampiran, hasil akhir proyek ini sesuai dengan brief yang diberikan. Kontribusi kelompok tercatat sangat baik dan peer assessment sudah diisi oleh semua anggota.
                </p>
                <div className="pt-3 border-t border-primary-200/50">
                  <p className="text-[11px] italic text-primary-700/70 leading-tight">
                    Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Teacher Decision Notes */}
          <Card className="shadow-none border border-default-200">
            <Card.Content className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Catatan Keputusan Guru</h3>
              <textarea
                placeholder="Tambahkan catatan mengapa diterima atau direvisi..."
                rows={4}
                className="w-full rounded-lg border border-default-200 bg-content1 p-3 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="ghost"
                  className="flex-1 shadow-none font-medium text-warning border-warning border"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={16} /> Kirim Revisi
                </Button>
                <Button 
                  variant="primary"
                  className="flex-1 shadow-none font-medium bg-success text-white"
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} /> Terima
                </Button>
              </div>
            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
}
