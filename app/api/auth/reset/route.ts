import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendResetEmail } from "@/lib/mailer";
import crypto from "crypto";

function makeToken(email: string) {
  const expires = Date.now() + 1000 * 60 * 60; // 1 hour
  const secret =
    process.env.RESET_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "default_secret";
  const payload = `${email}|${expires}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const token = Buffer.from(`${email}:${expires}:${sig}`).toString("base64url");
  return token;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || "").toString();

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // don't reveal whether email exists
      return NextResponse.json({
        ok: true,
        message: "If the email exists a reset link was sent",
      });
    }

    const token = makeToken(email);

    // send email (may throw)
    await sendResetEmail(email, token);

    return NextResponse.json({
      ok: true,
      message: "If the email exists a reset link was sent",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
