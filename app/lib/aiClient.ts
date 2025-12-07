import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";

export const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const hf = new HfInference(process.env.HF_API_TOKEN);
