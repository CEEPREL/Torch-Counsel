export type ChatSession = {
  id: string;
  coupleCode: string;

  startedBy: string; // userId
  mode: SessionTag;

  createdAt: number;
  endedAt?: number;

  summary?: string; // AI generated memory
};

export type RelationshipStage = "talking" | "dating" | "engaged" | "married";

export type SessionContext = {
  self: {
    id: string;
    persona?: string;
    values?: Record<string, string>[];
    loveLanguages?: Record<string, string>[];
    keyIssues?: Record<string, string[]>;
  };

  partner?: {
    id: string;
    persona?: string;
    values?: Record<string, string>[];
    loveLanguages?: Record<string, string>[];
    keyIssues?: Record<string, string[]>;
  };

  relationship: {
    coupleCode: string;
    isMarried: boolean;
    stage: RelationshipStage;
  };

  memory: {
    relevantSummaries: string[];
  };
};

export type SessionInsight = {
  sessionId: string;
  coupleCode: string;
  userId: string;

  detectedIssues?: string[];
  emotionalSignals?: string[];
  decisions?: string[];
  updatedContext?: string[];

  createdAt: number;
};

export type SuggestedPrompt = {
  id: string;
  mode: SessionTag;
  trigger?: string;
  text: string;
};

export type SessionTag =
  | "conflict"
  | "communication"
  | "trust"
  | "intimacy"
  | "planning"
  | "healing"
  | "general"
  | "reflection"
  | "raise_concern"
  | "gift"
  | "Celebration "
  | "others";

export type SessionSummary = {
  sessionId: string;
  coupleCode: string;

  tags: SessionTag[];
  summary: string;

  detectedIssues?: string[];
  emotionalTone?: string[];
  decisions?: string[];

  createdAt: number;
};
