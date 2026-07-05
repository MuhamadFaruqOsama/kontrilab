"use client";

import Link from "next/link";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { Chip } from "@heroui/react/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  FilterIcon, 
  ArrowRight01Icon,
  Folder01Icon,
  MoreVerticalCircle01Icon
} from "@hugeicons/core-free-icons";
import FilterSelect from "@/components/teacher/FilterSelect";
import SearchInput from "@/components/teacher/SearchInput";

const mockProjects = [
  { id: 1, name: "Website Profil Sekolah", class: "XII RPL 1", groups: 5, students: 20, status: "Sedang Berjalan", progress: 75, deadline: "2026-07-20" },
  { id: 2, name: "Landing Page UMKM", class: "XI Desain Web", groups: 4, students: 16, status: "Selesai", progress: 100, deadline: "2026-07-15" },
  { id: 3, name: "Aplikasi Kas Sederhana", class: "XII RPL 2", groups: 6, students: 24, status: "Menunggu Review", progress: 95, deadline: "2026-07-18" },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Proyek</h1>
      </div>

      {/* Filters (No border frame) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2">
        {/* Search Bar */}
        <div className="w-full sm:max-w-xs">
          <SearchInput placeholder="Cari proyek..." />
        </div>
        {/* Filters */}
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-3">
          <FilterSelect
            className="w-36"
            ariaLabel="Filter Kelas"
            defaultValue="all-classes"
            options={[
              { value: "all-classes", label: "Semua Kelas" },
              { value: "XII RPL 1", label: "XII RPL 1" },
              { value: "XII RPL 2", label: "XII RPL 2" },
            ]}
          />
          <FilterSelect
            className="w-40"
            ariaLabel="Filter Status"
            defaultValue="all-status"
            options={[
              { value: "all-status", label: "Semua Status" },
              { value: "Sedang Berjalan", label: "Sedang Berjalan" },
              { value: "Menunggu Review", label: "Menunggu Review" },
            ]}
          />
          <Button variant="outline" className="border-default-200 shadow-none px-3 min-w-10 h-10">
            <HugeiconsIcon icon={FilterIcon} size={18} />
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} href={`/teacher/projects/${project.id}`} className="block">
            <Card className="shadow-none border border-default-200 hover:border-primary transition-colors h-full">
            <Card.Content className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-100 p-2.5">
                    <HugeiconsIcon icon={Folder01Icon} size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1">{project.name}</h3>
                    <p className="text-xs text-default-500 mt-1">{project.class} â€¢ {project.groups} Kelompok</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-default-500 px-2 min-w-8 h-8">
                  <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={18} />
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-500">Progress</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-default-200 pt-4">
                <Chip size="sm" variant="secondary" color={
                  project.status === 'Selesai' ? 'success' : 
                  project.status === 'Sedang Berjalan' ? 'accent' : 'warning'
                }>
                  {project.status}
                </Chip>
              </div>
            </Card.Content>
          </Card>
        </Link>
        ))}
      </div>
    </div>
  );
}
