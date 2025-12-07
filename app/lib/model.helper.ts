import { openAi } from "./aiClient";
import { hf } from "./aiClient";

export async function askCounselor(
  coupleContext: object,
  conversationHistory: string[],
  newMessage: string,
  provider: "openai" | "huggingface" = "openai"
) {
  const prompt = `
You are a gentle relationship counselor.
Never judge or make conclusions.
Use the couple context to provide supportive, reflective guidance.
Couple Context: ${JSON.stringify(coupleContext)}
Conversation History: ${conversationHistory.join("\n")}
New Message: ${newMessage}
`;

  if (provider === "openai") {
    const response = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });
    return response.choices[0].message?.content || "";
  }

  if (provider === "huggingface") {
    const response = await hf.textGeneration({
      model: "gpt2-large", // or any HF model
      inputs: prompt,
      parameters: { max_new_tokens: 500, temperature: 0.7 },
    });
    return response.generated_text || "";
  }

  throw new Error("Invalid AI provider");
}
