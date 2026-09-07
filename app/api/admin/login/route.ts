import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSession,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
  verifyAdminCredentials,
} from "@/app/lib/adminAuth";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const username =
      typeof body?.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const validCredentials =
      verifyAdminCredentials(username, password);

    if (!validCredentials) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const sessionToken =
      createAdminSession(username);

    const cookieStore = await cookies();

    cookieStore.set(
      getAdminSessionCookieName(),
      sessionToken,
      getAdminSessionCookieOptions()
    );

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process admin login.",
      },
      { status: 500 }
    );
  }
}
