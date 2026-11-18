# Requirements: Skeleton Core

## Introduction

**Skeleton-Crew-Boilerplate** provides a minimal, production-structured Next.js App Router template with built-in authentication and streaming AI chat. It is designed so hackathon builders can clone a self-contained folder, sign in immediately, and turn the template into distinct applications with minimal boilerplate friction.

---

## Requirement 1: Zero-Friction Authentication & Route Protection

**User Story:** As a hackathon developer, I want authentication and protected routes to work immediately without setting up an external database, so that I can build user-facing AI features in minutes.

### Acceptance Criteria

1. WHEN a user submits valid credentials on `/login`, THE SYSTEM SHALL verify the password hash using `scryptSync` + `timingSafeEqual`, issue an HTTP-only HMAC-signed session cookie, and redirect to `/chat`.
2. WHEN a user selects **Create Account** on `/login` with an unused email and a password of at least 6 characters, THE SYSTEM SHALL register the user in the session-ready store and sign them in immediately.
3. WHEN a visitor clicks **One-Click Demo Sign In**, THE SYSTEM SHALL sign them in as the configured demo account without requiring manual typing.
4. WHEN an unauthenticated visitor navigates to `/chat`, THE SYSTEM SHALL redirect them to `/login` on the server before rendering the chat workspace.
5. WHEN an unauthenticated client sends a request to `POST /api/chat`, THE SYSTEM SHALL respond with HTTP `401 Unauthorized`.
6. WHEN a signed-in user clicks **Sign Out**, THE SYSTEM SHALL clear the session cookie via `POST /api/auth/logout` and redirect to `/login`.

---

## Requirement 2: Protected Streaming AI Chat with Demo Fallback

**User Story:** As a developer evaluating or demoing the template, I want AI responses to stream smoothly over SSE whether or not an external API key is configured.

### Acceptance Criteria

1. WHEN `AI_API_KEY` is configured and an authenticated user sends a prompt to `POST /api/chat`, THE SYSTEM SHALL proxy an OpenAI-compatible streaming request to `AI_BASE_URL` using `AI_MODEL` and forward tokens as `text/event-stream` (`data: {"token": "..."}`).
2. WHEN `AI_API_KEY` is empty or unset, THE SYSTEM SHALL stream a simulated token-by-token response labeled as Demo Mode so the entire UI flow remains testable offline.
3. WHEN the request body is invalid JSON or contains an empty message list, THE SYSTEM SHALL return HTTP `400 Bad Request` with a descriptive JSON error.
4. WHEN the user clicks **Stop** during generation, THE SYSTEM SHALL abort the active `fetch` stream cleanly on the client without leaving broken UI state.

---

## Requirement 3: Single-File Skeleton Customization

**User Story:** As a template user, I want to rebrand and repurpose the skeleton from a single typed configuration module, so that spawning new apps stays fast and consistent.

### Acceptance Criteria

1. WHEN a developer edits `src/lib/app-config.ts`, THE SYSTEM SHALL update the application title, tagline, theme utility classes, system prompt, selectable chat modes, quick-start prompt chips, and demo fallback behavior across the UI and `/api/chat`.
2. WHEN an application defines selectable modes in `appConfig.modes`, THE SYSTEM SHALL display them in the chat header and append the selected mode's prompt instructions to the system prompt on `POST /api/chat`.

---

## Requirement 4: Derivative Applications Proof

**User Story:** As a hackathon judge or adopter, I want to inspect two distinct, self-contained applications derived from the skeleton, proving the template's flexibility.

### Acceptance Criteria

1. THE REPOSITORY SHALL include `apps/haunted-story-studio`, demonstrating collaborative interactive ghost-story co-writing with horror setting modes and Markdown story export.
2. THE REPOSITORY SHALL include `apps/code-autopsy-buddy`, demonstrating forensic code review and debugging with diagnostic modes and one-click sample snippet injection.
3. WHEN inspecting either app folder, EACH FOLDER SHALL retain its own standalone `package.json`, `.env.example`, and skeleton file layout.
