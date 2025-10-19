import { createGroq } from "@ai-sdk/groq";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";
import { env } from "../env";

// Tạo Groq provider
const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

// Safe language model helper: try requested model and fall back to a known available one.
function safeLanguageModel(modelId: string) {
  try {
    return groq.languageModel(modelId);
  } catch (err) {
    // If the requested model isn't available at runtime, fall back to a smaller/guaranteed model.
    // We don't throw here because an unavailable model should not crash the server.
    // Log a warning so the issue is visible in runtime logs.
    // eslint-disable-next-line no-console
    console.warn(
      `[ai] languageModel ${modelId} unavailable, falling back to llama-3.1-8b-instant:`,
      err
    );
    return groq.languageModel("llama-3.1-8b-instant");
  }
}

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": safeLanguageModel("llama-3.3-70b-versatile"),
        "chat-model-reasoning": safeLanguageModel("llama-3.3-70b-versatile"),
        "title-model": safeLanguageModel("llama-3.1-8b-instant"),
        "artifact-model": safeLanguageModel("llama-3.3-70b-versatile"),
      },
    });
