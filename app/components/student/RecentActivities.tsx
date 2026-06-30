import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Clock01Icon } from "@hugeicons/core-free-icons";

const activities = [
  {
    id: 1,
    text: 'Bima mengirim update di diskusi "Pembagian Tugas"',
    project: "Website Profil Sekolah",
    time: "5 menit lalu",
  },
  {
    id: 2,
    text: "Guru memberi feedback untuk Kelompok 3",
    project: "Website Profil Sekolah",
    time: "1 jam lalu",
  },
  {
    id: 3,
    text: "Alya mengunggah bukti kerja halaman kontak",
    project: "Website Profil Sekolah",
    time: "Kemarin",
  },
];

export default function RecentActivities() {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-[16px] font-semibold leading-[22px] text-ktr-text-primary">Aktivitas Terbaru</h2>
      <div className="overflow-hidden rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-[14px] py-3">
        {activities.map((activity, index) => (
          <article
            key={activity.id}
            className={`py-0 ${index !== activities.length - 1 ? "mb-3 border-b border-ktr-border-light pb-3" : ""}`}
          >
            <p className="text-[14px] font-normal leading-[22px] text-ktr-text-primary">
              {activity.text}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-[18px] text-ktr-text-tertiary">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Briefcase01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                {activity.project}
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} color="currentColor" aria-hidden="true" />
                {activity.time}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
