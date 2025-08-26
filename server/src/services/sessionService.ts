// Session approach - lighter network footprint
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export const sessionService = {
  async createSession(userId: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        id: sessionId,
        userId,
        expiresAt,
      },
    });

    return sessionId;
  },

  async validateSession(sessionId: string): Promise<string | null> {
    // Clean up expired sessions and validate
    await this.cleanupExpiredSessions();

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        expiresAt: { gt: new Date() },
      },
    });

    return session?.userId || null;
  },

  async invalidateSession(sessionId: string): Promise<void> {
    await prisma.session
      .delete({
        where: { id: sessionId },
      })
      .catch(() => {
        // Session might not exist, that's fine
      });
  },

  async invalidateUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  },

  async cleanupExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  },
};
