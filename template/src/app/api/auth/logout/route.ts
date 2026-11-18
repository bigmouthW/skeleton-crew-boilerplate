import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getSessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", getSessionCookieOptions(0));
  return response;
}
