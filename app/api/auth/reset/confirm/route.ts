import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { hash } from "bcryptjs";

function verifyToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, expiresStr, sig] = decoded.split(":");
    const expires = Number(expiresStr || 0);
    if (!email || !expires || !sig) return null;
    if (Date.now() > expires) return null;
    const secret =
      process.env.RESET_TOKEN_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "default_secret";
    const payload = `${email}|${expires}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig)))
      return null;
    return email;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = (body?.token || "").toString();
    const password = (body?.password || "").toString();

    if (!token || !password) {
      return NextResponse.json(
        { ok: false, message: "Token and password required" },
        { status: 400 }
      );
    }

    const email = verifyToken(token);
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    const hashed = await hash(password, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    return NextResponse.json({ ok: true, message: "Password updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
