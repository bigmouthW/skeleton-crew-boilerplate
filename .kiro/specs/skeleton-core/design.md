# Design: Skeleton Core

## Architecture Overview

Every standalone app folder (`template/`, `apps/haunted-story-studio/`, `apps/code-autopsy-buddy/`) follows the same minimal Next.js App Router layout:

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                  # Public overview + quick links to /login and /chat
│   ├── login/page.tsx            # Sign In / Sign Up / One-Click Demo Sign In
│   ├── chat/page.tsx             # Server-protected AI chat workspace
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts    # POST: login | register | demo
│       │   ├── logout/route.ts   # POST: clears session cookie
│       │   └── session/route.ts  # GET: returns current user or null
│       └── chat/route.ts         # POST: authenticated SSE chat completion
├── components/
│   ├── Navbar.tsx
│   ├── AuthForm.tsx
│   └── ChatPanel.tsx
└── lib/
    ├── app-config.ts             # Single source of truth for app identity & prompts
    ├── auth.ts                   # HMAC-SHA256 cookie sessions & scrypt user store
    └── ai.ts                     # OpenAI-compatible SSE client + Demo Mode streamer
```

---

## Authentication Flow & Security Model

```text
Browser                    Next.js Server (src/lib/auth.ts)
  |                                   |
  |-- POST /api/auth/login ---------->|  Verify password (scryptSync + timingSafeEqual)
  |                                   |  Sign payload: base64url(json) + "." + hmacSha256
  |<-- Set-Cookie: sk_session=... ----|  HttpOnly, SameSite=Lax, Path=/
  |                                   |
  |-- GET /chat --------------------->|  getSessionUser() verifies HMAC signature & exp
  |<-- 200 ChatPage (or 307 /login) --|
```

- **Secret resolution**: Reads `process.env.AUTH_SECRET`. In local development without `AUTH_SECRET`, falls back to a deterministic dev secret so zero-config boot works, while keeping production usage documented in `.env.example`.
- **In-memory store**: Seeded with the demo account (`DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`). Stored on `globalThis` so Next.js dev hot-reload preserves newly registered accounts during a session. Designed for easy replacement in `src/lib/auth.ts` with Auth.js, Clerk, or Supabase.

---

## Streaming AI Chat Protocol

1. Client `ChatPanel.tsx` posts `{ messages, modeId }` to `POST /api/chat`.
2. Server verifies session via `getSessionUser()`. Unauthenticated calls receive `401`.
3. Server constructs the system prompt from `appConfig.systemPrompt` plus the selected `appConfig.modes` instruction (if provided).
4. `streamChatCompletion()` in `src/lib/ai.ts`:
   - **Live Mode (`AI_API_KEY` present)**: Calls `${AI_BASE_URL}/chat/completions` with `stream: true`, parses upstream SSE `delta.content` chunks, and re-emits normalized events:
     - `data: {"token":"..."}\n\n`
     - `data: [DONE]\n\n`
   - **Demo Mode (`AI_API_KEY` missing)**: Calls `appConfig.buildDemoReply(userMessage, modeId)` and streams words over time through the exact same SSE format so UI behavior is identical.

---

## Extension Pattern for Derivative Apps

- **App 1 (`apps/haunted-story-studio`)**:
  - Overrides `app-config.ts` with Halloween dark violet/orange palette, haunted setting modes (`Victorian Manor`, `Abandoned Subway`, `Cursed Git Repo`), and gothic narrator system prompt.
  - Extends `ChatPanel.tsx` with a client-side **Export Story (.md)** action.
- **App 2 (`apps/code-autopsy-buddy`)**:
  - Overrides `app-config.ts` with forensic emerald/teal palette, diagnostic modes (`Bug Hunt`, `Security Check`, `Refactor Plan`), and senior engineer autopsy prompt.
  - Extends `ChatPanel.tsx` with an **Insert Sample Buggy Code** quick action for instant testing.
