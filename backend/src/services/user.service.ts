import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { userProfile, user } from '../db/schema';

export class UserService {
  async getUserProfile(userId: string) {
    const profile = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, userId),
    });
    return profile;
  }

  async updateProfile(userId: string, data: Partial<typeof userProfile.$inferInsert>) {
    const updated = await db.update(userProfile)
      .set(data)
      .where(eq(userProfile.userId, userId))
      .returning();
    return updated[0];
  }

  // Find user with profile
  async getUserWithProfile(userId: string) {
     const result = await db.select()
       .from(user)
       .leftJoin(userProfile, eq(user.id, userProfile.userId))
       .where(eq(user.id, userId));
     return result[0];
  }
}

export const userService = new UserService();
