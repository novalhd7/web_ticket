import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { error: "Token tidak diberikan" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { activationToken: token },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Token tidak valid atau sudah digunakan." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true, activationToken: null },
  });

  // redirect ke halaman login
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${base}/login`);
}
