import { supabaseAdmin } from "@/lib/supabase/admin";

type DbRow = Record<string, unknown>;

export type SqlGroupMember = {
  id: string;
  name: string;
  role: "Ketua" | "Anggota";
  initials: string;
  avatarClass: string;
};

export type SqlDiscussionItem = {
  title: string;
  status: string;
  statusClass: string;
  messages: string;
  meta: string;
  primary?: boolean;
  unreadCount?: number;
  requiresPeerAssessment?: boolean;
};

export type SqlProgressItem = {
  text: string;
  author: string;
  time: string;
  avatarClass: string;
};

export type StudentGroupOverview = {
  project: {
    title: string;
    className: string;
    dueDate: string;
    status: string;
  };
  members: SqlGroupMember[];
  progress: SqlProgressItem[];
  discussions: SqlDiscussionItem[];
};

const avatarClasses = [
  "bg-[linear-gradient(135deg,#d7f1ff,#57c186_52%,#2b3033)]",
  "bg-[linear-gradient(135deg,#233046,#5b8fb9_48%,#f5a623)]",
  "bg-[linear-gradient(135deg,#f7d9c4,#f5a623_42%,#5b8fb9)]",
  "bg-[linear-gradient(135deg,#d8ff00,#57c186_48%,#2f536f)]",
  "bg-[linear-gradient(135deg,#7c2d12,#fb7185)]",
];

