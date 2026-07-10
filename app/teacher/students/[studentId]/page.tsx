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
        <Link href="/teacher/students" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ktr-border-light bg-transparent text-sm font-medium hover:bg-ktr-surface-soft">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-ktr-text-primary tracking-tight">{mockStudent.name}</h1>
          <p className="text-ktr-text-tertiary mt-1 text-sm">
            {mockStudent.class} • NISN: {mockStudent.nisn}
          </p>
        </div>
      </div>

      {/* Project Context Selector */}
      <Card className="shadow-none border border-ktr-border-light">
        <Card.Content className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ktr-text-primary">Konteks Proyek</p>
            <p className="text-xs text-ktr-text-tertiary">Pilih proyek untuk melihat detail kontribusi siswa.</p>
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
          <Card className="shadow-none border border-ktr-border-light">
            <Card.Header className="border-b border-ktr-border-light p-4 bg-ktr-surface-soft/50">
              <h3 className="font-semibold text-ktr-text-primary">Rincian Indikator (PBL)</h3>
            </Card.Header>
            <Card.Content className="p-4 space-y-4">
              {mockIndicators.map((ind, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-ktr-border-light bg-ktr-surface-soft/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-ktr-text-primary">{ind.name}</p>
                    <p className="text-xs text-ktr-text-tertiary mt-1">{ind.desc}</p>
                  </div>
                  <div>
                    <StatusBadge status={ind.status} />
                  </div>
                </div>
              ))}
            </Card.Content>
          </Card>

          {/* Evidence Timeline */}
          <Card className="shadow-none border border-ktr-border-light">
            <Card.Header className="border-b border-ktr-border-light p-4 bg-ktr-surface-soft/50">
              <h3 className="font-semibold text-ktr-text-primary">Timeline Bukti Kontribusi</h3>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="relative border-l border-ktr-border-light ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ktr-primary ring-4 ring-background"></div>
                  <p className="text-xs text-ktr-text-tertiary mb-1">28 Jun 2026, 14:30</p>
                  <p className="text-sm font-medium text-ktr-text-primary">Mengunggah Progres: "Desain UI Selesai"</p>
                  <p className="text-xs text-ktr-text-tertiary mt-1">Siswa melampirkan file figma dan screenshot halaman utama.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ktr-primary ring-4 ring-background"></div>
                  <p className="text-xs text-ktr-text-tertiary mb-1">25 Jun 2026, 10:15</p>
                  <p className="text-sm font-medium text-ktr-text-primary">Sesi Diskusi 1 (Aktif)</p>
                  <p className="text-xs text-ktr-text-tertiary mt-1">Mengirimkan 8 pesan, merespon pembagian tugas dengan baik.</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* AI Insight */}
          <Card className="shadow-none border border-ktr-primary/35 bg-ktr-primary-soft/50">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 border-b border-ktr-primary/35 pb-3 mb-4">
                <HugeiconsIcon icon={BrainIcon} size={20} className="text-ktr-primary" />
                <h3 className="font-semibold text-ktr-primary-dark">AI Student Insight</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-ktr-primary-hover leading-relaxed">
                  Bima menunjukkan kepemimpinan yang baik di kelompoknya. Secara konsisten mengunggah bukti progres dan aktif merespon rekan di ruang diskusi. Indikator kolaborasi sangat menonjol.
                </p>
                <div className="pt-3 border-t border-ktr-primary/35">
                  <p className="text-[11px] italic text-ktr-primary-hover leading-tight">
                    Ringkasan AI bersifat pendukung. Guru tetap menentukan penilaian akhir.
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Peer Assessment Summary */}
          <Card className="shadow-none border border-ktr-border-light">
            <Card.Content className="p-5">
              <h3 className="font-semibold text-ktr-text-primary mb-3">Rangkuman Peer Assessment</h3>
              <p className="text-sm text-ktr-text-tertiary mb-4">Umpan balik dari anggota kelompok lain:</p>
              <div className="space-y-3">
                <div className="p-3 bg-ktr-surface-soft/50 rounded-xl border border-ktr-border-light text-sm text-ktr-text-primary italic">
                  "Bima sangat membantu saat ada error di kode HTML. Komunikasinya juga jelas."
                </div>
                <div className="p-3 bg-ktr-surface-soft/50 rounded-xl border border-ktr-border-light text-sm text-ktr-text-primary italic">
                  "Kerja bagus sebagai ketua, sering mengingatkan deadline."
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Teacher Assessment Form */}
          <Card className="shadow-none border border-ktr-primary/35 bg-ktr-primary-soft/50">
            <Card.Content className="p-5">
              <h3 className="font-semibold text-ktr-text-primary mb-4">Penilaian Guru (Manual)</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ktr-text-primary mb-1">Status Penilaian Akhir</label>
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
                  <label className="block text-xs font-medium text-ktr-text-primary mb-1">Nilai Angka (Opsional)</label>
                  <input 
                    type="number" 
                    placeholder="0-100"
                    className="w-full rounded-lg border border-ktr-border-light bg-ktr-surface-card py-2 px-3 text-sm text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-primary focus:outline-none focus:ring-1 focus:ring-ktr-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ktr-text-primary mb-1">Catatan Guru untuk Siswa</label>
                  <textarea 
                    placeholder="Bagus sekali pertahankan..."
                    rows={4}
                    className="w-full rounded-lg border border-ktr-border-light bg-ktr-surface-card p-3 text-sm text-ktr-text-primary placeholder:text-ktr-text-tertiary focus:border-ktr-primary focus:outline-none focus:ring-1 focus:ring-ktr-primary transition-colors resize-none"
                  />
                </div>
                <p className="text-xs text-ktr-text-tertiary italic">
                  Nilai akhir tetap ditentukan oleh guru berdasarkan data, konteks kelas, dan pertimbangan pembelajaran.
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 shadow-none border-ktr-border-light font-medium text-ktr-text-primary">Draft</Button>
                  <Button variant="primary" className="flex-1 shadow-none font-medium text-ktr-text-white">
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
