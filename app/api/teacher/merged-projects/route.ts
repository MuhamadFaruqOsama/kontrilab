import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PAGE_SIZE = 6;

type DbRow = Record<string, unknown>;

type MergeProjectItem = {
  id: string;
  title: string;
  className: string;
  status: "Aktif" | "Selesai";
  deadlineLabel: string;
  groups: number;
  finishedGroups: number;
  students: number;
};

type MergeCard = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  projectCount: number;
  groupCount: number;
  finishedGroups: number;
  students: number;
  projectIds: string[];
  projects: MergeProjectItem[];
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

function formatDate(value: unknown) {
  const raw = asString(value);
  if (!raw) return "Belum ditentukan";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function toDateInput(value: unknown) {
  const raw = asString(value);
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function authTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice("Bearer ".length).trim();
  return null;
}

async function resolveTeacherId(request: NextRequest) {
  const token = authTokenFromRequest(request);
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const email = data.user.email ?? "";
  if (!email) return null;

  const { data: teacherRow, error: teacherError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (teacherError) throw teacherError;
  return asNumberId((teacherRow as DbRow | null)?.id);
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

function parseProjectIds(value: unknown) {
  const ids = Array.isArray(value) ? value : [];
  return Array.from(new Set(ids.map((item) => asNumberId(item)).filter((id): id is number => id !== null)));
}

async function getMergeCardMap(mergeRows: DbRow[]) {
  const mergeIds = mergeRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  if (!mergeIds.length) return new Map<number, MergeCard>();

  const { data: mergedProjectData } = await supabaseAdmin.from("merged_project").select("id_merge,id_project,created_at").in("id_merge", mergeIds);
  const mergedRows = asRows(mergedProjectData);
  const projectIds = mergedRows.map((row) => asNumberId(row.id_project)).filter((id): id is number => id !== null);

  const [{ data: projectsData }, { data: groupsData }] = await Promise.all([
    projectIds.length
      ? supabaseAdmin.from("project").select("id,title,description,due_date,created_at").in("id", projectIds)
      : Promise.resolve({ data: [] as unknown[] }),
    projectIds.length
      ? supabaseAdmin.from("project_group").select("id,id_project,name,progres").in("id_project", projectIds)
      : Promise.resolve({ data: [] as unknown[] }),
  ]);

  const projectRows = asRows(projectsData);
  const groupRows = asRows(groupsData);
  const groupIds = groupRows.map((row) => asNumberId(row.id)).filter((id): id is number => id !== null);
  const { data: membersData } = groupIds.length
    ? await supabaseAdmin.from("group_member").select("id_project_group,id_user").in("id_project_group", groupIds)
    : { data: [] as unknown[] };
  const memberRows = asRows(membersData);

  const projectById = new Map<number, DbRow>();
  for (const row of projectRows) {
    const id = asNumberId(row.id);
    if (id !== null) projectById.set(id, row);
  }

  const groupsByProject = new Map<number, DbRow[]>();
  for (const row of groupRows) {
    const projectId = asNumberId(row.id_project);
    if (projectId === null) continue;
    const list = groupsByProject.get(projectId) ?? [];
    list.push(row);
    groupsByProject.set(projectId, list);
  }

  const membersByGroup = new Map<number, DbRow[]>();
  for (const row of memberRows) {
    const groupId = asNumberId(row.id_project_group);
    if (groupId === null) continue;
    const list = membersByGroup.get(groupId) ?? [];
    list.push(row);
    membersByGroup.set(groupId, list);
  }

  const mergeMap = new Map<number, MergeCard>();

  for (const mergeRow of mergeRows) {
    const mergeId = asNumberId(mergeRow.id);
    if (mergeId === null) continue;

    const rowsForMerge = mergedRows.filter((row) => asNumberId(row.id_merge) === mergeId);
    const mergedProjectIds = rowsForMerge.map((row) => asNumberId(row.id_project)).filter((id): id is number => id !== null);
    const projects = mergedProjectIds
      .map((projectId) => {
        const project = projectById.get(projectId);
        if (!project) return null;
        const groups = groupsByProject.get(projectId) ?? [];
        const finishedGroups = groups.filter((group) => asString(group.progres) === "finish").length;
        const groupIds = new Set(groups.map((group) => asNumberId(group.id)).filter((id): id is number => id !== null));
        const students = new Set(
          memberRows
            .filter((member) => {
              const groupId = asNumberId(member.id_project_group);
              return groupId !== null && groupIds.has(groupId);
            })
            .map((member) => asNumberId(member.id_user))
            .filter((id): id is number => id !== null),
        ).size;

        const deadline = toDateInput(project.due_date);
        const status = deadline && new Date(`${deadline}T23:59:59`).getTime() < Date.now() ? "Selesai" : "Aktif";

        return {
          id: String(projectId),
          title: asString(project.title, "Proyek"),
          className: groups[0] ? asString(groups[0].name, "Kelompok") : "Belum ada kelompok",
          status,
          deadlineLabel: formatDate(project.due_date),
          groups: groups.length,
          finishedGroups,
          students,
        } satisfies MergeProjectItem;
      })
      .filter((item): item is MergeProjectItem => item !== null);

    const groupCount = projects.reduce((total, item) => total + item.groups, 0);
    const finishedGroups = projects.reduce((total, item) => total + item.finishedGroups, 0);
    const studentIds = new Set<number>();
    for (const project of projects) {
      const groups = groupsByProject.get(Number(project.id)) ?? [];
      for (const group of groups) {
        const groupId = asNumberId(group.id);
        if (groupId === null) continue;
        for (const member of membersByGroup.get(groupId) ?? []) {
          const userId = asNumberId(member.id_user);
          if (userId !== null) studentIds.add(userId);
        }
      }
    }

    mergeMap.set(mergeId, {
      id: String(mergeId),
      title: asString(mergeRow.title, "Gabungan Proyek"),
      description: asString(mergeRow.description, ""),
      createdAt: formatDate(mergeRow.created_at),
      projectCount: projects.length,
      groupCount,
      finishedGroups,
      students: studentIds.size,
      projectIds: projects.map((project) => project.id),
      projects,
    });
  }

  return mergeMap;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal Server Error";
  console.error("Teacher merged projects API error:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const teacherId = (await resolveTeacherId(request)) ?? (await resolvePrimaryTeacherId());
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const projectIdParam = request.nextUrl.searchParams.get("id");
    if (projectIdParam) {
      const mergeId = Number(projectIdParam);
      if (!Number.isFinite(mergeId)) {
        return NextResponse.json({ error: "ID gabungan proyek tidak valid." }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from("merge")
        .select("id,title,description,created_at")
        .eq("id", mergeId)
        .eq("user_id", teacherId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: "Gabungan proyek tidak ditemukan." }, { status: 404 });

      const mergeMap = await getMergeCardMap([data as DbRow]);
      const merge = mergeMap.get(mergeId);
      if (!merge) return NextResponse.json({ error: "Gabungan proyek tidak ditemukan." }, { status: 404 });
      return NextResponse.json({ merge });
    }

    const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "1");
    const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data: mergeData, error, count } = await supabaseAdmin
      .from("merge")
      .select("id,title,description,created_at", { count: "exact" })
      .eq("user_id", teacherId)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;
    const mergeRows = asRows(mergeData);
    const mergeMap = await getMergeCardMap(mergeRows);

    return NextResponse.json({
      merges: mergeRows.map((row) => mergeMap.get(asNumberId(row.id) ?? -1)).filter((item): item is MergeCard => Boolean(item)),
      page,
      pageSize: PAGE_SIZE,
      totalItems: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const teacherId = (await resolveTeacherId(request)) ?? (await resolvePrimaryTeacherId());
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const title = asString(body?.title).trim();
    const description = asString(body?.description).trim();
    const projectIds = parseProjectIds(body?.projectIds);

    if (!title) return NextResponse.json({ error: "Judul gabungan proyek wajib diisi." }, { status: 400 });
    if (!projectIds.length) return NextResponse.json({ error: "Minimal satu proyek harus dipilih." }, { status: 400 });

    const { data: ownedProjects, error: ownedError } = await supabaseAdmin
      .from("project")
      .select("id")
      .eq("user_id", teacherId)
      .in("id", projectIds);
    if (ownedError) throw ownedError;
    if (asRows(ownedProjects).length !== projectIds.length) {
      return NextResponse.json({ error: "Ada proyek yang tidak valid atau bukan milik guru ini." }, { status: 400 });
    }

    const { data: alreadyMerged, error: mergedError } = await supabaseAdmin
      .from("merged_project")
      .select("id_project")
      .in("id_project", projectIds);
    if (mergedError) throw mergedError;
    if (asRows(alreadyMerged).length) {
      return NextResponse.json({ error: "Ada proyek yang sudah tergabung di gabungan lain." }, { status: 400 });
    }

    const { data: mergeData, error } = await supabaseAdmin
      .from("merge")
      .insert({ user_id: teacherId, title, description: description || null })
      .select("id")
      .single();
    if (error) throw error;

    const mergeId = asNumberId((mergeData as DbRow | null)?.id);
    if (mergeId === null) return NextResponse.json({ error: "Gabungan proyek gagal dibuat." }, { status: 500 });

    const { error: mergeProjectError } = await supabaseAdmin.from("merged_project").insert(
      projectIds.map((projectId) => ({ id_merge: mergeId, id_project: projectId })),
    );
    if (mergeProjectError) throw mergeProjectError;

    return NextResponse.json({ ok: true, mergeId: String(mergeId) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const teacherId = (await resolveTeacherId(request)) ?? (await resolvePrimaryTeacherId());
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const mergeId = Number(body?.id);
    if (!Number.isFinite(mergeId)) return NextResponse.json({ error: "ID gabungan proyek wajib dikirim." }, { status: 400 });

    const { data: mergeData, error: mergeReadError } = await supabaseAdmin
      .from("merge")
      .select("id")
      .eq("id", mergeId)
      .eq("user_id", teacherId)
      .maybeSingle();
    if (mergeReadError) throw mergeReadError;
    if (!mergeData) return NextResponse.json({ error: "Gabungan proyek tidak ditemukan." }, { status: 404 });

    const updatePayload: DbRow = {};
    if (body?.title !== undefined) {
      const title = asString(body?.title).trim();
      if (!title) return NextResponse.json({ error: "Judul gabungan proyek wajib diisi." }, { status: 400 });
      updatePayload.title = title;
    }
    if (body?.description !== undefined) updatePayload.description = asString(body?.description).trim() || null;

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabaseAdmin.from("merge").update(updatePayload).eq("id", mergeId).eq("user_id", teacherId);
      if (error) throw error;
    }

    if (body?.projectIds !== undefined) {
      const projectIds = parseProjectIds(body?.projectIds);
      if (!projectIds.length) return NextResponse.json({ error: "Minimal satu proyek harus dipilih." }, { status: 400 });

      const { data: ownedProjects, error: ownedError } = await supabaseAdmin
        .from("project")
        .select("id")
        .eq("user_id", teacherId)
        .in("id", projectIds);
      if (ownedError) throw ownedError;
      if (asRows(ownedProjects).length !== projectIds.length) {
        return NextResponse.json({ error: "Ada proyek yang tidak valid atau bukan milik guru ini." }, { status: 400 });
      }

      const { data: alreadyMerged, error: mergedError } = await supabaseAdmin
        .from("merged_project")
        .select("id_project,id_merge")
        .in("id_project", projectIds);
      if (mergedError) throw mergedError;
      const conflictRows = asRows(alreadyMerged).filter((row) => asNumberId(row.id_merge) !== mergeId);
      if (conflictRows.length) {
        return NextResponse.json({ error: "Ada proyek yang sudah tergabung di gabungan lain." }, { status: 400 });
      }

      const { error: deleteError } = await supabaseAdmin.from("merged_project").delete().eq("id_merge", mergeId);
      if (deleteError) throw deleteError;

      const { error: insertError } = await supabaseAdmin.from("merged_project").insert(
        projectIds.map((projectId) => ({ id_merge: mergeId, id_project: projectId })),
      );
      if (insertError) throw insertError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const teacherId = (await resolveTeacherId(request)) ?? (await resolvePrimaryTeacherId());
    if (!teacherId) return NextResponse.json({ error: "Akun guru tidak ditemukan." }, { status: 404 });

    const idParam = request.nextUrl.searchParams.get("id");
    const mergeId = Number(idParam);
    if (!Number.isFinite(mergeId)) return NextResponse.json({ error: "ID gabungan proyek wajib dikirim." }, { status: 400 });

    const { error } = await supabaseAdmin.from("merge").delete().eq("id", mergeId).eq("user_id", teacherId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
