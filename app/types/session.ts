export type ChatSession = {
  id: string;
  coupleCode: string;
  userId: string;

  mode:
    | "talking_stage"
    | "dating"
    | "married"
    | "conflict"
    | "reflection"
    | "raise_concern";

  startedAt: number;
  endedAt?: number;

  contextSnapshot: {
    persona?: string;
    partnerPersona?: string;
    knownIssues?: string[];
    goals?: string[];
  };

  summary?: string;
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
  mode: ChatSession["mode"];
  trigger?: string;
  text: string;
};
