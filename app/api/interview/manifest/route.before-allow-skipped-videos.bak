import { put } from "@vercel/blob";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const {
      interviewId,
      fullName,
      email,
      blobPaths,
    } = body;

    if (
      typeof interviewId !== "string" ||
      !interviewId ||
      typeof fullName !== "string" ||
      !fullName ||
      typeof email !== "string" ||
      !email ||
      !Array.isArray(blobPaths) ||
      blobPaths.length !== 16 ||
      blobPaths.some(
        (path) => typeof path !== "string" || !path
      )
    ) {
      return Response.json(
        {
          error:
            "Invalid interview manifest data. All 16 video paths are required.",
        },
        { status: 400 }
      );
    }

    /*
     * Create the permanent interview manifest.
     */
    const manifest = {
      interviewId,
      fullName,
      email,
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
    const accessToken = crypto.randomUUID().replaceAll("-", "");

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