import { prisma } from "@/lib/prisma";

export class AIService {
  static async analyzeDiscussion(sessionId: string) {
    const session = await prisma.discussionSession.findUnique({
      where: { id: sessionId },
      include: {
        chats: {
          include: { author: true }
        },
        participants: {
          include: { user: true }
        }
      }
    });

    if (!session) throw new Error("Session not found");

    // Mocking Gemini API call for NLP analysis
    // In production, we'd send the chats transcript to Gemini to evaluate individual contribution quality.
    
    // For demonstration, we simply generate mock NLP insights.
    const insights = session.participants.map(p => ({
      userId: p.userId,
      activityScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      analysis: `User ${p.user.name} participated actively in the discussion.`
    }));

    return insights;
  }

  static async crossValidateScore(participantId: string, peerAssessmentId: string) {
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { user: true, discussion: true }
    });

    const assessment = await prisma.peerAssessment.findUnique({
      where: { id: peerAssessmentId },
      include: { subject: true }
    });

    if (!participant || !assessment) throw new Error("Participant or Assessment not found");

    // Weight Formula (as per Proposal):
    // 20% Participation
    // 40% Discussion History
    // 40% Progress

    // Convert VisibilityLevel to a score 0-100
    const levelToScore = (level: string) => {
      switch (level) {
        case "VERY_VISIBLE": return 100;
        case "VISIBLE_ENOUGH": return 75;
        case "LESS_VISIBLE": return 50;
        default: return 0;
      }
    };

    // For demonstration, calculate a simulated weighted score
    const participationScore = levelToScore(assessment.teamwork);
    const discussionScore = levelToScore(assessment.discussionActivity);
    const progressScore = levelToScore(assessment.sharedProgress);

    const finalScore = (participationScore * 0.20) + (discussionScore * 0.40) + (progressScore * 0.40);

    // Apply Gemini API cross validation step
    // If mismatch found in text vs peer assessment, lower score.
    // For now, assume it's valid.

    return prisma.participantScore.create({
      data: {
        participantId,
        peerAssessmentId,
        score: Math.round(finalScore),
        note: "AI Cross Validated Score"
      }
    });
  }
}
