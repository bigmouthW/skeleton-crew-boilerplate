export interface AppMode {
  id: string;
  label: string;
  description: string;
  systemInstruction: string;
}

export interface AppTheme {
  pageBg: string;
  cardBg: string;
  border: string;
  accentBadge: string;
  primaryButton: string;
  secondaryButton: string;
  userBubble: string;
  assistantBubble: string;
  accentText: string;
}

export interface AppConfig {
  appName: string;
  shortMark: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  inputPlaceholder: string;
  systemPrompt: string;
  modes: AppMode[];
  quickPrompts: string[];
  enableMarkdownExport?: boolean;
  exportFilename?: string;
  sampleInput?: {
    label: string;
    content: string;
  };
  theme: AppTheme;
  buildDemoReply: (userMessage: string, modeId?: string) => string;
}

export const appConfig: AppConfig = {
  appName: "Skeleton Crew Starter",
  shortMark: "SK",
  tagline: "Minimal Next.js + Auth + Streaming AI Chat",
  heroTitle: "Start hacking your AI app in minutes, not hours.",
  heroDescription:
    "A lean, readable Next.js App Router boilerplate with zero-database signed cookie auth, protected routes, and OpenAI-compatible SSE streaming.",
  welcomeTitle: "Welcome to the Skeleton Chat Workspace",
  welcomeSubtitle:
    "Pick a mode or prompt below to test protected SSE streaming. Without AI_API_KEY, built-in Demo Mode responds automatically.",
  inputPlaceholder: "Ask anything or test a prompt...",
  systemPrompt:
    "You are a concise, helpful AI assistant inside Skeleton Crew Starter, a minimal Next.js template.",
  modes: [
    {
      id: "assistant",
      label: "General Assistant",
      description: "Balanced, concise answers for everyday prompts.",
      systemInstruction: "Answer clearly and concisely using Markdown when helpful.",
    },
    {
      id: "brainstorm",
      label: "Hackathon Coach",
      description: "Scope ideas fast into an MVP you can ship today.",
      systemInstruction:
        "Act as a pragmatic hackathon mentor. Break ideas into a 3-step MVP plan.",
    },
  ],
  quickPrompts: [
    "Explain how this skeleton protects /chat and /api/chat.",
    "Give me 3 hackathon app ideas I can build on this template.",
    "Write a quick checklist to deploy this Next.js app.",
  ],
  theme: {
    pageBg: "bg-slate-950 text-slate-100",
    cardBg: "bg-slate-900/80",
    border: "border-slate-800",
    accentBadge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    primaryButton: "bg-indigo-500 hover:bg-indigo-400 text-white",
    secondaryButton: "bg-slate-800 hover:bg-slate-700 text-slate-100",
    userBubble: "bg-indigo-600 text-white",
    assistantBubble: "bg-slate-800/90 text-slate-100 border border-slate-700",
    accentText: "text-indigo-400",
  },
  buildDemoReply(userMessage: string, modeId?: string) {
    const activeMode =
      appConfig.modes.find((mode) => mode.id === modeId)?.label ?? "General Assistant";

    return [
      `**[Demo Mode — ${activeMode}]**`,
      "",
      `You asked: _"${userMessage.slice(0, 140)}"_`,
      "",
      "This skeleton is streaming via **Server-Sent Events** from `/api/chat` after verifying your signed HTTP-only session cookie.",
      "",
      "- Edit `src/lib/app-config.ts` to change branding, prompts, and modes.",
      "- Set `AI_API_KEY` in `.env.local` to connect OpenAI, OpenRouter, DeepSeek, or any OpenAI-compatible model.",
    ].join("\n");
  },
};
