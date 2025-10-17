import { createGroq } from "@ai-sdk/groq";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { env } from "../env";

// Tạo Groq provider
const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

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
        "chat-model": groq.languageModel("llama-3.3-70b-versatile"),
        "chat-model-reasoning": groq.languageModel("llama-3.3-70b-versatile"),
        "title-model": groq.languageModel("llama-3.1-8b-instant"),
        "artifact-model": groq.languageModel("llama-3.3-70b-versatile"),
      },
    });
