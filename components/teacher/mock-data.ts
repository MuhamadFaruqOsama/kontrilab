export type ActivityStatus = "Sangat Aktif" | "Aktif" | "Perlu Perhatian" | "Tidak Ada Aktivitas Terbaru";
export type ReviewStatus = "Belum Direview" | "Valid" | "Perlu Klarifikasi" | "Kurang Relevan";
export type SubmitStatus = "Belum Submit" | "Menunggu Review" | "Perlu Revisi" | "Disetujui";

export const teacherProjects = [
  {
    id: "1",
    name: "Website Profil Sekolah",
    className: "XII RPL 1",
    status: "Aktif",
    startDate: "10 Juni 2026",
    finalDeadline: "20 Juli 2026",
    groups: 3,
    students: 18,
    individualUploads: 24,
    pendingUploadReviews: 5,
    pendingFinalReviews: 1,
    inactiveGroups: 1,
    announcement: "Fokuskan bukti kerja pada bagian yang benar-benar dikerjakan masing-masing anggota.",
  },
  {
    id: "2",
    name: "Landing Page UMKM",
    className: "XI Desain Web",
    status: "Aktif",
    startDate: "15 Juni 2026",
    finalDeadline: "25 Juli 2026",
    groups: 2,
    students: 12,
    individualUploads: 17,
    pendingUploadReviews: 3,
    pendingFinalReviews: 0,
    inactiveGroups: 0,
    announcement: "Pastikan link dan gambar referensi dicantumkan pada Upload Progress.",
  },
  {
    id: "3",
    name: "Poster Kampanye Digital",
    className: "X Informatika",
    status: "Aktif",
    startDate: "28 Juli 2026",
    finalDeadline: "18 Agustus 2026",
    groups: 1,
    students: 8,
    individualUploads: 0,
    pendingUploadReviews: 0,
    pendingFinalReviews: 0,
    inactiveGroups: 0,
    announcement: "Proyek sudah dimulai dan kelompok dapat langsung mengirim Upload Progress.",
  },
];

export const teacherGroups = [
  {
    id: "1",
    projectId: "1",
    name: "Kelompok 1",
    status: "Aktif",
    submitStatus: "Menunggu Review" as SubmitStatus,
    latestUpload: "Hari ini, 09.24",
    activeUploaders: "3 dari 4",
    pendingReviews: 2,
    attention: "Aktif",
    members: ["Alya Putri", "Bima Aditya", "Raka Maulana", "Nadia Safira"],
  },
  {
    id: "2",
    projectId: "1",
    name: "Kelompok 2",
    status: "Perlu Perhatian",
    submitStatus: "Belum Submit" as SubmitStatus,
    latestUpload: "7 hari lalu",
    activeUploaders: "1 dari 4",
    pendingReviews: 1,
    attention: "Tanpa aktivitas terbaru",
    members: ["Dimas Fajar", "Siti Nur", "Yusuf Kurnia", "Fira Rahma"],
  },
  {
    id: "3",
    projectId: "2",
    name: "Kelompok 3",
    status: "Aktif",
    submitStatus: "Perlu Revisi" as SubmitStatus,
    latestUpload: "Kemarin, 14.10",
    activeUploaders: "4 dari 4",
    pendingReviews: 3,
    attention: "Menunggu review",
    members: ["Gilang Pratama", "Laras Ayu", "Mei Wulandari", "Reno Saputra"],
  },
  {
    id: "4",
    projectId: "2",
    name: "Kelompok 4",
    status: "Aktif",
    submitStatus: "Belum Submit" as SubmitStatus,
    latestUpload: "2 hari lalu",
    activeUploaders: "2 dari 4",
    pendingReviews: 0,
    attention: "Aktif",
    members: ["Hanif A.", "Citra Dewi", "Nanda Putri", "Arga R."],
  },
  {
    id: "5",
    projectId: "3",
    name: "Kelompok 5",
    status: "Aktif",
    submitStatus: "Belum Submit" as SubmitStatus,
    latestUpload: "Belum ada",
    activeUploaders: "0 dari 4",
    pendingReviews: 0,
    attention: "Perlu progres awal",
    members: ["Doni N.", "Salsa L.", "Yuki K.", "Rama F."],
  },
];

