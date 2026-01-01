import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // dari NextAuth v4

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Hanya proteksi route /admin/*
  if (url.pathname.startsWith("/admin")) {
    // Ambil JWT session dari cookie NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Jika user tidak login, redirect ke login page
      url.pathname = "/auth/Login";
      return NextResponse.redirect(url);
    }

    // Optional: cek role atau isActive
    if (!token.isActive || token.role !== "ADMIN") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Tentukan path yang di-proteksi middleware
export const config = {
  matcher: ["/admin/:path*"],
};
