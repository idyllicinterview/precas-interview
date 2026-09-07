import { put } from "@vercel/blob";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const {
      interviewId,
      fullName,
      email,
      phone,
      university,
      course,
      intake,
      startedAt,
      blobPaths,
    } = body;

    if (
      typeof interviewId !== "string" ||
      !interviewId ||
      typeof fullName !== "string" ||
      !fullName ||
      typeof email !== "string" ||
      !email ||
      typeof phone !== "string" ||
      typeof university !== "string" ||
      typeof course !== "string" ||
      typeof intake !== "string" ||
      typeof startedAt !== "string" ||
      !startedAt ||
      !Array.isArray(blobPaths) ||
      blobPaths.length > 16 ||
      blobPaths.some(
        (path) => typeof path !== "string" || !path
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid interview manifest data.",
        },
        { status: 400 }
      );
    }

    /*
     * Create the permanent interview manifest.
     *
     * Fewer than 16 videos are allowed because
     * candidates may skip questions.
     */
    const manifest = {
      interviewId,
      fullName,
      email,
      phone,
      university,
      course,
      intake,
      startedAt,
      totalVideos: blobPaths.length,
      blobPaths,
      createdAt: new Date().toISOString(),
    };

    const manifestBlob = await put(
      `interviews/${interviewId}/manifest.json`,
      JSON.stringify(manifest, null, 2),
      {
        access: "private",
        addRandomSuffix: false,
        contentType: "application/json",
      }
    );

    /*
     * Create a secure download token.
     */
    const accessToken = crypto
      .randomUUID()
      .replaceAll("-", "");

    /*
     * Give the download link a limited lifetime.
     *
     * The token will remain valid for 7 days.
     */
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const accessRecord = {
      interviewId,
      token: accessToken,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    /*
     * Store the access record privately.
     */
    await put(
      `interviews/download-access/${accessToken}.json`,
      JSON.stringify(accessRecord, null, 2),
      {
        access: "private",
        addRandomSuffix: false,
        contentType: "application/json",
      }
    );

    return Response.json({
      success: true,
      pathname: manifestBlob.pathname,
      accessToken,
      expiresAt,
    });
  } catch (error) {
    console.error(
      "Unable to create interview manifest:",
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create interview manifest.",
      },
      { status: 500 }
    );
  }
}