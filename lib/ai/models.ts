import { groq } from '@ai-sdk/groq'

export const model = groq('llama-3.3-70b-versatile')

export const DEFAULT_CHAT_MODEL = 'llama-3.3-70b-versatile'

export type ChatModel = {
  id: string
  name: string
  description: string
}

export const chatModels: ChatModel[] = [
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq LLaMA 3.3 70B Versatile',
    description: 'Fast, high-accuracy Groq Cloud model (≈ GPT-4 Turbo)',
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Groq LLaMA 3.1 8B Instant',
    description: 'Lightweight and extremely fast model for quick replies',
  },
]