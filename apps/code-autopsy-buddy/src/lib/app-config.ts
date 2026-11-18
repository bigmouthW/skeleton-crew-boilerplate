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
  appName: "Code Autopsy Buddy",
  shortMark: "CA",
  tagline: "Skeleton App #2 · AI Bug Autopsy & Code Review Assistant",
  heroTitle: "Perform fast forensic autopsies on broken code and stack traces.",
  heroDescription:
    "Built from the exact same Skeleton-Crew-Boilerplate: authenticate in one click, paste a snippet or stack trace, and stream structured root-cause diagnostics.",
  welcomeTitle: "Forensic Code Lab Ready",
  welcomeSubtitle:
    "Select an inspection mode above, paste code or an error log below, or insert the sample buggy snippet to test an autopsy.",
  inputPlaceholder: "Paste code, a diff, or a stack trace for autopsy...",
  systemPrompt:
    "You are a pragmatic senior software engineer performing a concise code autopsy. Structure responses into: 1) Root Cause / Risk, 2) Exact Fix, and 3) Quick Verification Step.",
  modes: [
    {
      id: "bugs",
      label: "Bug Hunt",
      description: "Pinpoint race conditions, null dereferences, and logic flaws.",
      systemInstruction:
        "Focus on runtime failures, off-by-one bugs, unhandled promises, and edge cases.",
    },
    {
      id: "security",
      label: "Security Check",
      description: "Spot injection vectors, broken auth checks, and secret leaks.",
      systemInstruction:
        "Audit strictly for auth bypasses, input validation gaps, timing attacks, and unsafe data exposure.",
    },
    {
      id: "refactor",
      label: "Refactor Plan",
      description: "Simplify tangled functions into clean, testable helpers.",
      systemInstruction:
        "Propose small, surgical refactors with minimal churn and clear naming.",
    },
  ],
  quickPrompts: [
    "Why does async forEach skip error handling in JavaScript?",
    "Review a Node.js HMAC verification check for timing-attack safety.",
    "Give me a 5-point pre-deploy sanity checklist for Next.js API routes.",
  ],
  enableMarkdownExport: true,
  exportFilename: "code-autopsy-report.md",
  sampleInput: {
    label: "+ Insert Sample Buggy Snippet",
    content: [
      "Audit this TypeScript handler:",
      "```ts",
      "async function verifyToken(inputSig: string, expectedSig: string) {",
      "  if (inputSig == expectedSig) return true;",
      "  return false;",
      "}",
      "async function saveAll(items: string[]) {",
      "  items.forEach(async (item) => { await db.insert(item); });",
      "  return { saved: items.length };",
      "}",
      "```",
    ].join("\n"),
  },
  theme: {
    pageBg: "bg-[#06110e] text-emerald-50",
    cardBg: "bg-[#0b1c17]/90",
    border: "border-emerald-900/60",
    accentBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
    primaryButton: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold",
    secondaryButton: "bg-emerald-950 hover:bg-emerald-900 text-emerald-100",
    userBubble: "bg-emerald-500 text-slate-950 font-medium",
    assistantBubble:
      "bg-[#10261f] text-emerald-50 border border-emerald-800/70",
    accentText: "text-emerald-400",
  },
  buildDemoReply(userMessage: string, modeId?: string) {
    const modeLabel =
      appConfig.modes.find((mode) => mode.id === modeId)?.label ?? "Bug Hunt";

    return [
      `### [Demo Autopsy · ${modeLabel}]`,
      "",
      `Inspected input (${userMessage.length} chars):`,
      "",
      "1. **Primary Finding**: Check asynchronous boundaries and constant-time comparisons. For example, `Array.prototype.forEach(async ...)` fires promises without awaiting completion, causing premature `200 OK` responses and swallowed rejections.",
      "2. **Recommended Fix**: Replace `forEach` with `await Promise.all(items.map(...))` (or a `for...of` loop when sequential order matters), and use `crypto.timingSafeEqual` after verifying equal buffer lengths.",
      "3. **Verification**: Add a failing unit test covering rejected writes and mismatched signature lengths, then confirm both pass.",
    ].join("\n");
  },
};
