import { get, list } from "@vercel/blob";
import { cookies } from "next/headers";
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

export async function GET(): Promise<Response> {
  try {
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get(
      getAdminSessionCookieName()
    )?.value;

    const session = verifyAdminSession(sessionToken);

    if (!session) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const result = await list({
      prefix: "interviews/",
    });

    const manifestBlobs = result.blobs.filter(
      (blob) =>
        blob.pathname.startsWith("interviews/") &&
        blob.pathname.endsWith("/manifest.json")
    );

    const interviews: InterviewManifest[] = [];

    for (const blob of manifestBlobs) {
      try {
        const stored = await get(blob.pathname, {
          access: "private",
        });

        if (!stored) {
          continue;
        }

        const text = await new Response(
          stored.stream
        ).text();

        const manifest = JSON.parse(
          text
        ) as Partial<InterviewManifest>;

        if (
          typeof manifest.interviewId !== "string" ||
          typeof manifest.fullName !== "string" ||
          typeof manifest.email !== "string" ||
          typeof manifest.phone !== "string" ||
          typeof manifest.university !== "string" ||
          typeof manifest.course !== "string" ||
          typeof manifest.intake !== "string" ||
          typeof manifest.startedAt !== "string" ||
          !Array.isArray(manifest.blobPaths)
        ) {
          continue;
        }

        interviews.push({
          interviewId: manifest.interviewId,
          fullName: manifest.fullName,
          email: manifest.email,
          phone: manifest.phone,
          university: manifest.university,
          course: manifest.course,
          intake: manifest.intake,
          startedAt: manifest.startedAt,
          totalVideos: manifest.blobPaths.length,
          blobPaths: manifest.blobPaths,
          createdAt:
            typeof manifest.createdAt === "string"
              ? manifest.createdAt
              : blob.uploadedAt.toISOString(),
        });
      } catch (error) {
        console.error(
          `Unable to read interview manifest ${blob.pathname}:`,
          error
        );
      }
    }

    interviews.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() -
        new Date(a.startedAt).getTime()
    );

    return Response.json(
      {
        success: true,
        interviews,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unable to load admin interview records:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load interview records.",
      },
      { status: 500 }
    );
  }
}