export const teacherStudents = [
  { id: "1", name: "Alya Putri", className: "XII RPL 1", status: "Sangat Aktif" as ActivityStatus, uploads: 6, latestUpload: "Hari ini, 09.24", validatedEvidence: 4, feedbackResponse: "Cepat merespons", activeProject: "Website Profil Sekolah", reason: "Konsisten mengunggah bukti kerja dan merespons feedback." },
  { id: "2", name: "Bima Aditya", className: "XII RPL 1", status: "Aktif" as ActivityStatus, uploads: 5, latestUpload: "Hari ini, 09.12", validatedEvidence: 3, feedbackResponse: "Sudah merespons", activeProject: "Website Profil Sekolah", reason: "Upload terbaru relevan dan menunggu review lanjutan." },
  { id: "3", name: "Raka Maulana", className: "XII RPL 1", status: "Aktif" as ActivityStatus, uploads: 4, latestUpload: "Kemarin, 16.40", validatedEvidence: 3, feedbackResponse: "Sudah merespons", activeProject: "Website Profil Sekolah", reason: "Aktivitas stabil dalam diskusi dan unggahan." },
  { id: "4", name: "Nadia Safira", className: "XII RPL 1", status: "Perlu Perhatian" as ActivityStatus, uploads: 1, latestUpload: "7 hari lalu", validatedEvidence: 0, feedbackResponse: "Belum merespons", activeProject: "Website Profil Sekolah", reason: "Belum mengunggah bukti kerja selama 7 hari." },
  { id: "5", name: "Dimas Fajar", className: "XI Desain Web", status: "Tidak Ada Aktivitas Terbaru" as ActivityStatus, uploads: 0, latestUpload: "Belum ada", validatedEvidence: 0, feedbackResponse: "Belum ada feedback", activeProject: "Landing Page UMKM", reason: "Belum ada Upload Progress pada proyek aktif." },
  { id: "6", name: "Siti Nur", className: "XI Desain Web", status: "Perlu Perhatian" as ActivityStatus, uploads: 1, latestUpload: "6 hari lalu", validatedEvidence: 0, feedbackResponse: "Perlu klarifikasi", activeProject: "Landing Page UMKM", reason: "Bukti perlu klarifikasi dan belum ada respons terbaru." },
  { id: "7", name: "Gilang Pratama", className: "XI Desain Web", status: "Sangat Aktif" as ActivityStatus, uploads: 7, latestUpload: "Hari ini, 10.05", validatedEvidence: 5, feedbackResponse: "Cepat merespons", activeProject: "Landing Page UMKM", reason: "Upload konsisten dengan bukti gambar dan link yang relevan." },
  { id: "8", name: "Laras Ayu", className: "XI Desain Web", status: "Aktif" as ActivityStatus, uploads: 3, latestUpload: "Kemarin, 13.20", validatedEvidence: 2, feedbackResponse: "Sudah merespons", activeProject: "Landing Page UMKM", reason: "Bukti kerja valid dan diskusi aktif." },
  { id: "9", name: "Mei Wulandari", className: "X Informatika", status: "Tidak Ada Aktivitas Terbaru" as ActivityStatus, uploads: 0, latestUpload: "Belum ada", validatedEvidence: 0, feedbackResponse: "Belum ada feedback", activeProject: "Poster Kampanye Digital", reason: "Belum mengirim Upload Progress meski proyek sudah berjalan." },
  { id: "10", name: "Reno Saputra", className: "X Informatika", status: "Aktif" as ActivityStatus, uploads: 2, latestUpload: "2 hari lalu", validatedEvidence: 1, feedbackResponse: "Sudah merespons", activeProject: "Landing Page UMKM", reason: "Bukti link sudah ditinjau sebagian." },
  { id: "11", name: "Hanif A.", className: "XI Desain Web", status: "Aktif" as ActivityStatus, uploads: 3, latestUpload: "2 hari lalu", validatedEvidence: 2, feedbackResponse: "Sudah merespons", activeProject: "Landing Page UMKM", reason: "Mengerjakan aset visual dan merespons catatan." },
  { id: "12", name: "Citra Dewi", className: "XI Desain Web", status: "Perlu Perhatian" as ActivityStatus, uploads: 1, latestUpload: "5 hari lalu", validatedEvidence: 1, feedbackResponse: "Lambat merespons", activeProject: "Landing Page UMKM", reason: "Respons terhadap feedback belum lengkap." },
  { id: "13", name: "Nanda Putri", className: "XI Desain Web", status: "Aktif" as ActivityStatus, uploads: 4, latestUpload: "Kemarin, 11.00", validatedEvidence: 3, feedbackResponse: "Cepat merespons", activeProject: "Landing Page UMKM", reason: "Konsisten mengunggah teks dan gambar." },
  { id: "14", name: "Arga R.", className: "XI Desain Web", status: "Perlu Perhatian" as ActivityStatus, uploads: 1, latestUpload: "8 hari lalu", validatedEvidence: 0, feedbackResponse: "Belum merespons", activeProject: "Landing Page UMKM", reason: "Belum ada aktivitas terbaru lebih dari 7 hari." },
  { id: "15", name: "Doni N.", className: "X Informatika", status: "Tidak Ada Aktivitas Terbaru" as ActivityStatus, uploads: 0, latestUpload: "Belum ada", validatedEvidence: 0, feedbackResponse: "Belum ada feedback", activeProject: "Poster Kampanye Digital", reason: "Perlu mulai mengirim bukti kerja dan terlibat dalam diskusi kelompok." },
  { id: "16", name: "Salsa L.", className: "X Informatika", status: "Tidak Ada Aktivitas Terbaru" as ActivityStatus, uploads: 0, latestUpload: "Belum ada", validatedEvidence: 0, feedbackResponse: "Belum ada feedback", activeProject: "Poster Kampanye Digital", reason: "Perlu mulai mengirim bukti kerja dan terlibat dalam diskusi kelompok." },
];

