import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { appConfig } from "@/lib/app-config";
import { getSessionUser } from "@/lib/auth";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.tagline,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className={`min-h-screen antialiased ${appConfig.theme.pageBg}`}>
        <Navbar user={user} />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
