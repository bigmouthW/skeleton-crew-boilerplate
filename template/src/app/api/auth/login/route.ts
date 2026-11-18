import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  authenticateUser,
  createSessionToken,
  getSessionCookieOptions,
  loginAsDemoUser,
  registerUser,
  type SessionUser,
} from "@/lib/auth";

export const runtime = "nodejs";

interface AuthBody {
  mode?: "login" | "register" | "demo";
  email?: string;
  password?: string;
  name?: string;
}

export async function POST(request: Request) {
  let body: AuthBody;
  try {
    body = (await request.json()) as AuthBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const mode = body.mode ?? "login";
  let user: SessionUser | null = null;

  if (mode === "demo") {
    user = loginAsDemoUser();
  } else if (mode === "register") {
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name : undefined;
    const result = registerUser(email, password, name);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    user = result.user;
  } else {
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
  }

  const token = createSessionToken(user);
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  return response;
}
