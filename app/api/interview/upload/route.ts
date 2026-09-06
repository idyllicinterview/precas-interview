import { handleUpload } from "@vercel/blob/client";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("interviews/")) {
          throw new Error("Invalid upload path.");
        }

        return {
          allowedContentTypes: ["video/webm", "video/mp4"],
          maximumSizeInBytes: 250 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            purpose: "precas-interview-video",
          }),
        };
      },
      onUploadCompleted: async () => {
        // The permanent upload is now stored in Vercel Blob.
        // Interview completion processing will be added separately.
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload token error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to prepare Blob upload.",
      },
      { status: 500 }
    );
  }
}