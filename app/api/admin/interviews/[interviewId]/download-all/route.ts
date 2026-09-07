import { get } from "@vercel/blob";
import JSZip from "jszip";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSession,
} from "@/app/lib/adminAuth";

type InterviewManifest = {
  interviewId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  intake: string;
  startedAt: string;
  totalVideos: number;
  blobPaths: string[];
  createdAt: string;
};

type RouteContext = {
  params: Promise<{
    interviewId: string;
  }>;
};

function sanitizeFileName(value: string): string {
  return (
    value
      .trim()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 100) || "Applicant"
  );
}

export async function GET(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    /*
     * Verify the existing secure Admin session.
     */
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(
      getAdminSessionCookieName()
    )?.value;

    const session = verifyAdminSession(sessionToken);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { interviewId } = await context.params;

    if (
      !interviewId ||
      !/^[A-Za-z0-9_-]+$/.test(interviewId)
    ) {
      return NextResponse.json(
        {
          error: "Invalid interview ID.",
        },
        { status: 400 }
      );
    }

    /*
     * Load the private interview manifest.
     */
    const manifestPath =
      `interviews/${interviewId}/manifest.json`;

    const manifestResult = await get(manifestPath, {
      access: "private",
    });

    if (
      !manifestResult ||
      manifestResult.statusCode !== 200
    ) {
      return NextResponse.json(
        {
          error: "Interview manifest not found.",
        },
        { status: 404 }
      );
    }

    const manifestText = await new Response(
      manifestResult.stream
    ).text();

    const manifest =
      JSON.parse(manifestText) as Partial<InterviewManifest>;

    if (
      manifest.interviewId !== interviewId ||
      typeof manifest.fullName !== "string" ||
      !Array.isArray(manifest.blobPaths)
    ) {
      return NextResponse.json(
        {
          error: "Invalid interview manifest.",
        },
        { status: 500 }
      );
    }

    /*
     * Only use valid video paths belonging to this interview.
     */
    const expectedPrefix =
      `interviews/${interviewId}/`;

    const blobPaths = manifest.blobPaths.filter(
      (pathname): pathname is string =>
        typeof pathname === "string" &&
        pathname.startsWith(expectedPrefix) &&
        /\.(webm|mp4)$/i.test(pathname)
    );

    if (blobPaths.length === 0) {
      return NextResponse.json(
        {
          error:
            "No recorded videos are available for this interview.",
        },
        { status: 404 }
      );
    }

    /*
     * Create the ZIP on the server.
     */
    const zip = new JSZip();

    for (const pathname of blobPaths) {
      const result = await get(pathname, {
        access: "private",
      });

      if (
        !result ||
        result.statusCode !== 200
      ) {
        continue;
      }

      const videoBuffer = Buffer.from(
        await new Response(result.stream).arrayBuffer()
      );

      const fileName =
        pathname.split("/").pop() ??
        `recording-${Object.keys(zip.files).length + 1}.webm`;

      zip.file(fileName, videoBuffer);
    }

    if (Object.keys(zip.files).length === 0) {
      return NextResponse.json(
        {
          error:
            "No recorded videos could be downloaded.",
        },
        { status: 404 }
      );
    }

    /*
     * Generate the ZIP in memory.
     */
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "STORE",
    });

    const applicantName = sanitizeFileName(
      manifest.fullName
    );

    const interviewDate = new Date(
      typeof manifest.startedAt === "string"
        ? manifest.startedAt
        : Date.now()
    );

    const datePart = Number.isNaN(
      interviewDate.getTime()
    )
      ? new Date().toISOString().slice(0, 10)
      : interviewDate.toISOString().slice(0, 10);

    const downloadName =
      `${applicantName}_Interview_${datePart}.zip`;

    /*
     * Return the ZIP directly to the authenticated Admin.
     *
     * No private Blob URLs or Blob credentials
     * are exposed to the browser.
     */
    return new NextResponse(
      new Uint8Array(zipBuffer),
      {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition":
            `attachment; filename="${downloadName}"`,
          "Content-Length": String(zipBuffer.length),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "private, no-cache",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unable to download all interview recordings:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to download interview recordings.",
      },
      { status: 500 }
    );
  }
}