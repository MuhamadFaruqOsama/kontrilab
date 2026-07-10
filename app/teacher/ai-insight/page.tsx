"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { Chip } from "@heroui/react/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  BrainIcon, 
  Alert01Icon, 
  UserCheck01Icon, 
  ArrowRight01Icon,
  InformationCircleIcon,
  Bookmark01Icon
} from "@hugeicons/core-free-icons";

const mockInsights = [
  {
    id: 1,
    type: "perlu_ditinjau",
    title: "Progress Belum Merata",
    project: "Website Profil Sekolah",
    target: "Kelompok 2",
    summary: "Berdasarkan riwayat aktivitas, Alya mengerjakan 90% progress upload dan pesan diskusi. Dimas dan Siti N. belum terlihat berkontribusi secara langsung pada dokumen.",
    evidence: "Sesi Diskusi 2: 45 pesan, 40 dari Alya. Lampiran: 4 file, semua dari Alya.",
    suggestion: "Tinjau kelompok ini dan berikan catatan langsung kepada Dimas dan Siti N. untuk lebih proaktif di Sesi 3.",
    link: "/teacher/projects/1/groups/2"
  },
  {
    id: 2,
    type: "perlu_ditinjau",
    title: "Peer Assessment Belum Lengkap",
    project: "Landing Page UMKM",
    target: "Alya Putri Ramadhani",
    summary: "Alya belum mengisi penilaian teman sejawat (peer assessment) yang sudah melewati batas waktu hari ini.",
    evidence: "Status Form Peer Assessment Alya: Belum",
    suggestion: "Berikan teguran ringan atau perpanjangan waktu pengisian form khusus untuk Alya.",
    link: "/teacher/students/4"
  },
  {
    id: 3,
    type: "positif",
    title: "Kolaborasi dan Pemecahan Masalah Solid",
    project: "Website Profil Sekolah",
    target: "Bima Aditya Pratama",
    summary: "Bima secara konsisten memandu diskusi dan menawarkan solusi ketika ada anggota yang mengalami kendala teknis HTML/CSS.",
    evidence: "Log Diskusi: 'Coba pakai flexbox aja biar gambarnya sejajar, nanti aku bantu cek kodenya.' (28 Jun 2026)",
    suggestion: "Siswa ini sangat potensial untuk diberikan peran kepemimpinan yang lebih besar atau pengakuan (reward) di depan kelas.",
    link: "/teacher/students/1"
  }
];

export default function AIInsightPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center p-1">
          <div className="absolute inset-0 bg-ktr-primary-light blur-lg rounded-full animate-pulse"></div>
          <HugeiconsIcon icon={BrainIcon} size={28} className="text-ktr-primary relative animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <h1 className="text-3xl font-bold font-heading text-ktr-text-primary tracking-tight">AI Insight Center</h1>
      </div>

      {/* Disclaimer Banner */}
      <Card className="shadow-none border border-ktr-primary/35 bg-ktr-primary-soft/50">
        <Card.Content className="p-4">
          <p className="text-sm font-medium text-ktr-primary-dark text-center italic">
            "Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir berdasarkan konteks penuh pembelajaran."
          </p>
        </Card.Content>
      </Card>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInsights.map((insight) => {
          const isPositive = insight.type === "positif";
          return (
            <Card key={insight.id} className="shadow-none border border-ktr-border-light flex flex-col">
              {/* Card Header Tag */}
              <div className={`px-5 py-3 border-b border-ktr-border-light flex items-center gap-3 ${isPositive ? "bg-ktr-success-bg/70" : "bg-ktr-warning-bg/70"}`}>
                <HugeiconsIcon 
                  icon={isPositive ? UserCheck01Icon : Alert01Icon} 
                  size={18} 
                  className={isPositive ? "text-ktr-success" : "text-ktr-warning"} 
                />
                <Chip 
                  color={isPositive ? "success" : "warning"} 
                  variant="soft" 
                  size="sm"
                  className="font-medium"
                >
                  {isPositive ? "Kontribusi Positif" : "Perlu Ditinjau"}
                </Chip>
              </div>

              <Card.Content className="p-5 flex flex-col gap-4 flex-1">
                {/* Title & Target */}
                <div>
                  <h3 className="font-semibold text-ktr-text-primary text-base leading-snug">{insight.title}</h3>
                  <p className="text-xs text-ktr-text-tertiary mt-1">
                    <span className="font-medium text-ktr-text-primary">{insight.target}</span> Â· {insight.project}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-sm text-ktr-text-secondary leading-relaxed">{insight.summary}</p>

                {/* Evidence */}
                <div className="rounded-xl border border-ktr-border-light bg-ktr-surface-soft p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <HugeiconsIcon icon={Bookmark01Icon} size={14} className="text-ktr-text-tertiary" />
                    <p className="text-xs font-semibold text-ktr-text-tertiary capitalize tracking-wide">Referensi Bukti</p>
                  </div>
                  <p className="text-xs text-ktr-text-tertiary italic leading-relaxed">{insight.evidence}</p>
                </div>

                {/* Suggestion */}
                <div className="flex items-start gap-2">
                  <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-ktr-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-ktr-text-secondary leading-relaxed">{insight.suggestion}</p>
                </div>

                {/* CTA */}
                <Link
                  href={insight.link}
                  className="mt-auto inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-ktr-surface-soft px-4 text-sm font-medium text-ktr-text-primary hover:bg-ktr-border-light transition-colors"
                >
                  Lihat Detail Konteks <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
