"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { appConfig } from "@/lib/app-config";
import type { SessionUser } from "@/lib/auth";

interface NavbarProps {
  user: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className={`border-b ${appConfig.theme.border} backdrop-blur-sm`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold tracking-wider ${appConfig.theme.accentBadge}`}
          >
            {appConfig.shortMark}
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">{appConfig.appName}</p>
            <p className="mt-1 text-xs text-slate-400">{appConfig.tagline}</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/chat"
            className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Workspace
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-400 sm:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${appConfig.theme.secondaryButton}`}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${appConfig.theme.primaryButton}`}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
