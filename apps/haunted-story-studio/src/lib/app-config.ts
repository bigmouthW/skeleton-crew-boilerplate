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
  appName: "Haunted Story Studio",
  shortMark: "HS",
  tagline: "Skeleton App #1 · Interactive AI Ghost-Story Co-Writer",
  heroTitle: "Co-write eerie, branching ghost stories with an AI narrator.",
  heroDescription:
    "Built from Skeleton-Crew-Boilerplate: sign in, pick a haunted setting, improvise scenes turn by turn, and export your completed tale as Markdown.",
  welcomeTitle: "The Midnight Typewriter Awaits",
  welcomeSubtitle:
    "Choose a haunted setting above and write an opening line—or pick a starter below to summon Chapter One.",
  inputPlaceholder: "Describe the next spooky turn in the story...",
  systemPrompt:
    "You are an atmospheric horror and suspense co-writer. Keep scenes vivid, concise (2-3 paragraphs), and always end with a subtle hook or choice for the human co-author.",
  modes: [
    {
      id: "manor",
      label: "Victorian Manor",
      description: "Candlelit hallways, locked attics, and whispering portraits.",
      systemInstruction:
        "Set the scene in a fog-wrapped 19th-century cliffside manor with creaking floorboards and hidden family secrets.",
    },
    {
      id: "subway",
      label: "Abandoned Subway",
      description: "Flickering fluorescent tubes and trains that stopped in 1978.",
      systemInstruction:
        "Set the scene in a forgotten underground transit station where echoes arrive seconds before anyone speaks.",
    },
    {
      id: "cursed-repo",
      label: "Cursed Git Repo",
      description: "Midnight commits from contributors who left years ago.",
      systemInstruction:
        "Blend haunted folklore with software engineering: ghostly commits, phantom build logs, and an uncanny localhost server.",
    },
  ],
  quickPrompts: [
    "Open Chapter 1: We unlock a server room door that isn't on the building blueprints.",
    "Introduce a lantern-bearing caretaker who knows our names before we speak.",
    "Twist the plot: the footsteps upstairs match our exact pace.",
  ],
  enableMarkdownExport: true,
  exportFilename: "haunted-story.md",
  theme: {
    pageBg: "bg-[#0c0714] text-purple-50",
    cardBg: "bg-[#150d22]/85",
    border: "border-purple-900/60",
    accentBadge: "bg-orange-500/15 text-orange-300 border-orange-500/35",
    primaryButton: "bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold",
    secondaryButton: "bg-purple-950 hover:bg-purple-900 text-purple-100",
    userBubble: "bg-orange-500 text-slate-950 font-medium",
    assistantBubble:
      "bg-[#1c122e] text-purple-100 border border-purple-800/70",
    accentText: "text-orange-400",
  },
  buildDemoReply(userMessage: string, modeId?: string) {
    const openings: Record<string, string> = {
      manor:
        "A cold draft snuffed out the hallway candle just as the grandfather clock struck thirteen. Behind the damp wallpaper, something tapped back in steady Morse code.",
      subway:
        "The rusted turnstile clicked by itself, and down the pitch-black tunnel two amber headlights flared without a sound on the rails.",
      "cursed-repo":
        "Your terminal printed a new commit authored at `03:33:33 AM` by `unknown@localhost`: *'Do not revert this file—it keeps the basement process asleep.'*",
    };

    const scene = openings[modeId || "manor"] || openings.manor;

    return [
      `_[Demo Narrator · ${modeId || "manor"}]_`,
      "",
      scene,
      "",
      `Responding to your beat (*"${userMessage.slice(0, 100)}"*), the air grows noticeably colder as a narrow brass key slides across the floor toward your boots.`,
      "",
      "**Your turn:** Do you pick up the key, or follow the faint humming behind the wall? *(Click **Export .md** anytime to save your story.)*",
    ].join("\n");
  },
};
