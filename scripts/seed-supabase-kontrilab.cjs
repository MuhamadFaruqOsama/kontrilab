const fs = require("node:fs");
const { createClient } = require("@supabase/supabase-js");

function readEnv() {
  const text = fs.readFileSync(".env", "utf8").replace(/^\uFEFF/, "");
  return Object.fromEntries(text.split(/\r?\n/).filter((line) => line && !line.startsWith("#") && line.includes("=")).map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
  }));
}

const env = readEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function firstBy(table, filters) {
  let query = supabase.from(table).select("*").limit(1);
  for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

async function ensure(table, filters, payload) {
  const existing = await firstBy(table, filters);
  if (existing) return existing;
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

const users = [
  { username: "Bu Ratna", email: "ratna@guru.kontrilab.local", role: "guru", password: "dummy-password" },
  { username: "Alya Putri Ramadhani", email: "alya@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Bima Aditya Pratama", email: "bima@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Raka Maulana Yusuf", email: "raka@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Nadia Safira Lestari", email: "nadia@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Dimas Fajar", email: "dimas@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Siti Nur", email: "siti@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Gilang Pratama", email: "gilang@student.kontrilab.local", role: "siswa", password: "dummy-password" },
  { username: "Laras Ayu", email: "laras@student.kontrilab.local", role: "siswa", password: "dummy-password" },
];

const projects = [
  {
    title: "Website Profil Sekolah",
    description: "Buat website sederhana yang menampilkan profil sekolah, informasi jurusan, dan halaman kontak.",
    due_date: "2026-07-20",
    groups: [
      { name: "XII RPL 1", progres: "process", members: ["alya", "bima", "raka", "nadia"] },
      { name: "Kelompok 2", progres: "process", members: ["dimas", "siti"] },
    ],
  },
  {
    title: "Landing Page UMKM",
    description: "Landing page sederhana untuk UMKM lokal dengan katalog produk dan informasi kontak.",
    due_date: "2026-07-25",
    groups: [
      { name: "XI - Desain Web", progres: "process", members: ["alya", "bima", "raka", "nadia"] },
      { name: "Kelompok 4", progres: "process", members: ["gilang", "laras"] },
    ],
  },
  {
    title: "Poster Kampanye Digital",
    description: "Poster kampanye digital bertema literasi teknologi.",
    due_date: "2026-08-18",
    groups: [{ name: "X Informatika", progres: "process", members: [] }],
  },
];

const discussionSeed = [
  { title: "Pembahasan Konsep Landing Page", status: "process", date: "2026-06-25" },
  { title: "Tinjauan Konten Produk", status: "pending", date: "2026-06-26" },
  { title: "Revisi Tampilan Kontak", status: "finish", date: "2026-06-27" },
];

const progressSeed = [
  ["bima", "hero-draft.png", "Membuat draft tampilan awal untuk bagian hero landing page."],
  ["raka", "produk-copy.md", "Menambahkan teks awal untuk bagian produk unggulan."],
  ["nadia", "kontak-layout.png", "Mengunggah bukti pengerjaan layout halaman kontak."],
  ["alya", "asset-list.pdf", "Menyusun daftar kebutuhan aset gambar dan ikon produk."],
  ["bima", "testimoni-copy.md", "Merapikan copywriting untuk bagian testimoni pelanggan."],
  ["raka", "mobile-spacing.png", "Mengecek konsistensi spacing untuk versi mobile."],
];

async function main() {
  const seededUsers = new Map();
  for (const user of users) {
    const row = await ensure("users", { email: user.email }, user);
    const key = user.email.split("@")[0];
    seededUsers.set(key, row);
  }

  const teacher = seededUsers.get("ratna");
  for (const project of projects) {
    const projectRow = await ensure("project", { title: project.title }, {
      user_id: teacher.id,
      title: project.title,
      description: project.description,
      due_date: project.due_date,
    });

    for (const group of project.groups) {
      const groupRow = await ensure("project_group", { id_project: projectRow.id, name: group.name }, {
        id_project: projectRow.id,
        name: group.name,
        progres: group.progres,
      });

      for (let index = 0; index < group.members.length; index += 1) {
        const user = seededUsers.get(group.members[index]);
        if (!user) continue;
        await ensure("group_member", { id_project_group: groupRow.id, id_user: user.id }, {
          id_project_group: groupRow.id,
          id_user: user.id,
          role: index === 0 ? "leader" : "member",
        });
      }

      if (project.title !== "Landing Page UMKM" || group.name !== "XI - Desain Web") continue;
      for (const discussion of discussionSeed) {
        const discussionRow = await ensure("discussion_session", { id_project_group: groupRow.id, title: discussion.title }, {
          id_project_group: groupRow.id,
          title: discussion.title,
          date: discussion.date,
          status: discussion.status,
          type: "online",
        });

        for (const memberKey of group.members) {
          const user = seededUsers.get(memberKey);
          if (!user) continue;
          await ensure("participant", { id_discussion_session: discussionRow.id, id_user: user.id }, {
            id_discussion_session: discussionRow.id,
            id_user: user.id,
          });
        }

        if (discussion.title !== "Pembahasan Konsep Landing Page") continue;
        for (const [userKey, document, description] of progressSeed) {
          const user = seededUsers.get(userKey);
          if (!user) continue;
          await ensure("progress_discussion", { id_discussion_session: discussionRow.id, id_user: user.id, document }, {
            id_discussion_session: discussionRow.id,
            id_user: user.id,
            document,
            description,
          });
        }
      }
    }
  }

  console.log("Seed Supabase KontriLab selesai.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
