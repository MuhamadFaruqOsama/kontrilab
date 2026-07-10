import { prisma } from "@/lib/prisma";
import { DiscussionTopic, DiscussionStatus } from "@/lib/generated/prisma/client";

export class DiscussionService {
  static async startSession(data: { groupId: string; title: string; topic: DiscussionTopic; initialNote?: string }) {
    return prisma.discussionSession.create({
      data: {
        ...data,
        status: "RUNNING"
      }
    });
  }

  static async endSession(sessionId: string) {
    return prisma.discussionSession.update({
      where: { id: sessionId },
      data: {
        status: "FINISHED",
        endedAt: new Date()
      }
    });
  }

  static async saveChatMessage(data: { discussionId: string; authorId: string; message: string }) {
    return prisma.discussionChat.create({ data });
  }

  static async getDiscussionHistory(groupId: string) {
    return prisma.discussionSession.findMany({
      where: { groupId },
      include: {
        chats: true,
        participants: {
          include: { user: true }
        }
      },
      orderBy: { startedAt: "desc" }
    });
  }
}
