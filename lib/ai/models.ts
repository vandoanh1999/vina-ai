// Avoid instantiating a specific groq model at import time; use ids and resolve at runtime.
export const model = "llama3-70b-8192";

export const DEFAULT_CHAT_MODEL = "llama3-70b-8192";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "llama3-70b-8192",
    name: "Groq LLaMA 3 70B",
    description: "The latest LLaMA 3 model from Groq",
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Groq LLaMA 3.1 8B Instant",
    description: "Lightweight and extremely fast model for quick replies",
  },
];
