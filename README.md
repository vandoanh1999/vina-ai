<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
  Chat SDK is a free, open-source template built with Next.js 14 and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js 14](https://nextjs.org)
  - App Router + React Server Components
  - Server Actions for ultra-fast server-side rendering
- [AI SDK](https://ai-sdk.dev/docs/introduction)
  - Unified API for LLMs (text, objects, tool calls)
  - Hooks for dynamic chat UIs
  - Supports Groq (default), OpenAI, Anthropic, Fireworks and more
- [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for chat history
- [Vercel Blob](https://vercel.com/storage/blob) for file storage
- [Auth.js](https://authjs.dev) for authentication

---

## Model Providers

This template uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)  
and is pre-configured for **Groq Cloud models** routed through the gateway.

**Default configuration**

| Provider | Model Name | Context | Notes |
|-----------|-------------|----------|--------|
| **Groq Cloud** | `llama-3.3-70b-versatile` | 128k tokens | Strongest free model (≈ GPT-4 Turbo level) |
|  | `llama-3.1-8b-instant` | 64k | Fast and lightweight |

### AI Gateway Authentication
- **Vercel deployments**: OIDC tokens handled automatically  
- **Local runs**: add to `.env.local`
  ```bash
  GROQ_API_KEY=sk-xxxxxxxxxxxxxxxx