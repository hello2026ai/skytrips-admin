import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("sky_admin_session")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (token) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
