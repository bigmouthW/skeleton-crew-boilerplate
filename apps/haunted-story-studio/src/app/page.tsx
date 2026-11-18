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

        <p className="text-base leading-relaxed text-purple-200/80 sm:text-lg">
          {appConfig.heroDescription}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={user ? "/chat" : "/login"}
            className={`rounded-xl px-5 py-2.5 text-sm transition ${appConfig.theme.primaryButton}`}
          >
            {user ? "Enter Writing Room" : "Sign In & Co-Write"}
          </Link>
          <Link
            href="/chat"
            className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${appConfig.theme.border} ${appConfig.theme.secondaryButton}`}
          >
            Open Story Studio
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {appConfig.modes.map((mode) => (
          <div
            key={mode.id}
            className={`rounded-2xl border p-5 ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
          >
            <h2 className={`text-sm font-semibold ${appConfig.theme.accentText}`}>
              {mode.label}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-purple-200/75">
              {mode.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
