import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { UpstreamAiError, createAiStream, type ChatMessage } from "@/lib/ai";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages?: unknown;
  modeId?: unknown;
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }

  const cleaned: ChatMessage[] = [];
  for (const item of input.slice(-30)) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (
      (role === "user" || role === "assistant") &&
      typeof content === "string" &&
      content.trim().length > 0
    ) {
      cleaned.push({ role, content: content.slice(0, 12000) });
    }
  }

  return cleaned.length > 0 ? cleaned : null;
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "Provide at least one non-empty chat message." },
      { status: 400 }
    );
  }

  const modeId = typeof body.modeId === "string" ? body.modeId : undefined;

  try {
    const { stream, aiMode } = await createAiStream(messages, modeId);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-AI-Mode": aiMode,
      },
    });
  } catch (err) {
    if (err instanceof UpstreamAiError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    return NextResponse.json(
      { error: "Unable to process chat completion." },
      { status: 500 }
    );
  }
}
