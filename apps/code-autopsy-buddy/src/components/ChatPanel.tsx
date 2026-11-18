"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { appConfig } from "@/lib/app-config";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function nextId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [modeId, setModeId] = useState<string>(appConfig.modes[0]?.id ?? "");
  const [streaming, setStreaming] = useState(false);
  const [aiMode, setAiMode] = useState<"live" | "demo" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  function stopStreaming() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }

  function clearConversation() {
    stopStreaming();
    setMessages([]);
    setError(null);
  }

  function exportMarkdown() {
    if (messages.length === 0) {
      return;
    }
    const title = `# ${appConfig.appName} Transcript\n\n`;
    const body = messages
      .map((msg) =>
        msg.role === "user" ? `### Prompt\n\n${msg.content}` : `### Response\n\n${msg.content}`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([title + body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = appConfig.exportFilename || "transcript.md";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function sendMessage(textOverride?: string) {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || streaming) {
      return;
    }

    setError(null);
    const userMessage: UiMessage = { id: nextId(), role: "user", content: trimmed };
    const assistantId = nextId();
    const nextHistory = [...messages, userMessage];

    setMessages([
      ...nextHistory,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    if (!textOverride) {
      setInput("");
    }
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          modeId,
          messages: nextHistory.map(({ role, content }) => ({ role, content })),
        }),
      });

      const headerMode = response.headers.get("X-AI-Mode");
      if (headerMode === "live" || headerMode === "demo") {
        setAiMode(headerMode);
      }

      if (!response.ok || !response.body) {
        const errPayload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errPayload.error || `Request failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventChunk of events) {
          for (const line of eventChunk.split("\n")) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) {
              continue;
            }
            const payload = trimmedLine.slice(5).trim();
            if (payload === "[DONE]") {
              continue;
            }
            try {
              const parsed = JSON.parse(payload) as { token?: string };
              if (parsed.token) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: msg.content + parsed.token }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore malformed partial events.
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || "Failed to stream response.");
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantId || msg.content.length > 0)
        );
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const activeMode = appConfig.modes.find((item) => item.id === modeId);

  return (
    <div
      className={`flex h-[calc(100vh-11rem)] min-h-[520px] flex-col rounded-2xl border shadow-xl ${appConfig.theme.cardBg} ${appConfig.theme.border}`}
    >
      {/* Mode selector + status bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${appConfig.theme.border}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {appConfig.modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setModeId(mode.id)}
              title={mode.description}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                modeId === mode.id
                  ? appConfig.theme.primaryButton
                  : "bg-slate-950/60 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {aiMode && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${appConfig.theme.accentBadge}`}
            >
              {aiMode === "live" ? "Live API" : "Demo Mode"}
            </span>
          )}
          {appConfig.enableMarkdownExport && messages.length > 0 && (
            <button
              type="button"
              onClick={exportMarkdown}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium ${appConfig.theme.secondaryButton}`}
            >
              Export .md
            </button>
          )}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearConversation}
              className="rounded-lg px-2.5 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">{appConfig.welcomeTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{appConfig.welcomeSubtitle}</p>
            {activeMode && (
              <p className={`mt-2 text-xs ${appConfig.theme.accentText}`}>
                Active mode: {activeMode.label} — {activeMode.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {appConfig.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className={`rounded-xl border px-3.5 py-2 text-left text-xs text-slate-200 transition hover:border-slate-500 ${appConfig.theme.border} bg-slate-950/60`}
                >
                  {prompt}
                </button>
              ))}
              {appConfig.sampleInput && (
                <button
                  type="button"
                  onClick={() => setInput(appConfig.sampleInput!.content)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition ${appConfig.theme.accentBadge}`}
                >
                  {appConfig.sampleInput.label}
                </button>
              )}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? appConfig.theme.userBubble
                    : appConfig.theme.assistantBubble
                }`}
              >
                {msg.content || (streaming ? "Thinking..." : "")}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleFormSubmit}
        className={`border-t p-3 sm:p-4 ${appConfig.theme.border}`}
      >
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={appConfig.inputPlaceholder}
            className="max-h-40 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-slate-500"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-40 ${appConfig.theme.primaryButton}`}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