export const uploadProgress = [
  { id: "u1", studentId: "1", student: "Alya Putri", group: "Kelompok 1", projectId: "1", summary: "Membuat wireframe halaman beranda dan menandai area konten sekolah.", evidenceType: "Gambar", time: "Hari ini, 09.24", status: "Belum Direview" as ReviewStatus, relevance: "Relevan" },
  { id: "u2", studentId: "2", student: "Bima Aditya", group: "Kelompok 1", projectId: "1", summary: "Merapikan responsive navbar dan menautkan file CSS.", evidenceType: "File", time: "Hari ini, 09.12", status: "Valid" as ReviewStatus, relevance: "Relevan" },
  { id: "u3", studentId: "4", student: "Nadia Safira", group: "Kelompok 1", projectId: "1", summary: "Mengirim referensi gambar tetapi belum menjelaskan bagian yang dikerjakan.", evidenceType: "Link", time: "7 hari lalu", status: "Perlu Klarifikasi" as ReviewStatus, relevance: "Perlu dicek" },
  { id: "u4", studentId: "7", student: "Gilang Pratama", group: "Kelompok 3", projectId: "2", summary: "Mengunggah screenshot hero section dan link preview landing page.", evidenceType: "Gambar", time: "Hari ini, 10.05", status: "Belum Direview" as ReviewStatus, relevance: "Relevan" },
  { id: "u5", studentId: "6", student: "Siti Nur", group: "Kelompok 2", projectId: "1", summary: "Catatan singkat tanpa bukti yang cukup untuk diverifikasi.", evidenceType: "Teks", time: "6 hari lalu", status: "Kurang Relevan" as ReviewStatus, relevance: "Kurang relevan" },
];


