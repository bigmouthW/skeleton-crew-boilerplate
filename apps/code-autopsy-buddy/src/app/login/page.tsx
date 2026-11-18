import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { appConfig } from "@/lib/app-config";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{appConfig.appName}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in or use the one-click demo account to unlock the AI workspace.
        </p>
      </div>
      <AuthForm />
    </div>
  );
}
