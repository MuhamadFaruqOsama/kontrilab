export type StudentProfile = {
  name: string;
  email: string;
  phone: string;
  avatarDataUrl?: string;
};

export type NotificationPreferences = {
  projectUpdates: boolean;
  discussionReminders: boolean;
  teacherFeedback: boolean;
  browserPush: boolean;
};

export type CallAudioPreferences = {
  micDeviceId: string;
  speakerDeviceId: string;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoJoinMuted: boolean;
};


export type ReportPayload = {
  category: string;
  title: string;
  description: string;
  attachmentName?: string;
};

export const defaultProfile: StudentProfile = {
  name: "Akagami",
  email: "akagami@student.kontrilab.local",
  phone: "0812 3456 7890",
};

export const defaultNotifications: NotificationPreferences = {
  projectUpdates: true,
  discussionReminders: true,
  teacherFeedback: true,
  browserPush: false,
};

export const defaultCallAudio: CallAudioPreferences = {
  micDeviceId: "",
  speakerDeviceId: "",
  noiseSuppression: true,
  echoCancellation: true,
  autoJoinMuted: false,
};


const keys = {
  profile: "kontrilab:student:settings:profile",
  notifications: "kontrilab:student:settings:notifications",
  callAudio: "kontrilab:student:settings:call-audio",
};

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const studentSettingsStorage = {
  getProfile: () => readLocal(keys.profile, defaultProfile),
  setProfile: (value: StudentProfile) => writeLocal(keys.profile, value),
  getNotifications: () => readLocal(keys.notifications, defaultNotifications),
  setNotifications: (value: NotificationPreferences) => writeLocal(keys.notifications, value),
  getCallAudio: () => readLocal(keys.callAudio, defaultCallAudio),
  setCallAudio: (value: CallAudioPreferences) => writeLocal(keys.callAudio, value),
};

function wait(ms = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function mockSaveProfile(profile: StudentProfile) {
  await wait();
  studentSettingsStorage.setProfile(profile);
  return profile;
}

export async function mockUpdatePassword(payload: { currentPassword: string; newPassword: string }) {
  await wait();
  if (payload.currentPassword.trim().toLowerCase() === "salah") {
    throw new Error("Kata sandi saat ini tidak sesuai.");
  }
  return { ok: true };
}

export async function mockSaveNotifications(value: NotificationPreferences) {
  await wait(300);
  studentSettingsStorage.setNotifications(value);
  return value;
}

export async function mockSaveCallAudio(value: CallAudioPreferences) {
  await wait(300);
  studentSettingsStorage.setCallAudio(value);
  return value;
}


export async function mockSubmitReport(payload: ReportPayload) {
  await wait(600);
  if (payload.title.trim().length < 5) {
    throw new Error("Judul laporan terlalu pendek.");
  }
  return { ticketId: `KTR-${Math.floor(1000 + Math.random() * 9000)}` };
}


export const helpArticles = [
  {
    id: "gabung-proyek",
    title: "Cara gabung proyek",
    body: [
      "Buka Beranda atau Proyek, lalu pilih Gabung Proyek.",
      "Masukkan kode yang diberikan guru dan cek nama proyek sebelum melanjutkan.",
      "Setelah bergabung, pilih kelompok atau buat kelompok baru jika guru mengizinkan.",
    ],
  },
  {
    id: "unggah-progress",
    title: "Mengunggah progress kerja",
    body: [
      "Buka proyek aktif, pilih tambah progress, lalu tulis ringkasan pekerjaan.",
      "Tambahkan link atau lampiran yang relevan agar guru dan kelompok bisa meninjau bukti kerja.",
      "Progress yang sudah dikirim tetap tercatat sebagai jejak kontribusi.",
    ],
  },
  {
    id: "mulai-diskusi",
    title: "Memulai diskusi kelompok",
    body: [
      "Ketua kelompok dapat membuat diskusi baru dari detail proyek.",
      "Gunakan diskusi untuk menyepakati pembagian tugas, revisi, dan hasil akhir.",
      "Ringkasan diskusi membantu guru melihat proses kerja kelompok.",
    ],
  },
  {
    id: "izin-mikrofon",
    title: "Mengatur izin mikrofon",
    body: [
      "KontriLab hanya meminta izin mikrofon saat kamu menekan tombol pemeriksaan perangkat atau masuk panggilan.",
      "Jika izin ditolak, buka pengaturan browser untuk mengaktifkan ulang izin mikrofon.",
      "Pilih perangkat yang sesuai di Pengaturan Panggilan dan Audio.",
    ],
  },
];
