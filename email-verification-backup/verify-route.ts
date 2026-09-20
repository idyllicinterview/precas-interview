import { createHmac, timingSafeEqual } from "crypto";

function validateVerificationToken(token: string) {
  const secret = process.env.RESEND_API_KEY;

  if (!secret) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return {
      valid: false,
      error: "Invalid verification token.",
    };
  }

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return {
      valid: false,
      error: "Invalid verification token.",
    };
  }

  let decodedPayload: {
    email?: string;
    expiresAt?: number;
    nonce?: string;
  };

  try {
    decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
  } catch {
    return {
      valid: false,
      error: "Invalid verification token.",
    };
  }

  if (
    typeof decodedPayload.email !== "string" ||
    !decodedPayload.email ||
    typeof decodedPayload.expiresAt !== "number"
  ) {
    return {
      valid: false,
      error: "Invalid verification token.",
    };
  }

  const now = Math.floor(Date.now() / 1000);

  if (decodedPayload.expiresAt <= now) {
    return {
      valid: false,
      error: "Verification link has expired.",
    };
  }

  return {
    valid: true,
    email: decodedPayload.email,
    expiresAt: decodedPayload.expiresAt,
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    const requestUrl = new URL(request.url);
    const token = requestUrl.searchParams.get("token")?.trim() ?? "";

    if (!token) {
      return Response.json(
        {
          verified: false,
          error: "Verification token is required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return Response.json(
        {
          verified: false,
          error: "Email verification is not configured.",
        },
        { status: 500 }
      );
    }

    const result = validateVerificationToken(token);

    if (!result.valid) {
      return Response.json(
        {
          verified: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return Response.json({
      verified: true,
      email: result.email,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("Email verification validation failed:", error);

    return Response.json(
      {
        verified: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify email address.",
      },
      { status: 500 }
    );
  }
}