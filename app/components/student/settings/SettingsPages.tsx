"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowRight02Icon,
  Call02Icon,
  Camera01Icon,
  Cancel01Icon,
  File02Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  LockPasswordIcon,
  LogoutSquare01Icon,
  Mic01Icon,
  Notification01Icon,
  Search01Icon,
  Upload04Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons";

import { AppBackButton } from "@/components/ui/app-back-button";
import { AppDropdown } from "@/components/ui/app-dropdown";
import { AppFormField } from "@/components/ui/app-form-field";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "@/components/ui/toast";
import { clearAuthCookie } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import {
  CallAudioPreferences,
  NotificationPreferences,
  StudentProfile,
  defaultCallAudio,
  defaultNotifications,
  defaultProfile,
  helpArticles,
  mockSaveCallAudio,
  mockSaveNotifications,
  mockSaveProfile,
  mockSubmitReport,
  mockUpdatePassword,
  studentSettingsStorage,
} from "@/lib/student-settings";

type IconValue = Parameters<typeof HugeiconsIcon>[0]["icon"];
type Option = { value: string; label: string };

function Icon({ icon, className, size = 20 }: { icon: IconValue; className?: string; size?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} color="currentColor" className={className} aria-hidden="true" />;
}

function SettingsShell({ title, children, backHref = "/settings" }: { title: string; children: React.ReactNode; backHref?: string }) {
  return (
    <main className="relative min-h-dvh w-full bg-ktr-surface-bg-app pb-8 pt-6 text-ktr-text-primary">
      <div className="mx-auto min-w-0 w-full max-w-[430px] px-4">
        <div className="mb-5 flex items-center justify-between gap-3"><AppBackButton href={backHref} className="bg-transparent" /></div>
        <header className="mb-5"><h1 className="text-[24px] font-semibold leading-[32px] text-ktr-text-primary">{title}</h1></header>
        {children}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="space-y-2"><h2 className="text-[15px] font-semibold leading-[22px] text-ktr-text-secondary">{title}</h2><div className="space-y-1">{children}</div></section>; }
function RowDivider({ hidden = false }: { hidden?: boolean }) { void hidden; return null; }
function SettingsItem({ href, icon, title, tone = "default", onClick }: { href?: string; icon: IconValue; title: string; tone?: "default" | "danger"; onClick?: () => void }) {
  const className = cn("flex min-h-14 w-full cursor-pointer items-center gap-3 py-3 text-left transition-transform active:scale-[0.995]", tone === "danger" ? "text-ktr-project-need-attention" : "text-ktr-text-primary");
  const content = <><span className="flex size-7 shrink-0 items-center justify-start"><Icon icon={icon} size={21} /></span><span className="min-w-0 flex-1 text-[15px] font-semibold leading-[22px]">{title}</span>{href ? <Icon icon={ArrowRight02Icon} className="text-current opacity-75" size={18} /> : null}</>;
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" className={className} onClick={onClick}>{content}</button>;
}
function FormCard({ children }: { children: React.ReactNode }) { return <section className="space-y-4">{children}</section>; }
function SaveButton({ loading, children = "Simpan" }: { loading?: boolean; children?: React.ReactNode }) { return <Button type="submit" disabled={loading} className="h-11 w-full rounded-[12px] text-[14px] font-semibold">{loading ? "Menyimpan..." : children}</Button>; }
function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: Option[]; onChange: (value: string) => void }) {
  const selected = options.find((option) => option.value === value) ?? options[0];
  return <div className="space-y-2"><span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">{label}</span><AppDropdown label={label} placement="bottom start" triggerClassName="w-full" trigger={<button type="button" className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 text-left text-[14px] font-medium leading-[22px] text-ktr-text-primary transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.995]"><span className="min-w-0 truncate">{selected?.label}</span><Icon icon={ArrowDown01Icon} className="shrink-0 text-ktr-text-primary" size={16} /></button>} items={options.map((option) => ({ key: option.value, label: option.label, selected: option.value === value, onSelect: () => onChange(option.value) }))} /></div>;
}
function ToggleRow({ title, checked, onChange, disabled = false }: { title: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] py-3 text-left transition-transform active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-60" onClick={() => onChange(!checked)}><span className="text-[14px] font-medium leading-[22px] text-ktr-text-primary">{title}</span><span className={cn("relative h-7 w-12 shrink-0 rounded-full border transition-colors", checked ? "border-ktr-primary bg-ktr-primary" : "border-ktr-border-input bg-ktr-surface-soft")}><span className={cn("absolute top-1 size-5 rounded-full bg-white transition-transform", checked ? "translate-x-[22px]" : "translate-x-1")} /></span></button>;
}
function TextArea({ value, onChange, placeholder, error }: { value: string; onChange: (value: string) => void; placeholder: string; error?: string }) {
  return <label className="block space-y-2"><span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Deskripsi</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className={cn("w-full resize-none rounded-[12px] border bg-ktr-surface-card px-3.5 py-3 text-[14px] leading-[22px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary border-ktr-border-light focus:border-ktr-border-focus focus:ring-3 focus:ring-ktr-primary/12", error && "border-ktr-project-need-attention focus:border-ktr-project-need-attention focus:ring-ktr-project-need-attention/15")} placeholder={placeholder} />{error ? <span className="block text-[12px] font-medium text-ktr-project-need-attention">{error}</span> : null}</label>;
}

