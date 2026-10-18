import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { progressUpload, peerAssessment } from '../db/schema';

export class ProgressService {
  async uploadProgress(groupId: string, authorId: string, data: Omit<typeof progressUpload.$inferInsert, 'id' | 'groupId' | 'authorId' | 'createdAt'>) {
    const upload = await db.insert(progressUpload).values({
      ...data,
      id: crypto.randomUUID(),
      groupId,
      authorId,
    }).returning();
    return upload[0];
  }

  async submitPeerAssessment(groupId: string, authorId: string, subjectId: string, data: Omit<typeof peerAssessment.$inferInsert, 'id' | 'groupId' | 'authorId' | 'subjectId' | 'createdAt'>) {
    const assessment = await db.insert(peerAssessment).values({
      ...data,
      id: crypto.randomUUID(),
      groupId,
      authorId,
      subjectId,
    }).returning();
    return assessment[0];
  }
}

export const progressService = new ProgressService();
