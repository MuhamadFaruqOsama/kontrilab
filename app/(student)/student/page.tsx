import { ArrowRight, ClipboardCheck, FolderKanban, MessageCircle, UsersRound } from "lucide-react";

const quickActions = [
  { title: "Gabung Proyek", description: "Masukkan kode dari guru.", icon: FolderKanban },
  { title: "Diskusi Terbaru", description: "Lanjutkan obrolan kelompok.", icon: MessageCircle },
  { title: "Kirim Update", description: "Catat progres yang sudah dikerjakan.", icon: ClipboardCheck },
];

export default function StudentPage() {
  return (
    <main className="min-h-screen px-4 pb-6 pt-5">
      <header className="flex items-start justify-between gap-4 pt-5">
        <div>
          <p className="text-base leading-ktr-snug text-ktr-text-secondary">Selamat datang kembali,</p>
          <h1 className="text-2xl font-semibold leading-ktr-tight text-ktr-text-primary">Akagami!</h1>
        </div>
        <div className="size-11 rounded-full border-2 border-ktr-surface-card bg-ktr-secondary-bg-info-card" aria-hidden="true" />
      </header>

      <section className="mt-7 rounded-lg border border-ktr-border-light bg-ktr-surface-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium leading-ktr-snug text-ktr-text-primary">Proyek Aktif</p>
            <p className="mt-1 text-xs leading-ktr-snug text-ktr-text-tertiary">Website Profil Sekolah</p>
          </div>
          <span className="rounded-full bg-ktr-primary-soft px-2.5 py-1 text-xs font-medium leading-ktr-snug text-ktr-primary-hover">
            Sedang Berjalan
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-ktr-primary-bg-form px-3 py-3 text-sm text-ktr-text-secondary">
          <span className="flex items-center gap-2">
            <UsersRound className="size-4 text-ktr-primary-hover" aria-hidden="true" />
            Kelompok 3
          </span>
          <span>6 Anggota</span>
        </div>
      </section>

      <section className="mt-5 rounded-lg bg-ktr-primary p-4 text-primary-foreground">
        <p className="text-sm font-semibold leading-ktr-snug">Kontribusimu Hari Ini</p>
        <p className="mt-2 text-base font-semibold leading-ktr-snug">
          Keren, kamu sudah mengirim 2 update hari ini.
        </p>
        <button className="mt-4 flex size-10 items-center justify-center rounded-full bg-ktr-surface-card text-ktr-primary-hover" type="button" aria-label="Lihat kontribusi hari ini">
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold leading-ktr-tight text-ktr-text-primary">Aksi Cepat</h2>
        <div className="mt-3 space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <article key={action.title} className="flex items-center gap-3 rounded-lg border border-ktr-border-light bg-ktr-surface-card p-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-ktr-primary-soft text-ktr-primary-hover">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium leading-ktr-snug text-ktr-text-primary">{action.title}</h3>
                  <p className="mt-0.5 truncate text-xs leading-ktr-snug text-ktr-text-tertiary">{action.description}</p>
                </div>
                <ArrowRight className="size-4 text-ktr-text-tertiary" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
