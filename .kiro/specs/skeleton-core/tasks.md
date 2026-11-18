# Implementation Tasks: Skeleton Core

- [x] 1. Initialize project root & governance files
  - [x] 1.1 Add MIT `LICENSE`, root `README.md`, and `.gitignore` preserving `.kiro/`
  - [x] 1.2 Add `.kiro/steering/skeleton-conventions.md` and `skeleton-core` spec docs

- [x] 2. Scaffold core `template/` Next.js skeleton
  - [x] 2.1 Configure `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, and `.env.example`
  - [x] 2.2 Implement `src/lib/auth.ts` (HMAC-SHA256 signed cookies + `scryptSync` password verification)
  - [x] 2.3 Implement `src/lib/ai.ts` (OpenAI-compatible SSE streaming + Demo Mode fallback)
  - [x] 2.4 Implement `src/lib/app-config.ts` single-file customization module
  - [x] 2.5 Implement `/api/auth/*` and `/api/chat` route handlers
  - [x] 2.6 Build `Navbar`, `AuthForm`, `ChatPanel`, `/`, `/login`, and protected `/chat` pages

- [x] 3. Build two derivative proof apps from the skeleton
  - [x] 3.1 Create `apps/haunted-story-studio` with horror setting modes & `.md` story export
  - [x] 3.2 Create `apps/code-autopsy-buddy` with diagnostic modes & sample buggy code inserter

- [ ] 4. Local verification & polish (run in Kiro / terminal before submission)
  - [ ] 4.1 Run `npm install`, `npm run typecheck`, and `npm run build` in `template/`
  - [ ] 4.2 Run `npm install`, `npm run typecheck`, and `npm run build` in `apps/haunted-story-studio/`
  - [ ] 4.3 Run `npm install`, `npm run typecheck`, and `npm run build` in `apps/code-autopsy-buddy/`
  - [ ] 4.4 Add automated unit/smoke tests for `auth.ts` token signing and `ai.ts` demo fallback
  - [ ] 4.5 Capture 3:2 gallery screenshots and record the <= 3-minute Kiroween demo video