function asRows(value: unknown): DbRow[] {
  return Array.isArray(value) ? value.filter((item): item is DbRow => item !== null && typeof item === "object" && !Array.isArray(item)) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumberId(value: unknown): number | null {
  return typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : null;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AK";
}

function dateInput(value: unknown) {
  const raw = asString(value);
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: unknown) {
  const raw = asString(value);
  if (!raw) return "Belum ditentukan";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function relativeTime(value: unknown) {
  const raw = asString(value);
  if (!raw) return "baru saja";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.round(diffMs / 60000));
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `dikirim ${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `dikirim ${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days === 1) return "dikirim kemarin";
  return `dikirim ${days} hari lalu`;
}

function statusLabel(status: string) {
  if (status === "process") return "Sedang Berjalan";
  if (status === "finish") return "Selesai";
  return "Belum Dimulai";
}

function discussionStatus(row: DbRow) {
  const status = asString(row.status, "pending");
  if (status === "process") return { label: "Sedang Berjalan", className: "text-ktr-info", primary: true };
  if (status === "finish") return { label: "Selesai", className: "text-ktr-primary", primary: false };
  return { label: "Menunggu", className: "text-ktr-project-revision", primary: false };
}

const fallback: StudentGroupOverview = {
  project: {
    title: "Landing Page UMKM",
    className: "XI - Desain Web",
    dueDate: "25 Juni 2026",
    status: "Belum Dimulai",
  },
  members: [
    { id: "1", name: "Alya Putri Ramadhani", role: "Ketua", initials: "AP", avatarClass: avatarClasses[0] },
    { id: "2", name: "Bima Aditya Pratama", role: "Anggota", initials: "BA", avatarClass: avatarClasses[1] },
    { id: "3", name: "Raka Maulana Yusuf", role: "Anggota", initials: "RM", avatarClass: avatarClasses[2] },
    { id: "4", name: "Nadia Safira Lestari", role: "Anggota", initials: "NS", avatarClass: avatarClasses[3] },
  ],
  progress: [
    { text: "Membuat draft tampilan awal untuk bagian hero landing page.", author: "Bima A.", time: "dikirim 5 menit lalu", avatarClass: avatarClasses[1] },
    { text: "Menambahkan teks awal untuk bagian produk unggulan.", author: "Raka M.", time: "dikirim 1 jam lalu", avatarClass: avatarClasses[2] },
    { text: "Mengunggah bukti pengerjaan layout halaman kontak.", author: "Nadia S.", time: "dikirim kemarin", avatarClass: avatarClasses[3] },
    { text: "Menyusun daftar kebutuhan aset gambar dan ikon produk.", author: "Alya P.", time: "dikirim kemarin", avatarClass: avatarClasses[0] },
    { text: "Merapikan copywriting untuk bagian testimoni pelanggan.", author: "Bima A.", time: "dikirim 2 hari lalu", avatarClass: avatarClasses[1] },
    { text: "Mengecek konsistensi spacing untuk versi mobile.", author: "Raka M.", time: "dikirim 2 hari lalu", avatarClass: avatarClasses[2] },
  ],
  discussions: [
    { title: "Pembahasan Konsep Landing Page", status: "Sedang Berjalan", statusClass: "text-ktr-info", messages: "4 pesan", meta: "Terakhir 10 menit lalu", primary: true, unreadCount: 1 },
    { title: "Tinjauan Konten Produk", status: "Menunggu Umpan Balik Anggota", statusClass: "text-ktr-project-revision", messages: "3 pesan", meta: "Menunggu 1 anggota", requiresPeerAssessment: true },
    { title: "Revisi Tampilan Kontak", status: "Selesai", statusClass: "text-ktr-primary", messages: "2 pesan", meta: "Semua anggota sudah memberi umpan balik" },
  ],
};

export async function getStudentGroupOverview(): Promise<StudentGroupOverview> {
  const { data: groups, error: groupError } = await supabaseAdmin
    .from("project_group")
    .select("id,id_project,name,progres,created_at")
    .order("created_at", { ascending: true })
    .limit(1);

  if (groupError) return fallback;
  const group = asRows(groups)[0];
  const groupId = asNumberId(group?.id);
  const projectId = asNumberId(group?.id_project);
  if (!group || groupId === null || projectId === null) return fallback;

  const [{ data: projectData }, { data: membersData }, { data: discussionsData }] = await Promise.all([
    supabaseAdmin.from("project").select("id,title,description,due_date").eq("id", projectId).maybeSingle(),
    supabaseAdmin.from("group_member").select("id,id_user,role,created_at").eq("id_project_group", groupId).order("created_at", { ascending: true }),
    supabaseAdmin.from("discussion_session").select("id,title,status,date,created_at").eq("id_project_group", groupId).order("created_at", { ascending: false }),
  ]);

  const memberRows = asRows(membersData);
  const memberUserIds = memberRows.map((row) => asNumberId(row.id_user)).filter((id): id is number => id !== null);
  const { data: usersData } = memberUserIds.length
    ? await supabaseAdmin.from("users").select("id,username,email").in("id", memberUserIds)
    : { data: [] };
  const users = new Map(asRows(usersData).map((row) => [asNumberId(row.id), row]));

  const discussionRows = asRows(discussionsData);
  const discussionIds = discussionRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: progressData } = discussionIds.length
    ? await supabaseAdmin.from("progress_discussion").select("id,id_discussion_session,id_user,document,description,created_at").in("id_discussion_session", discussionIds).order("created_at", { ascending: false })
    : { data: [] };
  const progressRows = asRows(progressData);
  const progressUserIds = progressRows.map((row) => asNumberId(row.id_user)).filter((id): id is number => id !== null);
  const { data: progressUsersData } = progressUserIds.length
    ? await supabaseAdmin.from("users").select("id,username,email").in("id", progressUserIds)
    : { data: [] };
  const progressUsers = new Map(asRows(progressUsersData).map((row) => [asNumberId(row.id), row]));

  const project = projectData && typeof projectData === "object" && !Array.isArray(projectData) ? projectData as DbRow : {};
  const members = memberRows.map((row, index) => {
    const user = users.get(asNumberId(row.id_user)) ?? {};
    const name = asString(user.username, asString(user.email, `Anggota ${index + 1}`));
    return {
      id: String(asNumberId(row.id) ?? index),
      name,
      role: asString(row.role) === "leader" ? "Ketua" as const : "Anggota" as const,
      initials: initials(name),
      avatarClass: avatarClasses[index % avatarClasses.length],
    };
  });

  return {
    project: {
      title: asString(project.title, fallback.project.title),
      className: asString(group.name, fallback.project.className),
      dueDate: formatDate(project.due_date),
      status: statusLabel(asString(group.progres, "process")),
    },
    members: members.length ? members : fallback.members,
    progress: progressRows.length ? progressRows.map((row, index) => {
      const user = progressUsers.get(asNumberId(row.id_user)) ?? {};
      const author = asString(user.username, `Anggota ${index + 1}`);
      return {
        text: asString(row.description, asString(row.document, "Mengunggah progres proyek.")),
        author,
        time: relativeTime(row.created_at),
        avatarClass: avatarClasses[index % avatarClasses.length],
      };
    }) : fallback.progress,
    discussions: discussionRows.length ? discussionRows.map((row) => {
      const status = discussionStatus(row);
      return {
        title: asString(row.title, "Diskusi Kelompok"),
        status: status.label,
        statusClass: status.className,
        messages: "0 pesan",
        meta: relativeTime(row.created_at),
        primary: status.primary,
      };
    }) : fallback.discussions,
  };
}

export type TeacherProjectCard = {
  id: string;
  name: string;
  className: string;
  status: "Aktif" | "Akan Datang" | "Selesai" | "Diarsipkan";
  startDate: string;
  finalDeadline: string;
  dueDateInput: string;
  description: string;
  groups: number;
  students: number;
  individualUploads: number;
  pendingUploadReviews: number;
  pendingFinalReviews: number;
  inactiveGroups: number;
  announcement?: string;
};

