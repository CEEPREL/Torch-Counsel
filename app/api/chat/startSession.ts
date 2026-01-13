import type {
  ChatSession,
  SessionContext,
  SessionTag,
  RelationshipStage,
} from "@/app/types/session";
import { AppUser } from "@/app/types/user";

type BuildSessionContextParams = {
  user: AppUser;
  partner?: AppUser;
  couple: {
    coupleCode: string;
    isMarried: boolean;
    stage: RelationshipStage;
  };
  pastSessions: ChatSession[];
};

export function startSessionContext({
  user,
  partner,
  couple,
  pastSessions,
}: BuildSessionContextParams): SessionContext {
  const relevantSummaries = pastSessions
    .filter(
      (s) =>
        s.summary &&
        (s as any).tags?.some((tag: SessionTag) =>
          ["conflict", "communication", "trust"].includes(tag)
        )
    )
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2)
    .map((s) => s.summary as string);

  return {
    self: {
      id: user.id,
      persona: user.persona,
      values: user.values?.map((v) => ({ value: v })),
      loveLanguages: user.loveLanguages?.map((l) => ({ language: l })),
      keyIssues: user.keyIssues ? { issues: user.keyIssues } : undefined,
    },

    partner: partner
      ? {
          id: partner.id,
          persona: partner.persona,
          values: partner.values?.map((v) => ({ value: v })),
          loveLanguages: partner.loveLanguages?.map((l) => ({ language: l })),
          keyIssues: partner.keyIssues
            ? { issues: partner.keyIssues }
            : undefined,
        }
      : undefined,

    relationship: {
      coupleCode: couple.coupleCode,
      isMarried: couple.isMarried,
      stage: couple.stage,
    },

    memory: {
      relevantSummaries,
    },
  };
}
