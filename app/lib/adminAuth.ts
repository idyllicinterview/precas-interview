import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE = "precas_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 hours

type AdminSessionPayload = {
  role: "admin";
  username: string;
  expiresAt: number;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

  return Buffer.from(padded, "base64").toString("utf8");
}

function createSignature(payload: string): string {
  const secret = getRequiredEnv("ADMIN_SESSION_SECRET");

  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const expectedUsername = getRequiredEnv("ADMIN_USERNAME");
  const expectedPassword = getRequiredEnv("ADMIN_PASSWORD");

  return (
    safeEqual(username, expectedUsername) &&
    safeEqual(password, expectedPassword)
  );
}

export function createAdminSession(username: string): string {
  const payload: AdminSessionPayload = {
    role: "admin",
    username,
    expiresAt:
      Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };

  const encodedPayload = base64UrlEncode(
    JSON.stringify(payload)
  );

  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSession(
  sessionToken: string | undefined
): AdminSessionPayload | null {
  if (!sessionToken) {
    return null;
  }

  const separatorIndex = sessionToken.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const encodedPayload = sessionToken.slice(
    0,
    separatorIndex
  );

  const providedSignature = sessionToken.slice(
    separatorIndex + 1
  );

  try {
    const expectedSignature =
      createSignature(encodedPayload);

    if (
      !safeEqual(
        providedSignature,
        expectedSignature
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as AdminSessionPayload;

    if (
      payload.role !== "admin" ||
      typeof payload.username !== "string" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    if (payload.expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionCookieName(): string {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function getExpiredAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  };
}