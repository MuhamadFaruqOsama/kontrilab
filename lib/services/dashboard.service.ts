import { prisma } from "@/lib/prisma";

export class DashboardService {
  static async getTeacherDashboardStats(teacherId: string, semester?: string) {
    // In a real app, semester would filter by date or academic term
    // For now, we'll fetch global stats for this teacher

    const activeProjects = await prisma.project.count({
      where: {
        ownerId: teacherId,
        status: "IN_PROGRESS",
      },
    });

    const pendingReviews = await prisma.progressUpload.count({
      where: {
        group: {
          project: {
            ownerId: teacherId,
          },
        },
        status: "FINISHED", // Assuming FINISHED progress needs review
      },
    });

    // Groups without recent activity
    const inactiveGroups = await prisma.projectGroup.count({
      where: {
        project: {
          ownerId: teacherId,
          status: "IN_PROGRESS",
        },
        // We'd check for lack of recent discussions or progress
        // This is simplified for the boilerplate
        discussions: {
          none: {
            startedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
            }
          }
        }
      },
    });

    // Students needing attention (e.g. low score, inactive)
    const needAttentionStudents = await prisma.groupMember.count({
      where: {
        group: {
          project: {
            ownerId: teacherId,
          }
        },
        // In real scenario, filter by participation score or lack thereof
      }
    });

    return {
      activeProjects,
      pendingReviews,
      inactiveGroups,
      needAttentionStudents,
    };
  }

  static async getTeacherProjects(teacherId: string) {
    const projects = await prisma.project.findMany({
      where: { ownerId: teacherId },
      include: {
        _count: {
          select: { groups: true }
        }
      },
      take: 5,
      orderBy: { updatedAt: "desc" }
    });

    return projects.map((p) => ({
      id: p.id,
      name: p.title,
      groups: p._count.groups,
      finalDeadline: p.deadline ? p.deadline.toLocaleDateString('id-ID') : "TBA",
      status: p.status === "IN_PROGRESS" ? "Aktif" : p.status === "NOT_STARTED" ? "Belum Mulai" : p.status === "FINISHED" ? "Selesai" : "Revisi"
    }));
  }

  static async getFollowUps(teacherId: string) {
    // Mocking followups based on pending reviews
    const pendingProgress = await prisma.progressUpload.findMany({
      where: {
        group: { project: { ownerId: teacherId } },
        status: "FINISHED"
      },
      include: {
        group: true
      },
      take: 3
    });

    return pendingProgress.map(p => ({
      title: "Review Progres",
      target: p.group.name,
      action: "Review"
    }));
  }
}
