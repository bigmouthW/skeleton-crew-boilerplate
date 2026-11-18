"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { appConfig } from "@/lib/app-config";

type AuthMode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitAuth(payload: Record<string, string>) {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }
      router.push("/chat");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await submitAuth({
      mode,
      email,
      password,
      ...(mode === "register" ? { name } : {}),
    });
  }

  return (
    <div
      className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
    >
      <div className="mb-5 flex rounded-xl bg-slate-950/70 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            mode === "login"
              ? appConfig.theme.primaryButton
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError(null);
          }}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            mode === "register"
              ? appConfig.theme.primaryButton
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada Lovelace"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-slate-500"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="demo@skeleton.dev"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-slate-500"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${appConfig.theme.primaryButton}`}
        >
          {loading
            ? "Working..."
            : mode === "login"
              ? "Sign In"
              : "Create Account & Enter"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-xs text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => submitAuth({ mode: "demo" })}
        className={`w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${appConfig.theme.secondaryButton}`}
      >
        One-Click Demo Sign In
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        Uses signed HTTP-only cookies without requiring an external database.
      </p>
    </div>
  );
}
