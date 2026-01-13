import { openAi } from "@/app/lib/aiClient";
import type { ChatMessage } from "@/app/types/chat";

type BuiltPrompt = {
  system: string;
  conversation: { role: "user" | "assistant" | "system"; content: string }[];
};

export async function createAIResponse(prompt: BuiltPrompt): Promise<string> {
  const history = prompt.conversation
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const input = `${prompt.system}\n${history}\nASSISTANT:`;

  try {
    const resp = await openAi.responses.create({
      model: "gpt-4o-mini",
      input,
    });
    const parsed = resp as unknown as {
      output_text?: string;
      choices?: { message?: { content?: string } }[];
    };
    const content =
      parsed.output_text ?? parsed.choices?.[0]?.message?.content ?? "";
    return content;
  } catch (err) {
    console.error("AI response error:", err);
    return "I'm having trouble responding right now. Let's try again shortly.";
  }
}

export async function aiSummarize(params: {
  goal: string;
  messages: ChatMessage[];
}): Promise<string> {
  const conversation = params.messages.map((m) => ({
    role: m.sender,
    content: m.content,
  }));
  const history = conversation
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const input =
    `You are an assistant that summarizes relationship session chats for memory.\nGoal: ${params.goal}\n` +
    `${history}\nUSER: Provide a concise summary of key issues, decisions, emotional tone, and any context updates.`;

  try {
    const resp = await openAi.responses.create({
      model: "gpt-4o-mini",
      input,
    });
    const parsed = resp as unknown as {
      output_text?: string;
      choices?: { message?: { content?: string } }[];
    };
    return parsed.output_text ?? parsed.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("AI summarize error:", err);
    return "";
  }
}