export function SettingsHomePage() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  function logout() { if (typeof window !== "undefined") { Object.keys(window.localStorage).forEach((key) => { if (key.toLowerCase().includes("token") || key.toLowerCase().includes("session") || key.toLowerCase().includes("auth")) window.localStorage.removeItem(key); }); document.cookie = `${clearAuthCookie().name}=; path=/; max-age=0; samesite=lax`; window.location.replace("/login"); } }
  return <SettingsShell title="Pengaturan" backHref="/student/profile"><div className="space-y-5"><Section title="Akun"><SettingsItem href="/settings/profile" icon={UserSettings01Icon} title="Edit Profil" /><RowDivider /><SettingsItem href="/settings/password" icon={LockPasswordIcon} title="Ubah Kata Sandi" /></Section><Section title="Preferensi"><SettingsItem href="/settings/notifications" icon={Notification01Icon} title="Notifikasi" /><RowDivider /><SettingsItem href="/settings/call-audio" icon={Call02Icon} title="Panggilan dan Audio" /></Section><Section title="Bantuan"><SettingsItem href="/settings/help" icon={HelpCircleIcon} title="Pusat Bantuan" /><RowDivider /><SettingsItem href="/settings/report" icon={Alert02Icon} title="Laporkan Masalah" /><RowDivider /><SettingsItem href="/settings/about" icon={InformationCircleIcon} title="Tentang KontriLab" /></Section><Section title="Akun"><SettingsItem icon={LogoutSquare01Icon} title="Keluar" tone="danger" onClick={() => setConfirmOpen(true)} /></Section></div><ConfirmModal open={confirmOpen} onOpenChange={setConfirmOpen} title="Keluar dari akun?" description="Kamu perlu masuk kembali untuk membuka KontriLab." confirmText="Keluar" cancelText="Batal" tone="danger" onConfirm={logout} /></SettingsShell>;
}

export function ProfileSettingsPage() {
  const [profile, setProfile] = React.useState<StudentProfile>(defaultProfile);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { const id = window.setTimeout(() => setProfile(studentSettingsStorage.getProfile()), 0); return () => window.clearTimeout(id); }, []);
  function update(key: keyof StudentProfile, value: string) { setProfile((current) => ({ ...current, [key]: value })); }
  function uploadAvatar(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.warning("File harus berupa gambar."); return; }
    if (file.size > 2 * 1024 * 1024) { toast.warning("Ukuran foto maksimal 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setProfile((current) => ({ ...current, avatarDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (profile.name.trim().length < 2) nextErrors.name = "Nama minimal 2 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) nextErrors.email = "Email belum valid.";
    if (profile.phone.trim().length < 8) nextErrors.phone = "Nomor telepon belum valid.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true); await mockSaveProfile(profile); setLoading(false);
    toast.success("Profil tersimpan", { description: "Perubahan disimpan di preferensi lokal untuk sementara." });
  }
  return <SettingsShell title="Edit Profil"><form className="space-y-4" onSubmit={submit}><FormCard><div className="flex items-center gap-3"><div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ktr-primary-soft text-[18px] font-semibold text-ktr-primary">{profile.avatarDataUrl ? <Image src={profile.avatarDataUrl} alt="Foto profil" width={64} height={64} unoptimized className="h-full w-full object-cover" /> : "AK"}</div><div className="min-w-0 flex-1"><p className="text-[15px] font-semibold leading-[22px] text-ktr-text-primary">Foto Profil</p><button type="button" className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[13px] font-semibold leading-5 text-ktr-primary" onClick={() => fileRef.current?.click()}><Icon icon={Camera01Icon} size={16} /> Ganti foto</button><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => uploadAvatar(event.target.files?.[0])} /></div></div></FormCard><FormCard><AppFormField label="Nama" placeholder="Masukkan nama" value={profile.name} onChange={(event) => update("name", event.target.value)} error={errors.name} /><AppFormField label="Email" type="email" placeholder="Masukkan email" value={profile.email} onChange={(event) => update("email", event.target.value)} error={errors.email} /><AppFormField label="Nomor Telepon" placeholder="Masukkan nomor telepon" value={profile.phone} onChange={(event) => update("phone", event.target.value)} error={errors.phone} /></FormCard><SaveButton loading={loading} /></form></SettingsShell>;
}

