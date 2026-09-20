import { Resend } from "resend";
import { createHmac, randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const TOKEN_TTL_SECONDS = 15 * 60;

function createVerificationToken(email: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

  const payload = Buffer.from(
    JSON.stringify({
      email,
      expiresAt,
      nonce: randomBytes(16).toString("hex"),
    })
  ).toString("base64url");

  const secret = process.env.RESEND_API_KEY;

  if (!secret) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return Response.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return Response.json(
        { error: "Email verification is not configured." },
        { status: 500 }
      );
    }

    const token = createVerificationToken(email);

    const requestUrl = new URL(request.url);
    const verificationUrl =
      `${requestUrl.origin}/interview/start?emailVerification=${encodeURIComponent(token)}`;

    const { data, error } = await resend.emails.send({
      from: "Idyllic Education <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email for the Pre-CAS Mock Interview",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="color: #111827;">
            Verify your email address
          </h2>

          <p>
            Please confirm that this email address belongs to you before
            starting your Pre-CAS Mock Interview.
          </p>

          <p>
            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #111827;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Verify Email Address
            </a>
          </p>

          <p>
            This verification link expires in 15 minutes.
          </p>

          <p>
            If you did not request this verification, you can safely ignore
            this email.
          </p>

          <p>
            Regards,<br />
            Idyllic Education
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email verification error:", error);

      return Response.json(
        {
          error:
            error.message || "Unable to send the verification email.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Verification email sent.",
      email,
      emailId: data?.id ?? null,
    });
  } catch (error) {
    console.error("Email verification request failed:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send verification email.",
      },
      { status: 500 }
    );
  }
}