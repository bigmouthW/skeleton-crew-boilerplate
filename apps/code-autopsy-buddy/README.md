# Code Autopsy Buddy (Built on Skeleton Crew Boilerplate)

A forensic AI debugging, security audit, and refactoring assistant built directly from `../../template`.

## What Was Customized From the Skeleton

- **Theme & Branding (`src/lib/app-config.ts`)**: Switched palette to emerald/teal forensic terminal styling.
- **Diagnostic Modes (`src/lib/app-config.ts`)**: Added `Bug Hunt`, `Security Check`, and `Refactor Plan`.
- **One-Click Sample Code (`sampleInput`)**: Inserts a realistic buggy TypeScript snippet into the composer for instant testing.

## Run Locally

```bash
cp .env.example .env.local
npm install
npm run dev
```
