import { getAllMessages, updateSession } from "./store";
import { aiSummarize } from "./ai";

export async function generateSessionSummary(sessionId: string) {
  const messages = await getAllMessages(sessionId);
  const summary = await aiSummarize({
    goal: "Extract lasting relationship insights",
    messages
  });
  await updateSession(sessionId, {
    summary,
    endedAt: Date.now()
  });
}
