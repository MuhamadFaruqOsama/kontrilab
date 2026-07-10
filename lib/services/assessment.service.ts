import { prisma } from "@/lib/prisma";
import { VisibilityLevel, ProgressStatus } from "@/lib/generated/prisma/client";

export class AssessmentService {
  static async submitProgress(data: {
    groupId: string;
    authorId: string;
    description: string;
    evidenceUrl?: string;
  }) {
    return prisma.progressUpload.create({
      data: {
        ...data,
        status: "FINISHED" // Default to FINISHED for simplicity, awaiting review
      }
    });
  }

  static async submitPeerAssessment(data: {
    groupId: string;
    authorId: string;
    subjectId: string;
    discussionActivity: VisibilityLevel;
    teamwork: VisibilityLevel;
    sharedProgress: VisibilityLevel;
    note?: string;
  }) {
    return prisma.peerAssessment.create({ data });
  }

  static async verifyParticipantScore(participantScoreId: string, finalScore: number, teacherNote?: string) {
    return prisma.participantScore.update({
      where: { id: participantScoreId },
      data: {
        score: finalScore,
        note: teacherNote
      }
    });
  }
}
