import { SessionTag } from "./session";

export type ChatMessage = {
  id: string;
  sessionId: string;
  coupleCode: string;

  sender: "user" | "assistant" | "system";
  senderId?: string;

  content: string;
  partial?: boolean;

  mode: SessionTag;

  createdAt: number;
  finalizedAt?: number;
};

export type ContextItem = {
  value: string;
  sourceSessionId: string;
  createdAt: number;
};

export type UserContext = {
  keyIssues?: ContextItem[];
  goals?: ContextItem[];
  context?: ContextItem[];
};

export type ContextEntry<T> = {
  value: T;
  confidence: number;
  sourceSessionId: string;
  updatedAt: number;
};
