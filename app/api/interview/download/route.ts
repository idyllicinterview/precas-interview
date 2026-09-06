import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

type DownloadAccessRecord = {
  interviewId: string;
  token: string;
  expiresAt: string;
};

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const token =
      request.nextUrl.searchParams.get("token");

    const pathname =
      request.nextUrl.searchParams.get("pathname");

    if (!token || !pathname) {
      return NextResponse.json(
        {
          error:
            "A valid download token and pathname are required.",
        },
        { status: 400 }
      );
    }

    if (!/^[-_A-Za-z0-9]{20,200}$/.test(token)) {
      return NextResponse.json(
        {
          error: "Invalid download token.",
        },
        { status: 400 }
      );
    }

    if (!pathname.startsWith("interviews/")) {
      return NextResponse.json(
        {
          error: "Invalid interview file path.",
        },
        { status: 400 }
      );
    }

    /*
     * Load the server-side access record.
     */
    const accessPath =
      `interviews/download-access/${token}.json`;

    const accessResult = await get(accessPath, {
      access: "private",
    });

    if (
      !accessResult ||
      accessResult.statusCode !== 200
    ) {
      return NextResponse.json(
        {
          error: "Invalid or expired download link.",
        },
        { status: 403 }
      );
    }

    const accessText =
      await new Response(
        accessResult.stream
      ).text();

    const accessRecord =
      JSON.parse(accessText) as DownloadAccessRecord;

    if (
      accessRecord.token !== token ||
      !accessRecord.interviewId ||
      !accessRecord.expiresAt
    ) {
      return NextResponse.json(
        {
          error: "Invalid download access record.",
        },
        { status: 403 }
      );
    }

    /*
     * Check token expiration.
     */
    if (
      new Date(accessRecord.expiresAt).getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          error: "This download link has expired.",
        },
        { status: 403 }
      );
    }

    /*
     * The requested recording must belong
     * to the interview associated with this token.
     */
    const expectedPrefix =
      `interviews/${accessRecord.interviewId}/`;

    if (!pathname.startsWith(expectedPrefix)) {
      return NextResponse.json(
        {
          error:
            "This recording is not part of the authorized interview.",
        },
        { status: 403 }
      );
    }

    const result = await get(pathname, {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json(
        {
          error: "Interview recording not found.",
        },
        { status: 404 }
      );
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type":
          result.blob.contentType ??
          "application/octet-stream",
        "Content-Disposition":
          result.blob.contentDisposition,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control":
          "private, no-cache",
      },
    });
  } catch (error) {
    console.error(
      "Unable to download private interview recording:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to download interview recording.",
      },
      { status: 500 }
    );
  }
}