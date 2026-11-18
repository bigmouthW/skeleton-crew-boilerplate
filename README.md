# Skeleton-Crew-Boilerplate

> A minimal, barebones Next.js (App Router + TypeScript + Tailwind CSS) starter template featuring built-in authentication and streaming AI chat — plus **two distinct applications** built directly from the same skeleton.

Built for the **Kiroween** hackathon (**Skeleton Crew** category).

---

## Why This Exists

Every hackathon starts with the same setup tax: configuring Next.js, wiring up auth, protecting API routes, building a streaming chat UI, and debugging environment variables. Beginners often burn half the weekend before writing a single feature of their actual idea.

**Skeleton-Crew-Boilerplate** strips the starter down to the bare bones so you can read the whole codebase in one sitting and start hacking in minutes.

---

## Repository Structure

```text
skeleton-crew-boilerplate/
├── .kiro/
│   ├── specs/skeleton-core/     # EARS requirements, design doc, and implementation tasks
│   └── steering/                # Architectural conventions for Kiro
├── template/                    # Core reusable Next.js skeleton (Auth + AI Chat)
├── apps/
│   ├── haunted-story-studio/    # App 1: Collaborative AI ghost-story co-writer + Markdown export
│   └── code-autopsy-buddy/      # App 2: Forensic AI bug-hunter, security checker & refactor planner
├── LICENSE                      # MIT License
└── README.md
```

Each folder (`template/`, `apps/haunted-story-studio/`, `apps/code-autopsy-buddy/`) is completely standalone so beginners can copy one folder and run it with zero monorepo tooling overhead.

---

## What's Inside the Skeleton (`template/`)

- **Zero-Database Built-in Auth**: Signed HTTP-only cookie sessions (`HMAC-SHA256` + `scryptSync` password hashing via Node `crypto`), Sign In / Sign Up flows, protected `/chat` route, and a **One-Click Demo Login** button for instant testing. Easily swappable in `src/lib/auth.ts`.
- **Protected Streaming AI Chat**: Server-Sent Events (SSE) chat API (`/api/chat`) compatible with any OpenAI-format provider (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`).
- **Built-in Demo Fallback Mode**: If `AI_API_KEY` is omitted, the template automatically falls back to a simulated token-by-token SSE stream so you can test and demo the full UX offline or without billing setup.
- **Single-File App Customization**: All branding, theme accents, system prompts, modes, and quick prompts live in `src/lib/app-config.ts`.

---

## Quick Start (Any App Folder)

1. Pick the base template or either derivative app:

   ```bash
   cd template
   # or: cd apps/haunted-story-studio
   # or: cd apps/code-autopsy-buddy
   ```

2. Copy environment variables (optional — works in Demo Mode even without an API key):

   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`, click **One-Click Demo Sign In**, and start chatting.

---

## Two Proof Apps Built From This Skeleton

| App | Folder | Purpose | Skeleton Extensions |
|---|---|---|---|
| **Haunted Story Studio** | [`apps/haunted-story-studio`](./apps/haunted-story-studio) | Collaborative spooky story co-writer | Genre/setting selector (`Victorian Manor`, `Abandoned Subway`, `Cursed Git Repo`), horror narrator persona, and **Export Story (`.md`)** |
| **Code Autopsy Buddy** | [`apps/code-autopsy-buddy`](./apps/code-autopsy-buddy) | Developer debugging & code-review assistant | Diagnostic modes (`Bug Hunt`, `Security Check`, `Refactor Plan`), sample buggy snippet inserter, structured forensic prompt |

---

## Turning the Skeleton Into Your Own App

1. Copy `template/` into a new folder.
2. Edit `src/lib/app-config.ts` to change the name, palette, modes, quick prompts, and system prompt.
3. Add any extra UI actions inside `src/components/ChatPanel.tsx` or new routes under `src/app/`.
4. Open the repo in **Kiro** to extend specs in `.kiro/specs/` and iterate with vibe coding.

---

## License

[MIT](./LICENSE)
