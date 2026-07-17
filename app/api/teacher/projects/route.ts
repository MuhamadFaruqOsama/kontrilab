import { NextRequest, NextResponse } from "next/server";

import { AppRole, parseAuthSession } from "@/lib/auth/session";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PAGE_SIZE = 6;

type DbRow = Record<string, unknown>;

type TeacherProjectCard = {
  id: string;
  name: string;
  className: string;
  title: string;
  description: string;
  deadline: string | null;
  deadlineLabel: string;
  finalDeadline: string;
  startDate: string;
  fileName: string | null;
  createdAt: string;
  status: "Aktif" | "Selesai" | "Diarsipkan";
  groups: number;
  finishedGroups: number;
  students: number;
  individualUploads: number;
  pendingUploadReviews: number;
  pendingFinalReviews: number;
  inactiveGroups: number;
  announcement?: string;
};

function asRows(value: unknown): DbRow[] {
  return Array.isArray(value) ? value.filter((item): item is DbRow => item !== null && typeof item === "object" && !Array.isArray(item)) : [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumberId(value: unknown): number | null {
  return typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : null;
}

function toDateInput(value: unknown) {
  const raw = asString(value);
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function formatDate(value: unknown) {
  const raw = asString(value);
  if (!raw) return "Belum ditentukan";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function getAuthSession(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return parseAuthSession(request.cookies.get("kontrilab-auth")?.value ?? null);
}

async function resolveAuthUser(request: NextRequest) {
  const authValue = getAuthSession(request);

  if (!authValue) return null;

  if (typeof authValue === "string") {
    const { data, error } = await supabaseAdmin.auth.getUser(authValue);
    if (error || !data.user) return null;

    const roleCandidate = data.user.app_metadata?.role ?? data.user.user_metadata?.role;
    return {
      email: data.user.email ?? "",
      userId: data.user.id,
      authRole: typeof roleCandidate === "string" && roleCandidate.toLowerCase() === "guru" ? AppRole.GURU : AppRole.SISWA,
    };
  }

  return {
    ...authValue,
    authRole: authValue.role,
  };
}

async function resolveTeacherUserId(email: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  const row = data as DbRow | null;
  const userId = asNumberId(row?.id);
  return userId;
}

async function resolvePrimaryTeacherId() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("role", "guru")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return asNumberId((data as DbRow | null)?.id);
}

async function getMergedProjectIds() {
  const { data, error } = await supabaseAdmin.from("merged_project").select("id_project");
  if (error) throw error;
  return new Set(asRows(data).map((row) => asNumberId(row.id_project)).filter((id): id is number => id !== null));
}

async function getProjectPage(userId: number, page: number, mergedProjectIds: Set<number>) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;
  const excludedIds = Array.from(mergedProjectIds);

  let projectQuery = supabaseAdmin
    .from("project")
    .select("id,title,description,due_date,file,created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (excludedIds.length) {
    projectQuery = projectQuery.not("id", "in", `(${excludedIds.join(",")})`);
  }

  const { data: projectData, error, count } = await projectQuery.range(start, end);

  if (error) throw error;
  const projectRows = asRows(projectData);
  const projectIds = projectRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);

  const { data: groupData } = projectIds.length
    ? await supabaseAdmin.from("project_group").select("id,id_project,progres").in("id_project", projectIds)
    : { data: [] as unknown[] };
  const groupRows = asRows(groupData);
  const groupIds = groupRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: memberData } = groupIds.length
    ? await supabaseAdmin.from("group_member").select("id_project_group,id_user").in("id_project_group", groupIds)
    : { data: [] as unknown[] };
  const memberRows = asRows(memberData);
  const { data: discussionData } = groupIds.length
    ? await supabaseAdmin.from("discussion_session").select("id,id_project_group").in("id_project_group", groupIds)
    : { data: [] as unknown[] };
  const discussionRows = asRows(discussionData);
  const discussionIds = discussionRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: progressData } = discussionIds.length
    ? await supabaseAdmin.from("progress_discussion").select("id,id_discussion_session").in("id_discussion_session", discussionIds)
    : { data: [] as unknown[] };
  const progressRows = asRows(progressData);

  const projects: TeacherProjectCard[] = projectRows.map((project) => {
    const projectId = asNumberId(project.id);
    const projectGroups = groupRows.filter((group) => asNumberId(group.id_project) === projectId);
    const groupIdsForProject = new Set(
      projectGroups.map((group) => asNumberId(group.id)).filter((id): id is number => id !== null),
    );
    const finishedGroups = projectGroups.filter((group) => asString(group.progres) === "finish").length;
    const projectDiscussionIds = new Set(
      discussionRows
        .filter((discussion) => {
          const groupId = asNumberId(discussion.id_project_group);
          return groupId !== null && groupIdsForProject.has(groupId);
        })
        .map((discussion) => asNumberId(discussion.id))
        .filter((id): id is number => id !== null),
    );
    const projectProgress = progressRows.filter((progress) => {
      const discussionId = asNumberId(progress.id_discussion_session);
      return discussionId !== null && projectDiscussionIds.has(discussionId);
    });
    const uniqueStudents = new Set(
      memberRows
        .filter((member) => {
          const groupId = asNumberId(member.id_project_group);
          return groupId !== null && groupIdsForProject.has(groupId);
        })
        .map((member) => asNumberId(member.id_user))
        .filter((id): id is number => id !== null),
    );

    const deadline = toDateInput(project.due_date);
    const isFinished = Boolean(deadline) && new Date(`${deadline}T23:59:59`).getTime() < Date.now();

    return {
      id: String(projectId ?? project.id ?? ""),
      name: asString(project.title, "Proyek"),
      className: projectGroups[0] ? asString(projectGroups[0].name, "Kelompok") : "Belum ada kelompok",
      title: asString(project.title, "Proyek"),
      description: asString(project.description, "Belum ada deskripsi."),
      deadline,
      deadlineLabel: formatDate(project.due_date),
      finalDeadline: formatDate(project.due_date),
      startDate: formatDate(project.created_at),
      fileName: asString(project.file) || null,
      createdAt: formatDate(project.created_at),
      status: isFinished ? "Selesai" : "Aktif",
      groups: projectGroups.length,
      finishedGroups,
      students: uniqueStudents.size,
      individualUploads: projectProgress.length,
      pendingUploadReviews: projectProgress.length,
      pendingFinalReviews: 0,
      inactiveGroups: projectGroups.filter((group) => asString(group.progres) !== "finish").length === 0 ? 0 : Math.max(0, projectGroups.length - finishedGroups),
      announcement: asString(project.description) || undefined,
    };
  });

  return {
    projects,
    page,
    pageSize: PAGE_SIZE,
    totalItems: projectRows.length + Math.max(0, (count ?? 0) - asRows(projectData).length),
    totalPages: Math.max(1, Math.ceil((projectRows.length + Math.max(0, (count ?? 0) - asRows(projectData).length)) / PAGE_SIZE)),
  };
}

