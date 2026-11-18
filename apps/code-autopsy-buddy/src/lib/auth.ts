import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

interface StoredUser extends SessionUser {
  salt: string;
  passwordHash: string;
}

interface SessionPayload {
  user: SessionUser;
  exp: number;
}

export const SESSION_COOKIE_NAME = "sk_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const globalForAuth = globalThis as typeof globalThis & {
  __skeletonUsers?: Map<string, StoredUser>;
};

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "skeleton-crew-dev-secret-change-in-production";
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPasswordHash(password: string, salt: string, storedHash: string): boolean {
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(storedHash, "hex");
  if (derived.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}

export function getDemoCredentials(): { email: string; password: string; name: string } {
  return {
    email: (process.env.DEMO_USER_EMAIL || "demo@skeleton.dev").trim().toLowerCase(),
    password: process.env.DEMO_USER_PASSWORD || "spooky-demo",
    name: "Demo Hacker",
  };
}

function getUserStore(): Map<string, StoredUser> {
  if (!globalForAuth.__skeletonUsers) {
    globalForAuth.__skeletonUsers = new Map<string, StoredUser>();
  }

  const demo = getDemoCredentials();
  if (!globalForAuth.__skeletonUsers.has(demo.email)) {
    const salt = randomBytes(16).toString("hex");
    globalForAuth.__skeletonUsers.set(demo.email, {
      id: "user_demo",
      email: demo.email,
      name: demo.name,
      salt,
      passwordHash: hashPassword(demo.password, salt),
    });
  }

  return globalForAuth.__skeletonUsers;
}

function toSessionUser(user: StoredUser): SessionUser {
  return { id: user.id, email: user.email, name: user.name };
}

/**
 * Swap these helpers with Auth.js, Clerk, or Supabase when you add a real database.
 */
export function authenticateUser(email: string, password: string): SessionUser | null {
  const normalized = email.trim().toLowerCase();
  const user = getUserStore().get(normalized);
  if (!user) {
    return null;
  }
  return verifyPasswordHash(password, user.salt, user.passwordHash)
    ? toSessionUser(user)
    : null;
}

export function registerUser(
  email: string,
  password: string,
  name?: string
): { ok: true; user: SessionUser } | { ok: false; error: string } {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters long." };
  }

  const store = getUserStore();
  if (store.has(normalized)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const salt = randomBytes(16).toString("hex");
  const displayName = (name || normalized.split("@")[0] || "Builder").trim();
  const created: StoredUser = {
    id: `user_${randomBytes(6).toString("hex")}`,
    email: normalized,
    name: displayName,
    salt,
    passwordHash: hashPassword(password, salt),
  };

  store.set(normalized, created);
  return { ok: true, user: toSessionUser(created) };
}

export function loginAsDemoUser(): SessionUser {
  const demo = getDemoCredentials();
  const store = getUserStore();
  const existing = store.get(demo.email);
  if (existing) {
    return toSessionUser(existing);
  }
  return { id: "user_demo", email: demo.email, name: demo.name };
}

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encoded, signature] = parts;
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getAuthSecret())
    .update(encoded)
    .digest("base64url");

  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!parsed?.user?.id || !parsed?.user?.email || typeof parsed.exp !== "number") {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed.user;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge,
  };
}