export function PasswordSettingsPage() {
  const [form, setForm] = React.useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.currentPassword) nextErrors.currentPassword = "Masukkan kata sandi saat ini.";
    if (form.newPassword.length < 8 || !/[A-Za-z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) nextErrors.newPassword = "Minimal 8 karakter, berisi huruf dan angka.";
    if (form.confirmPassword !== form.newPassword) nextErrors.confirmPassword = "Konfirmasi belum sama.";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    try { setLoading(true); await mockUpdatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); toast.success("Kata sandi diperbarui"); }
    catch (error) { toast.danger("Gagal mengubah kata sandi", { description: error instanceof Error ? error.message : "Coba lagi nanti." }); }
    finally { setLoading(false); }
  }
  return <SettingsShell title="Ubah Kata Sandi"><form className="space-y-4" onSubmit={submit}><FormCard><AppFormField label="Kata Sandi Saat Ini" type="password" placeholder="Masukkan kata sandi saat ini" value={form.currentPassword} onChange={(event) => update("currentPassword", event.target.value)} error={errors.currentPassword} /><AppFormField label="Kata Sandi Baru" type="password" placeholder="Masukkan kata sandi baru" value={form.newPassword} onChange={(event) => update("newPassword", event.target.value)} error={errors.newPassword} /><AppFormField label="Konfirmasi Kata Sandi Baru" type="password" placeholder="Ulangi kata sandi baru" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} error={errors.confirmPassword} /></FormCard><SaveButton loading={loading}>Ubah Kata Sandi</SaveButton></form></SettingsShell>;
}

export function NotificationsSettingsPage() {
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultNotifications);
  const [permission, setPermission] = React.useState<NotificationPermission | "unsupported">("default");
  React.useEffect(() => { const id = window.setTimeout(() => { setPrefs(studentSettingsStorage.getNotifications()); setPermission("Notification" in window ? window.Notification.permission : "unsupported"); }, 0); return () => window.clearTimeout(id); }, []);
  async function persist(next: NotificationPreferences) { const prev = prefs; setPrefs(next); try { await mockSaveNotifications(next); toast.success("Preferensi notifikasi tersimpan"); } catch { setPrefs(prev); toast.danger("Preferensi gagal disimpan"); } }
  async function requestPermission() { if (!("Notification" in window)) { setPermission("unsupported"); toast.warning("Browser belum mendukung notifikasi."); return; } const result = await window.Notification.requestPermission(); setPermission(result); await persist({ ...prefs, browserPush: result === "granted" }); }
  return <SettingsShell title="Notifikasi"><div className="space-y-4"><FormCard><ToggleRow title="Update proyek" checked={prefs.projectUpdates} onChange={(value) => persist({ ...prefs, projectUpdates: value })} /><ToggleRow title="Pengingat diskusi" checked={prefs.discussionReminders} onChange={(value) => persist({ ...prefs, discussionReminders: value })} /><ToggleRow title="Feedback guru" checked={prefs.teacherFeedback} onChange={(value) => persist({ ...prefs, teacherFeedback: value })} /></FormCard><FormCard><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center text-ktr-primary"><Icon icon={Notification01Icon} /></span><div className="min-w-0 flex-1"><p className="text-[15px] font-semibold leading-[22px] text-ktr-text-primary">Notifikasi Browser</p><p className="mt-1 text-[13px] leading-5 text-ktr-text-secondary">Status: {permission === "granted" ? "Diizinkan" : permission === "denied" ? "Ditolak" : permission === "unsupported" ? "Tidak didukung" : "Belum diminta"}</p></div></div><Button type="button" variant="outline" className="h-11 w-full rounded-[12px] border-ktr-border-light bg-ktr-surface-card text-ktr-text-primary" onClick={requestPermission}>Periksa Izin Notifikasi</Button></FormCard></div></SettingsShell>;
}

