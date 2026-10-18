import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { discussionSession, discussionChat, participant } from '../db/schema';

export class DiscussionService {
  async createSession(groupId: string, data: Omit<typeof discussionSession.$inferInsert, 'id' | 'groupId' | 'startedAt' | 'endedAt'>) {
    const session = await db.insert(discussionSession).values({
      ...data,
      id: crypto.randomUUID(),
      groupId,
    }).returning();
    return session[0];
  }

  async getSession(sessionId: string) {
    const result = await db.select().from(discussionSession).where(eq(discussionSession.id, sessionId));
    return result[0];
  }

  async addMessage(discussionId: string, authorId: string, message: string) {
    const chat = await db.insert(discussionChat).values({
      id: crypto.randomUUID(),
      discussionId,
      authorId,
      message,
    }).returning();
    return chat[0];
  }
}

export const discussionService = new DiscussionService();