function teacherProjectStatus(dueDate: unknown): TeacherProjectCard["status"] {
  const raw = asString(dueDate);
  if (!raw) return "Aktif";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Aktif";
  return date.getTime() > Date.now() ? "Aktif" : "Selesai";
}

export async function getTeacherProjectCards(): Promise<TeacherProjectCard[]> {
  const { data: projectData, error } = await supabaseAdmin
    .from("project")
    .select("id,title,description,due_date,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const projectRows = asRows(projectData);

  const projectIds = projectRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: groupData } = projectIds.length
    ? await supabaseAdmin.from("project_group").select("id,id_project,name,progres,created_at").in("id_project", projectIds)
    : { data: [] };
  const groupRows = asRows(groupData);
  const groupIds = groupRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);

  const [{ data: memberData }, { data: discussionData }] = await Promise.all([
    groupIds.length ? supabaseAdmin.from("group_member").select("id_project_group,id_user").in("id_project_group", groupIds) : Promise.resolve({ data: [] }),
    groupIds.length ? supabaseAdmin.from("discussion_session").select("id,id_project_group,created_at").in("id_project_group", groupIds) : Promise.resolve({ data: [] }),
  ]);
  const memberRows = asRows(memberData);
  const discussionRows = asRows(discussionData);
  const discussionIds = discussionRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: progressData } = discussionIds.length
    ? await supabaseAdmin.from("progress_discussion").select("id,id_discussion_session,created_at").in("id_discussion_session", discussionIds)
    : { data: [] };
  const progressRows = asRows(progressData);

  return projectRows.map((project, index) => {
    const projectId = asNumberId(project.id);
    const projectGroups = groupRows.filter((group) => asNumberId(group.id_project) === projectId);
    const projectGroupIds = new Set(projectGroups.map((group) => asNumberId(group.id)).filter((id): id is number => id !== null));
    const projectMembers = memberRows.filter((member) => {
      const groupId = asNumberId(member.id_project_group);
      return groupId !== null && projectGroupIds.has(groupId);
    });
    const projectDiscussions = discussionRows.filter((discussion) => {
      const groupId = asNumberId(discussion.id_project_group);
      return groupId !== null && projectGroupIds.has(groupId);
    });
    const projectDiscussionIds = new Set(projectDiscussions.map((discussion) => asNumberId(discussion.id)).filter((id): id is number => id !== null));
    const projectProgress = progressRows.filter((progress) => {
      const discussionId = asNumberId(progress.id_discussion_session);
      return discussionId !== null && projectDiscussionIds.has(discussionId);
    });
    const uniqueStudents = new Set(projectMembers.map((member) => asNumberId(member.id_user)).filter((id): id is number => id !== null));

    return {
      id: String(projectId ?? index + 1),
      name: asString(project.title, `Proyek ${index + 1}`),
      className: projectGroups[0] ? asString(projectGroups[0].name, "Kelompok") : "Belum ada kelompok",
      status: teacherProjectStatus(project.due_date),
      startDate: formatDate(project.created_at),
      finalDeadline: formatDate(project.due_date),
      dueDateInput: dateInput(project.due_date),
      description: asString(project.description),
      groups: projectGroups.length,
      students: uniqueStudents.size,
      individualUploads: projectProgress.length,
      pendingUploadReviews: projectProgress.length,
      pendingFinalReviews: 0,
      inactiveGroups: projectGroups.filter((group) => asString(group.progres) !== "finish").length === 0 ? 0 : Math.max(0, projectGroups.length - projectDiscussions.length),
      announcement: asString(project.description) || undefined,
    };
  });
}

export type TeacherProjectMutationInput = {
  title?: string;
  className?: string;
  description?: string;
  dueDate?: string;
};

