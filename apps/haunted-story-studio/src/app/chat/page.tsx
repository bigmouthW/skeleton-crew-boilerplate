import { redirect } from "next/navigation";
import { ChatPanel } from "@/components/ChatPanel";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <ChatPanel />;
}
