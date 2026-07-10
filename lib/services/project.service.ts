import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@/lib/generated/prisma/client";

export class ProjectService {
  static async getProjects(teacherId?: string) {
    return prisma.project.findMany({
      where: teacherId ? { ownerId: teacherId } : undefined,
      include: {
        _count: {
          select: { groups: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProjectById(projectId: string) {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        groups: {
          include: {
            members: {
              include: { user: true }
            },
            progress: true
          }
        }
      }
    });
  }

  static async createProject(data: {
    title: string;
    className: string;
    description: string;
    joinCode: string;
    deadline?: Date;
    ownerId: string;
  }) {
    return prisma.project.create({
      data
    });
  }

  static async updateProjectStatus(projectId: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id: projectId },
      data: { status }
    });
  }
}
