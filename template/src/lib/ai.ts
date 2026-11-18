import { appConfig } from "./app-config";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class UpstreamAiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function encodeSseData(payload: string): Uint8Array {
  return new TextEncoder().encode(`data: ${payload}\n\n`);
}

function buildSystemPrompt(modeId?: string): string {
  const mode = appConfig.modes.find((item) => item.id === modeId);
  if (!mode) {
    return appConfig.systemPrompt;
  }
  return `${appConfig.systemPrompt}\n\nActive Mode (${mode.label}): ${mode.systemInstruction}`;
}

function createDemoStream(userMessage: string, modeId?: string): ReadableStream<Uint8Array> {
  const fullText = appConfig.buildDemoReply(userMessage, modeId);
  const chunks = fullText.split(/(\s+)/).filter((part) => part.length > 0);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const chunk of chunks) {
          controller.enqueue(encodeSseData(JSON.stringify({ token: chunk })));
          await new Promise((resolve) => setTimeout(resolve, 22));
        }
        controller.enqueue(encodeSseData("[DONE]"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

function transformOpenAiStream(
  upstreamBody: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const reader = upstreamBody.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) {
              continue;
            }

            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.enqueue(encodeSseData("[DONE]"));
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                controller.enqueue(encodeSseData(JSON.stringify({ token })));
              }
            } catch {
              // Ignore non-JSON keepalive comments or partial SSE metadata frames.
            }
          }
        }

        controller.enqueue(encodeSseData("[DONE]"));
        controller.close();
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      void reader.cancel();
    },
  });
}

export async function createAiStream(
  messages: ChatMessage[],
  modeId?: string
): Promise<{ stream: ReadableStream<Uint8Array>; aiMode: "live" | "demo" }> {
  const apiKey = process.env.AI_API_KEY?.trim();
  const lastUserMessage =
    [...messages].reverse().find((msg) => msg.role === "user")?.content ?? "";

  if (!apiKey) {
    return {
      stream: createDemoStream(lastUserMessage, modeId),
      aiMode: "demo",
    };
  }

  const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/+$/,
    ""
  );
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  const payloadMessages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(modeId) },
    ...messages.filter((msg) => msg.role !== "system"),
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: payloadMessages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "Upstream AI request failed");
    throw new UpstreamAiError(
      response.status || 502,
      `AI provider returned ${response.status}: ${errorText.slice(0, 200)}`
    );
  }

  return {
    stream: transformOpenAiStream(response.body),
    aiMode: "live",
  };
}
