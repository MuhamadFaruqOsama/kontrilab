export type ProfileActivityStatus = "Sangat Aktif" | "Aktif" | "Perlu Perhatian" | "Tidak Ada Aktivitas Terbaru";

export type ProfileSummary = {
  uploadProgressCount: number;
  validatedEvidenceCount: number;
  activeProjectCount: number;
  unreadFeedbackCount: number;
};

export type ActivityStatusDetail = {
  status: ProfileActivityStatus;
  reason: string;
  lastProgressUpload?: string;
  lastFeedbackResponse?: string;
  lastDiscussionActivity?: string;
};

export type ProjectMembership = {
  projectId: string;
  projectName: string;
  groupName?: string;
  role?: string;
  lastProgressUpload?: string;
  finalSubmissionDeadline: string;
  finalSubmissionStatus: string;
  targetRoute: string;
};

export type FeedbackPreview = {
  id: string;
  projectId: string;
  projectName: string;
  senderName: string;
  contentPreview: string;
  status: "Baru" | "Perlu Ditindaklanjuti" | "Sudah Ditanggapi" | "Selesai";
  createdAt: string;
  targetRoute: string;
};

export type RecentActivity = {
  id: string;
  type: "Upload Progress" | "Feedback Guru" | "Respons Feedback" | "Pesan Diskusi" | "Submit Final Kelompok" | "Asesmen";
  title: string;
  context: string;
  createdAt: string;
  targetRoute: string;
};

export type StudentProfileOverview = {
  user: {
    id: string;
    fullName: string;
    displayName?: string;
    username?: string;
    email: string;
    avatarUrl?: string;
    activityStatus: ProfileActivityStatus;
  };
  summary: ProfileSummary;
  activityStatus: ActivityStatusDetail;
  projects: ProjectMembership[];
  feedback?: FeedbackPreview;
  recentActivities: RecentActivity[];
};

export const defaultStudentProfileOverview: StudentProfileOverview = {
  user: {
    id: "student-akagami",
    fullName: "Akagami",
    username: "akagami",
    email: "akagami@student.kontrilab.local",
    activityStatus: "Aktif",
  },
  summary: {
    uploadProgressCount: 12,
    validatedEvidenceCount: 9,
    activeProjectCount: 2,
    unreadFeedbackCount: 1,
  },
  activityStatus: {
    status: "Aktif",
    reason: "Kamu mengunggah bukti kerja secara konsisten minggu ini.",
    lastProgressUpload: "Kemarin",
    lastFeedbackResponse: "Kemarin",
    lastDiscussionActivity: "Hari ini",
  },
  projects: [
    {
      projectId: "website-profil-sekolah",
      projectName: "Website Profil Sekolah",
      groupName: "Kelompok 3",
      role: "Anggota",
      lastProgressUpload: "Kemarin",
      finalSubmissionDeadline: "20 Juni 2026",
      finalSubmissionStatus: "Belum Dikumpulkan",
      targetRoute: "/student/projects/website-profil-sekolah",
    },
    {
      projectId: "landing-page-umkm",
      projectName: "Landing Page UMKM",
      groupName: "Kelompok 1",
      role: "UI Designer",
      lastProgressUpload: "2 hari lalu",
      finalSubmissionDeadline: "25 Juni 2026",
      finalSubmissionStatus: "Menunggu Kelompok",
      targetRoute: "/student/projects/landing-page-umkm",
    },
    {
      projectId: "poster-kampanye-digital",
      projectName: "Poster Kampanye Digital",
      groupName: "Kelompok 2",
      lastProgressUpload: "Minggu lalu",
      finalSubmissionDeadline: "18 Juni 2026",
      finalSubmissionStatus: "Perlu Revisi",
      targetRoute: "/student/projects/poster-kampanye-digital",
    },
  ],
  feedback: {
    id: "feedback-hero-section",
    projectId: "website-profil-sekolah",
    projectName: "Website Profil Sekolah",
    senderName: "Bu Ratna",
    contentPreview: "Bukti kerja sudah relevan. Tambahkan catatan singkat tentang perubahan yang kamu lakukan pada halaman kontak.",
    status: "Perlu Ditindaklanjuti",
    createdAt: "Kemarin",
    targetRoute: "/student/projects/website-profil-sekolah?feedback=feedback-hero-section",
  },
  recentActivities: [
    {
      id: "activity-progress-contact",
      type: "Upload Progress",
      title: "Mengunggah Progress",
      context: "Bukti kerja halaman kontak ditambahkan",
      createdAt: "10.24",
      targetRoute: "/student/progress/new",
    },
    {
      id: "activity-feedback-valid",
      type: "Feedback Guru",
      title: "Menerima Feedback",
      context: "Guru memberi catatan pada Website Profil Sekolah",
      createdAt: "Kemarin",
      targetRoute: "/student/projects/website-profil-sekolah?feedback=feedback-hero-section",
    },
    {
      id: "activity-discussion-message",
      type: "Pesan Diskusi",
      title: "Pesan Diskusi",
      context: "Membalas pembagian tugas kelompok",
      createdAt: "Kemarin",
      targetRoute: "/student/discussions/current",
    },
    {
      id: "activity-peer-assessment",
      type: "Asesmen",
      title: "Mengisi Umpan Balik Anggota",
      context: "Menilai kontribusi anggota kelompok",
      createdAt: "2 hari lalu",
      targetRoute: "/student/peer-assessment",
    },
    {
      id: "activity-submit-prep",
      type: "Submit Final Kelompok",
      title: "Menyiapkan Submit Final",
      context: "Kelompok meninjau hasil akhir proyek",
      createdAt: "3 hari lalu",
      targetRoute: "/student/projects/submit",
    },
  ],
};

export async function getStudentProfileOverview(): Promise<StudentProfileOverview> {
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  return defaultStudentProfileOverview;
}
