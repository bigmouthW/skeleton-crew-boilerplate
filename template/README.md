# Skeleton Crew Template (Base)

A minimal, barebones Next.js App Router starter with built-in authentication and streaming AI chat.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Leave `AI_API_KEY` blank to explore Demo Mode, or add any OpenAI-compatible API key to stream live responses.

## Key Files

- `src/lib/app-config.ts` — Edit branding, theme classes, system prompt, modes, and quick prompts.
- `src/lib/auth.ts` — Signed HTTP-only cookie sessions (`HMAC-SHA256`) and `scryptSync` password verification.
- `src/lib/ai.ts` — OpenAI-compatible SSE streamer with Demo Mode fallback.
- `src/app/api/chat/route.ts` — Authenticated SSE endpoint.
- `src/app/chat/page.tsx` — Server-protected chat route.
