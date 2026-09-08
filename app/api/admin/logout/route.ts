import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  getExpiredAdminSessionCookieOptions,
} from "@/app/lib/adminAuth";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(
    getAdminSessionCookieName(),
    "",
    getExpiredAdminSessionCookieOptions()
  );

  return NextResponse.json({ success: true });
}