export function CallAudioSettingsPage() {
  const [prefs, setPrefs] = React.useState<CallAudioPreferences>(defaultCallAudio);
  const [devices, setDevices] = React.useState<{ mics: MediaDeviceInfo[]; speakers: MediaDeviceInfo[] }>({ mics: [], speakers: [] });
  const [status, setStatus] = React.useState("Izin perangkat belum diperiksa.");
  const [checking, setChecking] = React.useState(false);
  React.useEffect(() => { const id = window.setTimeout(() => setPrefs(studentSettingsStorage.getCallAudio()), 0); return () => window.clearTimeout(id); }, []);
  async function persist(next: CallAudioPreferences) { setPrefs(next); await mockSaveCallAudio(next); }
  async function checkDevices() {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus("Browser belum mendukung pemeriksaan mikrofon."); return; }
    try { setChecking(true); const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); stream.getTracks().forEach((track) => track.stop()); const list = await navigator.mediaDevices.enumerateDevices(); setDevices({ mics: list.filter((d) => d.kind === "audioinput"), speakers: list.filter((d) => d.kind === "audiooutput") }); setStatus("Izin mikrofon aktif. Perangkat berhasil dibaca."); toast.success("Perangkat berhasil diperiksa"); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Izin mikrofon ditolak atau tidak tersedia."); toast.warning("Izin perangkat belum aktif"); }
    finally { setChecking(false); }
  }
  return <SettingsShell title="Panggilan dan Audio"><div className="space-y-4"><FormCard><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center text-ktr-secondary"><Icon icon={Mic01Icon} /></span><p className="min-w-0 flex-1 text-[13px] leading-5 text-ktr-text-secondary">{status}</p></div><Button type="button" className="h-11 w-full rounded-[12px]" onClick={checkDevices} disabled={checking}>{checking ? "Memeriksa..." : "Periksa Izin Perangkat"}</Button></FormCard><FormCard><SelectControl label="Mikrofon" value={prefs.micDeviceId} onChange={(value) => persist({ ...prefs, micDeviceId: value })} options={[{ value: "", label: "Default sistem" }, ...devices.mics.map((device, index) => ({ value: device.deviceId, label: device.label || `Mikrofon ${index + 1}` }))]} /><SelectControl label="Speaker" value={prefs.speakerDeviceId} onChange={(value) => persist({ ...prefs, speakerDeviceId: value })} options={[{ value: "", label: "Default sistem" }, ...devices.speakers.map((device, index) => ({ value: device.deviceId, label: device.label || `Speaker ${index + 1}` }))]} /></FormCard><FormCard><ToggleRow title="Reduksi noise" checked={prefs.noiseSuppression} onChange={(value) => persist({ ...prefs, noiseSuppression: value })} /><ToggleRow title="Echo cancellation" checked={prefs.echoCancellation} onChange={(value) => persist({ ...prefs, echoCancellation: value })} /><ToggleRow title="Masuk panggilan dalam keadaan mute" checked={prefs.autoJoinMuted} onChange={(value) => persist({ ...prefs, autoJoinMuted: value })} /></FormCard></div></SettingsShell>;
}

