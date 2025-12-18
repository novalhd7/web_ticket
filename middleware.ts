import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs"; // opsional (Next 15.5+)

export function middleware(req: NextRequest) {
  return NextResponse.next();
}