export const peerAssessmentScores = [
  { studentId: "1", projectId: "1", peerScore: 92, discussionScore: 88 },
  { studentId: "2", projectId: "1", peerScore: 84, discussionScore: 81 },
  { studentId: "3", projectId: "1", peerScore: 80, discussionScore: 76 },
  { studentId: "4", projectId: "1", peerScore: 46, discussionScore: 42 },
  { studentId: "5", projectId: "2", peerScore: 38, discussionScore: 34 },
  { studentId: "6", projectId: "1", peerScore: 50, discussionScore: 46 },
  { studentId: "7", projectId: "2", peerScore: 94, discussionScore: 90 },
  { studentId: "8", projectId: "2", peerScore: 78, discussionScore: 74 },
  { studentId: "9", projectId: "3", peerScore: 35, discussionScore: 32 },
  { studentId: "10", projectId: "2", peerScore: 72, discussionScore: 70 },
  { studentId: "11", projectId: "2", peerScore: 75, discussionScore: 72 },
  { studentId: "12", projectId: "2", peerScore: 48, discussionScore: 44 },
  { studentId: "13", projectId: "2", peerScore: 82, discussionScore: 79 },
  { studentId: "14", projectId: "2", peerScore: 42, discussionScore: 38 },
  { studentId: "15", projectId: "3", peerScore: 40, discussionScore: 36 },
  { studentId: "16", projectId: "3", peerScore: 43, discussionScore: 39 },
];

export function getStudentContributionBreakdown(studentId: string, projectId?: string) {
  const signals = peerAssessmentScores.filter((item) => item.studentId === studentId && (!projectId || item.projectId === projectId));
  const peerScore = signals.length ? Math.round(signals.reduce((total, item) => total + item.peerScore, 0) / signals.length) : 35;
  const discussionScore = signals.length ? Math.round(signals.reduce((total, item) => total + item.discussionScore, 0) / signals.length) : 32;
  const relevantUploads = uploadProgress.filter((item) => item.studentId === studentId && (!projectId || item.projectId === projectId));
  const uploadScore = Math.min(100, Math.max(relevantUploads.length ? 45 : 24, relevantUploads.length * 22 + (relevantUploads.some((item) => item.status === "Valid") ? 24 : 10)));
  const score = Math.round(peerScore * 0.4 + discussionScore * 0.3 + uploadScore * 0.3);

  return { score, peerScore, discussionScore, uploadScore, uploadCount: relevantUploads.length };
}
export const finalSubmissions = [
  { id: "s1", projectId: "1", groupId: "1", group: "Kelompok 1", submittedAt: "Hari ini, 11.20", file: "website-profil-sekolah.vercel.app", members: "4 anggota", status: "Menunggu Review" as SubmitStatus },
  { id: "s2", projectId: "2", groupId: "3", group: "Kelompok 3", submittedAt: "Kemarin, 15.40", file: "landing-umkm-final.zip", members: "4 anggota", status: "Perlu Revisi" as SubmitStatus },
];

export const followUps = [
  { title: "Upload Progress menunggu review", target: "5 unggahan", action: "Review" },
  { title: "Kelompok tanpa aktivitas terbaru", target: "Kelompok 2", action: "Lihat Kelompok" },
  { title: "Siswa perlu klarifikasi bukti kerja", target: "Nadia Safira", action: "Lihat Siswa" },
  { title: "Submit Final menunggu review", target: "Kelompok 1", action: "Review" },
  { title: "Deadline Submit Final sudah dekat", target: "Website Profil Sekolah", action: "Kirim Pengingat" },
];

export const recentActivities = [
  "Alya Putri mengunggah progress wireframe halaman beranda.",
  "Guru memberikan feedback pada bukti kerja Bima Aditya.",
  "Nadia Safira diminta memberi klarifikasi terhadap link referensi.",
  "Kelompok 1 melakukan Submit Final untuk Website Profil Sekolah.",
  "Kelompok 3 mengirim revisi hasil akhir Landing Page UMKM.",
];

export function getProject(id: string) {
  return teacherProjects.find((project) => project.id === id) ?? teacherProjects[0];
}

export function getGroup(projectId: string, groupId: string) {
  return teacherGroups.find((group) => group.projectId === projectId && group.id === groupId) ?? teacherGroups[0];
}

export function getStudent(id: string) {
  return teacherStudents.find((student) => student.id === id) ?? teacherStudents[0];
}
