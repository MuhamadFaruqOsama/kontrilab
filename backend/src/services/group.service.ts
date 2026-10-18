import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { projectGroup, groupMember } from '../db/schema';

export class GroupService {
  async getGroupsByProject(projectId: string) {
    return db.select().from(projectGroup).where(eq(projectGroup.projectId, projectId));
  }

  async createGroup(projectId: string, data: { name: string; inviteCode: string }) {
    const newGroup = await db.insert(projectGroup).values({
      ...data,
      id: crypto.randomUUID(),
      projectId,
    }).returning();
    return newGroup[0];
  }

  async joinGroup(groupId: string, userId: string, role: 'LEADER' | 'MEMBER' = 'MEMBER') {
    const member = await db.insert(groupMember).values({
      id: crypto.randomUUID(),
      groupId,
      userId,
      role,
    }).returning();
    return member[0];
  }
}

export const groupService = new GroupService();
