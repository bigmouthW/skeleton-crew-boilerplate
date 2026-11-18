import Link from "next/link";
import { appConfig } from "@/lib/app-config";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <div className="space-y-10 py-6">
      <section className="max-w-3xl space-y-5">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${appConfig.theme.accentBadge}`}
        >
          {appConfig.tagline}
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {appConfig.heroTitle}
        </h1>

        <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
          {appConfig.heroDescription}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={user ? "/chat" : "/login"}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${appConfig.theme.primaryButton}`}
          >
            {user ? "Open Protected Workspace" : "Sign In to Start"}
          </Link>
          <Link
            href="/chat"
            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${appConfig.theme.border} ${appConfig.theme.secondaryButton}`}
          >
            Go to /chat
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div
          className={`rounded-2xl border p-5 ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
        >
          <h2 className="text-sm font-semibold">Built-In Auth</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            HMAC-SHA256 HTTP-only cookie sessions with scrypt password hashing and
            one-click demo access.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-5 ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
        >
          <h2 className="text-sm font-semibold">Streaming AI Chat</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Protected SSE endpoint supporting any OpenAI-compatible API plus an
            offline-ready Demo Mode fallback.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-5 ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
        >
          <h2 className="text-sm font-semibold">One-File Config</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Update <code>src/lib/app-config.ts</code> to turn this skeleton into a
            completely new app in minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
