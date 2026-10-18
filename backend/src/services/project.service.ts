import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { project } from '../db/schema';

export class ProjectService {
  async getProjects() {
    return db.select().from(project);
  }

  async getProjectById(projectId: string) {
    const result = await db.select().from(project).where(eq(project.id, projectId));
    return result[0];
  }

  async createProject(ownerId: string, data: Omit<typeof project.$inferInsert, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) {
    const newProject = await db.insert(project).values({
      ...data,
      id: crypto.randomUUID(), // Or let Postgres handle if using uuid
      ownerId,
    }).returning();
    return newProject[0];
  }

  // Add join project logic, get projects by user, etc.
}

export const projectService = new ProjectService();
