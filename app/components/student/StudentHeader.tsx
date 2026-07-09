export default function StudentHeader() {
  return (
    <header className="flex items-start justify-between gap-5">
      <h1 className="max-w-[282px] text-[24px] font-semibold leading-[1.18] text-ktr-text-primary">
        <span className="block font-normal text-ktr-text-secondary">Selamat datang kembali,</span>
        Akagami!
      </h1>
      <button
        className="relative mt-0.5 size-[50px] shrink-0 overflow-hidden rounded-full border-[3px] border-ktr-surface-card bg-ktr-secondary-bg-info-card"
        type="button"
        aria-label="Buka profil"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#f5c7a8_0_18%,transparent_19%),radial-gradient(circle_at_50%_62%,#6fa5ff_0_30%,transparent_31%),linear-gradient(135deg,var(--ktr-status-info-bg),var(--ktr-surface-bg-app))]" />
        <span className="absolute left-1/2 top-[18px] h-6 w-7 -translate-x-1/2 rounded-t-full bg-[#f0c0a2]" />
        <span className="absolute left-1/2 top-[9px] size-[18px] -translate-x-1/2 rounded-full bg-[#f2c7aa]" />
        <span className="absolute left-[17px] top-[7px] h-2 w-4 rounded-full bg-ktr-text-primary" />
      </button>
    </header>
  );
}
