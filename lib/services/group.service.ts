import { prisma } from "@/lib/prisma";

export class GroupService {
  static async createGroup(data: { projectId: string; name: string; inviteCode: string }) {
    return prisma.projectGroup.create({ data });
  }

  static async joinGroup(userId: string, inviteCode: string) {
    const group = await prisma.projectGroup.findUnique({ where: { inviteCode } });
    if (!group) throw new Error("Invalid invite code");

    return prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: userId,
        role: "MEMBER" // The first could be LEADER, but keeping it simple
      }
    });
  }

  static async getGroupMembers(groupId: string) {
    return prisma.groupMember.findMany({
      where: { groupId },
      include: { user: true }
    });
  }

  static async getGroupProgress(groupId: string) {
    return prisma.progressUpload.findMany({
      where: { groupId },
      include: { author: true },
      orderBy: { createdAt: "desc" }
    });
  }
}
