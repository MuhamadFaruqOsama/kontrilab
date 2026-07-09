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
  CheckmarkSquare02Icon,
  Activity01Icon,
  FloppyDiskIcon,
  Message02Icon
} from "@hugeicons/core-free-icons";
import StatusBadge from "@/components/teacher/StatusBadge";
import StatCard from "@/components/teacher/StatCard";
import FilterSelect from "@/components/teacher/FilterSelect";

const mockStudent = {
  id: 1,
  name: "Bima Aditya Pratama",
  class: "XII RPL 1",
  nisn: "0051234567"
};

const mockProjects = [
  { id: 1, name: "Website Profil Sekolah", role: "Ketua Kelompok" },
  { id: 2, name: "Sistem Informasi Perpustakaan", role: "Anggota" }
];

const mockIndicators = [
  { name: "Kolaborasi", status: "Tercatat Baik", desc: "Sering membantu anggota lain dan membagi tugas." },
  { name: "Komunikasi Diskusi", status: "Tercatat Baik", desc: "Aktif membalas dan memberikan ide di ruang diskusi." },
  { name: "Tanggung Jawab Progres", status: "Tercatat Baik", desc: "Mengunggah progres tepat waktu." },
  { name: "Kualitas Bukti Kerja", status: "Cukup Terlihat", desc: "Bukti kerja relevan dengan tugas." },
  { name: "Pemecahan Masalah", status: "Cukup Terlihat", desc: "Memberikan beberapa solusi teknis saat terjadi error." },
];

export default function StudentDetail() {
  const params = useParams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/students" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-default-200 bg-transparent text-sm font-medium hover:bg-default-100">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">{mockStudent.name}</h1>
          <p className="text-default-500 mt-1 text-sm">
            {mockStudent.class} • NISN: {mockStudent.nisn}
          </p>
        </div>
      </div>

      {/* Project Context Selector */}
      <Card className="shadow-none border border-default-200">
        <Card.Content className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Konteks Proyek</p>
            <p className="text-xs text-default-500">Pilih proyek untuk melihat detail kontribusi siswa.</p>
          </div>
          <FilterSelect
            className="w-full sm:w-72"
            ariaLabel="Pilih Proyek"
            defaultValue="1"
            options={mockProjects.map(p => ({
              value: p.id.toString(),
              label: `${p.name} (${p.role})`
            }))}
          />
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard title="Status Kontribusi" value="Tercatat Baik" icon={Activity01Icon} />
            <StatCard title="Sesi Diskusi" value={3} icon={MessageMultiple01Icon} />
            <StatCard title="Pesan Diskusi" value={15} icon={Message02Icon} />
            <StatCard title="Progres Dikirim" value={2} icon={Folder01Icon} />
            <StatCard title="Lampiran Kerja" value={1} icon={Attachment01Icon} />
            <StatCard title="Peer Assessment" value="Selesai" icon={CheckmarkSquare02Icon} />
          </div>

          {/* Indicator Breakdown */}
          <Card className="shadow-none border border-default-200">
            <Card.Header className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Rincian Indikator (PBL)</h3>
            </Card.Header>
            <Card.Content className="p-4 space-y-4">
              {mockIndicators.map((ind, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-default-200 bg-default-50/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{ind.name}</p>
                    <p className="text-xs text-default-500 mt-1">{ind.desc}</p>
                  </div>
                  <div>
                    <StatusBadge status={ind.status} />
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>

          {/* Evidence Timeline */}
          <Card className="shadow-none border border-default-200">
            <Card.Header className="border-b border-default-200 p-4 bg-default-50/50">
              <h3 className="font-semibold text-foreground">Timeline Bukti Kontribusi</h3>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="relative border-l border-default-200 ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                  <p className="text-xs text-default-500 mb-1">28 Jun 2026, 14:30</p>
                  <p className="text-sm font-medium text-foreground">Mengunggah Progres: "Desain UI Selesai"</p>
                  <p className="text-xs text-default-500 mt-1">Siswa melampirkan file figma dan screenshot halaman utama.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                  <p className="text-xs text-default-500 mb-1">25 Jun 2026, 10:15</p>
                  <p className="text-sm font-medium text-foreground">Sesi Diskusi 1 (Aktif)</p>
                  <p className="text-xs text-default-500 mt-1">Mengirimkan 8 pesan, merespon pembagian tugas dengan baik.</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* AI Insight */}
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-primary-200/50 pb-3 mb-4">
                <HugeiconsIcon icon={BrainIcon} size={20} className="text-primary" />
                <h3 className="font-semibold text-primary-900">AI Student Insight</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-primary-900/80 leading-relaxed">
                  Bima menunjukkan kepemimpinan yang baik di kelompoknya. Secara konsisten mengunggah bukti progres dan aktif merespon rekan di ruang diskusi. Indikator kolaborasi sangat menonjol.
                </p>
                <div className="pt-3 border-t border-primary-200/50">
                  <p className="text-[11px] italic text-primary-700/70 leading-tight">
                    Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Peer Assessment Summary */}
          <Card className="shadow-none border border-default-200">
            <Card.Content className="p-5">
              <h3 className="font-semibold text-foreground mb-3">Rangkuman Peer Assessment</h3>
              <p className="text-sm text-default-500 mb-4">Umpan balik dari anggota kelompok lain:</p>
              <div className="space-y-3">
                <div className="p-3 bg-default-50/50 rounded-xl border border-default-200 text-sm text-foreground italic">
                  "Bima sangat membantu saat ada error di kode HTML. Komunikasinya juga jelas."
                </div>
                <div className="p-3 bg-default-50/50 rounded-xl border border-default-200 text-sm text-foreground italic">
                  "Kerja bagus sebagai ketua, sering mengingatkan deadline."
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Teacher Assessment Form */}
          <Card className="shadow-none border border-primary-200 bg-primary-50/50">
            <Card.Content className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Penilaian Guru (Manual)</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Status Penilaian Akhir</label>
                  <FilterSelect
                    className="w-full"
                    ariaLabel="Status Penilaian Akhir"
                    defaultValue="Tercatat Baik"
                    options={[
                      { value: "Tercatat Baik", label: "Tercatat Baik" },
                      { value: "Cukup Terlihat", label: "Cukup Terlihat" },
                      { value: "Perlu Ditinjau", label: "Perlu Ditinjau" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Nilai Angka (Opsional)</label>
                  <input 
                    type="number" 
                    placeholder="0-100"
                    className="w-full rounded-lg border border-default-200 bg-content1 py-2 px-3 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Catatan Guru untuk Siswa</label>
                  <textarea 
                    placeholder="Bagus sekali pertahankan..."
                    rows={4}
                    className="w-full rounded-lg border border-default-200 bg-content1 p-3 text-sm text-foreground placeholder:text-default-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>
                <p className="text-xs text-default-500 italic">
                  Nilai akhir tetap ditentukan oleh guru berdasarkan data, konteks kelas, dan pertimbangan pembelajaran.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 shadow-none border-default-200 font-medium text-foreground">Draft</Button>
                  <Button variant="primary" className="flex-1 shadow-none font-medium text-white">
                    <HugeiconsIcon icon={FloppyDiskIcon} size={16} className="mr-1" /> Simpan
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
}