export function HelpCenterPage() {
  const [query, setQuery] = React.useState("");
  const visible = helpArticles.filter((article) => article.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <SettingsShell title="Pusat Bantuan"><div className="space-y-4"><label className="flex h-11 min-w-0 items-center gap-2 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card px-3.5 text-ktr-text-tertiary focus-within:border-ktr-border-focus focus-within:ring-3 focus-within:ring-ktr-primary/12"><Icon icon={Search01Icon} size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari bantuan" className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-ktr-text-primary outline-none placeholder:text-ktr-text-tertiary" /></label><div className="space-y-1">{visible.map((article, index) => <React.Fragment key={article.id}><Link href={`/settings/help/${article.id}`} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[12px] py-3 text-ktr-text-primary transition-transform active:scale-[0.995]"><span className="flex size-9 shrink-0 items-center justify-center"><Icon icon={HelpCircleIcon} size={19} /></span><span className="min-w-0 flex-1 text-[15px] font-semibold leading-[22px]">{article.title}</span><Icon icon={ArrowRight02Icon} className="opacity-75" size={18} /></Link><RowDivider hidden={index === visible.length - 1} /></React.Fragment>)}</div></div></SettingsShell>;
}

export function HelpArticlePage({ articleId }: { articleId: string }) {
  const article = helpArticles.find((item) => item.id === articleId) ?? helpArticles[0];
  return <SettingsShell title={article.title} backHref="/settings/help"><FormCard><div className="space-y-3">{article.body.map((paragraph, index) => <p key={paragraph} className="text-[14px] leading-[22px] text-ktr-text-secondary"><span className="font-semibold text-ktr-text-primary">{index + 1}. </span>{paragraph}</p>)}</div></FormCard></SettingsShell>;
}

export function ReportProblemPage() {
  const [form, setForm] = React.useState({ category: "bug", title: "", description: "", attachmentName: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [successTicket, setSuccessTicket] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);
  function setField(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  function attach(file?: File) { if (!file) return; if (!file.type.startsWith("image/")) { toast.warning("Lampiran harus berupa gambar."); return; } if (file.size > 3 * 1024 * 1024) { toast.warning("Ukuran lampiran maksimal 3 MB."); return; } setField("attachmentName", file.name); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 5) nextErrors.title = "Judul minimal 5 karakter.";
    if (form.description.trim().length < 20) nextErrors.description = "Deskripsi minimal 20 karakter.";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    try { setLoading(true); const result = await mockSubmitReport(form); setSuccessTicket(result.ticketId); setForm({ category: "bug", title: "", description: "", attachmentName: "" }); toast.success("Laporan terkirim", { description: `Nomor tiket ${result.ticketId}` }); }
    catch (error) { toast.danger("Laporan gagal dikirim", { description: error instanceof Error ? error.message : "Coba lagi nanti." }); }
    finally { setLoading(false); }
  }
  return <SettingsShell title="Laporkan Masalah"><form className="space-y-4" onSubmit={submit}><FormCard>{successTicket ? <p className="rounded-[12px] bg-ktr-success-bg px-3 py-2 text-[13px] font-medium leading-5 text-ktr-success">Laporan terakhir: {successTicket}</p> : null}<SelectControl label="Kategori" value={form.category} onChange={(value) => setField("category", value)} options={[{ value: "bug", label: "Bug aplikasi" }, { value: "account", label: "Akun" }, { value: "call", label: "Panggilan" }, { value: "content", label: "Konten proyek" }]} /><AppFormField label="Judul" value={form.title} onChange={(event) => setField("title", event.target.value)} error={errors.title} placeholder="Contoh: Tidak bisa unggah progress" /><TextArea value={form.description} onChange={(value) => setField("description", value)} placeholder="Ceritakan masalah yang kamu alami dan langkah yang sudah dicoba." error={errors.description} /><div className="space-y-2"><span className="block text-[14px] font-medium leading-ktr-snug text-ktr-text-primary">Lampiran</span><button type="button" className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-ktr-border-light bg-ktr-surface-card text-[14px] font-semibold text-ktr-text-primary transition-[border-color,transform] hover:border-ktr-border-input active:scale-[0.995]" onClick={() => fileRef.current?.click()}><Icon icon={Upload04Icon} size={18} /> Pilih gambar</button><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => attach(event.target.files?.[0])} />{form.attachmentName ? <div className="flex items-center gap-2 rounded-[12px] bg-ktr-surface-soft px-3 py-2 text-[13px] text-ktr-text-secondary"><Icon icon={File02Icon} size={17} /><span className="min-w-0 flex-1 truncate">{form.attachmentName}</span><button type="button" className="text-ktr-text-primary" onClick={() => setField("attachmentName", "")} aria-label="Hapus lampiran"><Icon icon={Cancel01Icon} size={17} /></button></div> : null}</div></FormCard><SaveButton loading={loading}>Kirim Laporan</SaveButton></form></SettingsShell>;
}

export function AboutSettingsPage({ version }: { version: string }) {
  return <SettingsShell title="Tentang KontriLab"><div className="space-y-4"><FormCard><div className="flex items-center gap-3"><span className="flex size-12 shrink-0 items-center justify-center text-ktr-primary"><Icon icon={InformationCircleIcon} /></span><div><p className="text-[17px] font-semibold leading-[26px] text-ktr-text-primary">KontriLab</p><p className="text-[13px] leading-5 text-ktr-text-secondary">Versi {version}</p></div></div></FormCard><div className="space-y-1">{["Kebijakan Privasi", "Syarat Penggunaan", "Lisensi Open Source"].map((label, index, all) => <React.Fragment key={label}><a href={`/settings/about#${label.toLowerCase().replaceAll(" ", "-")}`} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[12px] py-3 text-ktr-text-primary transition-transform active:scale-[0.995]"><span className="min-w-0 flex-1 text-[15px] font-semibold leading-[22px]">{label}</span><Icon icon={ArrowRight02Icon} className="opacity-75" size={18} /></a><RowDivider hidden={index === all.length - 1} /></React.Fragment>)}</div></div></SettingsShell>;
}
