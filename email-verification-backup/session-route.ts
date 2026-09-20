import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_SECONDS = 15 * 60;
const COOKIE_NAME = "precas-email-verification";

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

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const token =
      typeof body?.token === "string" ? body.token.trim() : "";

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

    const response = Response.json({
      verified: true,
      email: result.email,
      expiresAt: result.expiresAt,
    });

    response.headers.set(
      "Set-Cookie",
      [
        `${COOKIE_NAME}=${encodeURIComponent(token)}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        `Max-Age=${TOKEN_TTL_SECONDS}`,
        process.env.NODE_ENV === "production" ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; ")
    );

    return response;
  } catch (error) {
    console.error(
      "Unable to create email verification session:",
      error
    );

    return Response.json(
      {
        verified: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create email verification session.",
      },
      { status: 500 }
    );
  }
}