async function getProjectDetail(userId: number, projectId: number) {
  const { data: projectData, error } = await supabaseAdmin
    .from("project")
    .select("id,title,description,due_date,file,created_at")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!projectData) return null;

  const project = asRows([projectData])[0];
  const { data: groupData } = await supabaseAdmin.from("project_group").select("id,id_project").eq("id_project", projectId);
  const groupRows = asRows(groupData);
  const groupIds = groupRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: memberData } = groupIds.length
    ? await supabaseAdmin.from("group_member").select("id_project_group,id_user").in("id_project_group", groupIds)
    : { data: [] as unknown[] };
  const memberRows = asRows(memberData);
  const { data: discussionData } = groupIds.length
    ? await supabaseAdmin.from("discussion_session").select("id,id_project_group").in("id_project_group", groupIds)
    : { data: [] as unknown[] };
  const discussionRows = asRows(discussionData);
  const discussionIds = discussionRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: progressData } = discussionIds.length
    ? await supabaseAdmin.from("progress_discussion").select("id,id_discussion_session").in("id_discussion_session", discussionIds)
    : { data: [] as unknown[] };
  const progressRows = asRows(progressData);

  const deadline = toDateInput(project.due_date);
  const isFinished = Boolean(deadline) && new Date(`${deadline}T23:59:59`).getTime() < Date.now();
  const finishedGroups = groupRows.filter((group) => asString(group.progres) === "finish").length;
  const projectProgress = progressRows.filter((progress) => {
    const discussionId = asNumberId(progress.id_discussion_session);
    return discussionId !== null && discussionIds.includes(discussionId);
  });

  return {
    id: String(projectId),
    name: asString(project.title, "Proyek"),
    className: groupRows[0] ? asString(groupRows[0].name, "Kelompok") : "Belum ada kelompok",
    title: asString(project.title, "Proyek"),
    description: asString(project.description, "Belum ada deskripsi."),
    deadline,
    deadlineLabel: formatDate(project.due_date),
    finalDeadline: formatDate(project.due_date),
    startDate: formatDate(project.created_at),
    fileName: asString(project.file) || null,
    createdAt: formatDate(project.created_at),
    status: isFinished ? "Selesai" : "Aktif",
    groups: groupRows.length,
    finishedGroups,
    students: new Set(
      memberRows
        .map((member) => asNumberId(member.id_user))
        .filter((id): id is number => id !== null),
    ).size,
    individualUploads: projectProgress.length,
    pendingUploadReviews: projectProgress.length,
    pendingFinalReviews: 0,
    inactiveGroups: groupRows.filter((group) => asString(group.progres) !== "finish").length === 0 ? 0 : Math.max(0, groupRows.length - finishedGroups),
    announcement: asString(project.description) || undefined,
  } satisfies TeacherProjectCard;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Teacher projects API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const session = await resolveAuthUser(request);
    if (!session) return NextResponse.json({ error: "Sesi login tidak ditemukan." }, { status: 401 });
    const teacherId = (await resolveTeacherUserId(session.email)) ?? await resolvePrimaryTeacherId();
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const mergedProjectIds = await getMergedProjectIds();

    if (request.nextUrl.searchParams.get("options") === "1") {
      let optionsQuery = supabaseAdmin
        .from("project")
        .select("id,title,due_date,created_at")
        .eq("user_id", teacherId)
        .order("created_at", { ascending: false });
      const optionIds = Array.from(mergedProjectIds);
      if (optionIds.length) {
        optionsQuery = optionsQuery.not("id", "in", `(${optionIds.join(",")})`);
      }
      const { data: projectData, error } = await optionsQuery;
      if (error) throw error;
      const projects = asRows(projectData)
        .filter((project) => {
          const projectId = asNumberId(project.id);
          return projectId === null || !mergedProjectIds.has(projectId);
        })
        .map((project) => ({
          id: String(asNumberId(project.id) ?? project.id),
          title: asString(project.title, "Proyek"),
          deadlineLabel: formatDate(project.due_date),
        }));
      return NextResponse.json({ projects });
    }

    const projectIdParam = request.nextUrl.searchParams.get("id");
    if (projectIdParam) {
      const projectId = Number(projectIdParam);
      if (!Number.isFinite(projectId)) {
        return NextResponse.json({ error: "ID proyek tidak valid." }, { status: 400 });
      }

      const project = await getProjectDetail(teacherId, projectId);
      if (!project) return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
      return NextResponse.json({ project });
    }

    const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1");
    const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
    const payload = await getProjectPage(teacherId, page, mergedProjectIds);
    return NextResponse.json(payload);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await resolveAuthUser(request);
    if (!session) return NextResponse.json({ error: "Sesi login tidak ditemukan." }, { status: 401 });
    const teacherId = (await resolveTeacherUserId(session.email)) ?? await resolvePrimaryTeacherId();
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const title = asString(body?.title).trim();
    const description = asString(body?.description).trim();
    const deadline = asString(body?.deadline).trim() || null;
    const fileName = asString(body?.fileName).trim() || null;

    if (!title) {
      return NextResponse.json({ error: "Judul proyek wajib diisi." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("project").insert({
      user_id: teacherId,
      title,
      description: description || null,
      due_date: deadline,
      file: fileName,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await resolveAuthUser(request);
    if (!session) return NextResponse.json({ error: "Sesi login tidak ditemukan." }, { status: 401 });
    const teacherId = (await resolveTeacherUserId(session.email)) ?? await resolvePrimaryTeacherId();
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const id = Number(body?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "ID proyek wajib dikirim." }, { status: 400 });
    }

    const updatePayload: DbRow = {};
    if (body?.title !== undefined) {
      const title = asString(body?.title).trim();
      if (!title) return NextResponse.json({ error: "Judul proyek wajib diisi." }, { status: 400 });
      updatePayload.title = title;
    }
    if (body?.description !== undefined) updatePayload.description = asString(body?.description).trim() || null;
    if (body?.deadline !== undefined) updatePayload.due_date = asString(body?.deadline).trim() || null;
    if (body?.fileName !== undefined) updatePayload.file = asString(body?.fileName).trim() || null;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "Tidak ada perubahan untuk disimpan." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("project")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", teacherId);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await resolveAuthUser(request);
    if (!session) return NextResponse.json({ error: "Sesi login tidak ditemukan." }, { status: 401 });
    const teacherId = (await resolveTeacherUserId(session.email)) ?? await resolvePrimaryTeacherId();
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const id = Number(request.nextUrl.searchParams.get("id"));
    if (!Number.isFinite(id)) return NextResponse.json({ error: "ID proyek wajib dikirim." }, { status: 400 });

    const { error } = await supabaseAdmin.from("project").delete().eq("id", id).eq("user_id", teacherId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
