import { createGroq } from "@ai-sdk/groq";
import { customProvider, type LanguageModel } from "ai";
import { isTestEnvironment } from "../constants";
import { env } from "../env";

// Create the base Groq provider
const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

// Helper function to safely get a language model, falling back to a default
function getLanguageModel(modelId: string, fallbackModelId: string): LanguageModel {
  try {
    return groq.languageModel(modelId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[ai] languageModel ${modelId} unavailable, falling back to ${fallbackModelId}:`,
      err
    );
    return groq.languageModel(fallbackModelId);
  }
}

// Define the language models with their specific configurations and fallbacks
const languageModels = {
  "chat-model": getLanguageModel("llama-3.1-70b-versatile", "llama-3.1-8b-instant"),
  "chat-model-reasoning": getLanguageModel("llama-3.1-70b-versatile", "llama-3.1-8b-instant"),
  "title-model": getLanguageModel("llama-3.1-8b-instant", "llama-3.1-8b-instant"),
  "artifact-model": getLanguageModel("llama-3.1-70b-versatile", "llama-3.1-8b-instant"),
};

// Create the custom provider
export const myProvider = isTestEnvironment
  ? (() => {
      // Mock provider for testing environment
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
      languageModels: languageModels as any,
      fallbackProvider: groq, // Use the groq provider for any models not explicitly defined
    });
