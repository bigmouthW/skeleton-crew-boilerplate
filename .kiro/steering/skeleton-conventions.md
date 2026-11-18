# Skeleton Crew Steering Guidelines

This document defines the architectural rules and conventions for **Skeleton-Crew-Boilerplate** and any derivative applications created in `apps/`.

## Core Principles

1. **Keep It Barebones**: Avoid introducing heavy external ORMs, state managers, or auth SaaS SDKs into the base `template/`. Beginners should be able to read every source file in under 15 minutes.
2. **Zero-Config Boot**: A fresh copy of `template/` or any app in `apps/` must boot and run end-to-end with `npm install && npm run dev`, even when no database or `AI_API_KEY` is configured.
3. **Single-File Customization First**: Domain identity (app name, colors, system prompt, modes, quick prompts, demo responder) belongs in `src/lib/app-config.ts`. Only touch routes or components when an app needs genuinely new behavior (like Markdown export or code snippet presets).
4. **Static Tailwind Classes Only**: Never construct dynamic Tailwind class names like ``bg-${color}-500``. Store complete utility class strings in `app-config.ts` so Tailwind's compiler always includes them.
5. **Security Basics**:
   - Auth sessions must use HTTP-only cookies signed with HMAC-SHA256 and verified with `crypto.timingSafeEqual`.
   - Password hashing must use `crypto.scryptSync` with per-user salts and `timingSafeEqual`.
   - Protected pages (`/chat`) and APIs (`/api/chat`) must check `getSessionUser()` on the server before returning user content or calling any AI upstream.
6. **Keep `.kiro/` Tracked**: Never add `.kiro/` to `.gitignore`. Any new app or feature should add or update specs under `.kiro/specs/`.