async function getPrimaryTeacherId() {
  const { data: teacherData, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("role", "guru")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const teacherId = asNumberId((teacherData as DbRow | null)?.id);
  if (teacherId !== null) return teacherId;

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("users")
    .insert({ username: "Guru KontriLab", email: "guru@kontrilab.local", role: "guru", password: "dummy-password" })
    .select("id")
    .single();

  if (insertError) throw insertError;
  const insertedId = asNumberId((inserted as DbRow | null)?.id);
  if (insertedId === null) throw new Error("Gagal membuat akun guru default.");
  return insertedId;
}

function normalizeDueDate(value: unknown) {
  const raw = asString(value);
  return raw ? raw : null;
}

export async function createTeacherProject(input: TeacherProjectMutationInput): Promise<TeacherProjectCard[]> {
  const title = asString(input.title).trim();
  if (!title) throw new Error("Judul proyek wajib diisi.");

  const teacherId = await getPrimaryTeacherId();
  const { data: projectData, error } = await supabaseAdmin
    .from("project")
    .insert({
      user_id: teacherId,
      title,
      description: asString(input.description).trim() || null,
      due_date: normalizeDueDate(input.dueDate),
    })
    .select("id")
    .single();

  if (error) throw error;
  const projectId = asNumberId((projectData as DbRow | null)?.id);
  if (projectId === null) throw new Error("Proyek berhasil dibuat, tetapi ID tidak ditemukan.");

  const groupName = asString(input.className).trim();
  if (groupName) {
    const { error: groupError } = await supabaseAdmin
      .from("project_group")
      .insert({ id_project: projectId, name: groupName, progres: "process" });
    if (groupError) throw groupError;
  }

  return getTeacherProjectCards();
}

export async function updateTeacherProject(id: string, input: TeacherProjectMutationInput): Promise<TeacherProjectCard[]> {
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) throw new Error("ID proyek tidak valid.");

  const updatePayload: DbRow = {};
  if (input.title !== undefined) {
    const title = asString(input.title).trim();
    if (!title) throw new Error("Judul proyek wajib diisi.");
    updatePayload.title = title;
  }
  if (input.description !== undefined) updatePayload.description = asString(input.description).trim() || null;
  if (input.dueDate !== undefined) updatePayload.due_date = normalizeDueDate(input.dueDate);

  if (Object.keys(updatePayload).length > 0) {
    const { error } = await supabaseAdmin.from("project").update(updatePayload).eq("id", projectId);
    if (error) throw error;
  }

  if (input.className !== undefined) {
    const groupName = asString(input.className).trim();
    const { data: existingGroups, error: groupReadError } = await supabaseAdmin
      .from("project_group")
      .select("id")
      .eq("id_project", projectId)
      .order("created_at", { ascending: true })
      .limit(1);
    if (groupReadError) throw groupReadError;
    const firstGroup = asRows(existingGroups)[0];
    const groupId = asNumberId(firstGroup?.id);

    if (groupId !== null) {
      const { error: groupUpdateError } = await supabaseAdmin.from("project_group").update({ name: groupName || "Kelompok" }).eq("id", groupId);
      if (groupUpdateError) throw groupUpdateError;
    } else if (groupName) {
      const { error: groupInsertError } = await supabaseAdmin.from("project_group").insert({ id_project: projectId, name: groupName, progres: "process" });
      if (groupInsertError) throw groupInsertError;
    }
  }

  return getTeacherProjectCards();
}

export async function duplicateTeacherProject(id: string): Promise<TeacherProjectCard[]> {
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) throw new Error("ID proyek tidak valid.");

  const { data: projectData, error } = await supabaseAdmin
    .from("project")
    .select("title,description,due_date,user_id")
    .eq("id", projectId)
    .single();
  if (error) throw error;

  const source = projectData as DbRow;
  const teacherId = asNumberId(source.user_id) ?? await getPrimaryTeacherId();
  const { data: newProjectData, error: insertError } = await supabaseAdmin
    .from("project")
    .insert({
      user_id: teacherId,
      title: `Salinan ${asString(source.title, "Proyek")}`,
      description: asString(source.description).trim() || null,
      due_date: normalizeDueDate(source.due_date),
    })
    .select("id")
    .single();
  if (insertError) throw insertError;

  const newProjectId = asNumberId((newProjectData as DbRow | null)?.id);
  if (newProjectId === null) throw new Error("Duplikasi proyek gagal.");

  const { data: groupsData, error: groupsError } = await supabaseAdmin
    .from("project_group")
    .select("name,icon,progres")
    .eq("id_project", projectId);
  if (groupsError) throw groupsError;

  const groups = asRows(groupsData).map((group) => ({
    id_project: newProjectId,
    name: asString(group.name, "Kelompok"),
    icon: asString(group.icon) || null,
    progres: asString(group.progres, "process"),
  }));

  if (groups.length) {
    const { error: groupInsertError } = await supabaseAdmin.from("project_group").insert(groups);
    if (groupInsertError) throw groupInsertError;
  }

  return getTeacherProjectCards();
}

export async function deleteTeacherProject(id: string): Promise<TeacherProjectCard[]> {
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) throw new Error("ID proyek tidak valid.");
  const { error } = await supabaseAdmin.from("project").delete().eq("id", projectId);
  if (error) throw error;
  return getTeacherProjectCards();
}

