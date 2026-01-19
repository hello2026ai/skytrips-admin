import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // With localStorage-based auth, server can't enforce access.
  // Allow all routes to proceed; client-side checks in layout handle auth.
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
