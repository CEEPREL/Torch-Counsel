import { ChatMessage } from "@/app/types/chat";
import type { RelationshipStage, SessionTag } from "@/app/types/session";
import { buildPrompt } from "./promt";
import { saveChatMessage, getSessionContext, getRecentMessages } from "./store";
import { createAIResponse } from "./ai";

type IOServer = {
  to: (room: string) => { emit: (event: string, data: unknown) => void };
};

type Socket = { id?: string };

type IncomingPayload = {
  sessionId: string;
  userId: string;
  content: string;
  coupleCode?: string;
  mode?: SessionTag;
};

function stageToTag(stage: RelationshipStage): SessionTag {
  const map: Record<RelationshipStage, SessionTag> = {
    talking: "general",
    dating: "communication",
    engaged: "planning",
    married: "trust",
  };
  return map[stage] ?? "general";
}

export async function handleIncomingMessage(
  io: IOServer,
  socket: Socket,
  payload: IncomingPayload
) {
  const { sessionId, userId, content } = payload;

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    sessionId,
    coupleCode: payload.coupleCode ?? "unknown",
    senderId: userId,
    sender: "user",
    mode: payload.mode ?? "general",
    content,
    createdAt: Date.now(),
  };

  await saveChatMessage(message);

  io.to(sessionId).emit("new-message", message);

  await streamAIResponse(io, sessionId);
}

async function streamAIResponse(io: IOServer, sessionId: string) {
  const context = await getSessionContext(sessionId);
  const recentMessages = await getRecentMessages(sessionId);
  const prompt = buildPrompt(context, recentMessages);
  const aiText = await createAIResponse(prompt);
  io.to(sessionId).emit("ai-complete", { text: aiText });
  const aiMessage: ChatMessage = {
    id: crypto.randomUUID(),
    sessionId,
    coupleCode: context.relationship.coupleCode,
    senderId: "ai",
    sender: "assistant",
    mode: stageToTag(context.relationship.stage as RelationshipStage),
    content: aiText,
    createdAt: Date.now(),
  };
  await saveChatMessage(aiMessage);
}

export async function handleIncomingMessageHTTP(payload: {
  sessionId: string;
  userId: string;
  content: string;
  coupleCode?: string;
  mode?: string;
}): Promise<{ message: ChatMessage; aiMessage: ChatMessage }> {
  const { sessionId, userId, content } = payload;
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    sessionId,
    coupleCode: payload.coupleCode ?? "unknown",
    senderId: userId,
    sender: "user",
    mode: (payload.mode as any) ?? "general",
    content,
    createdAt: Date.now(),
  };
  await saveChatMessage(message);
  const context = await getSessionContext(sessionId);
  const recentMessages = await getRecentMessages(sessionId);
  const prompt = buildPrompt(context, recentMessages);
  const aiText = await createAIResponse(prompt);
  const aiMessage: ChatMessage = {
    id: crypto.randomUUID(),
    sessionId,
    coupleCode: context.relationship.coupleCode,
    senderId: "ai",
    sender: "assistant",
    mode: stageToTag(context.relationship.stage as RelationshipStage),
    content: aiText,
    createdAt: Date.now(),
  };
  await saveChatMessage(aiMessage);
  return { message, aiMessage };
}
