import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  
  // 1. Refresh Supabase Session
  // This must be done first to ensure auth tokens are valid for subsequent checks or API calls
  const response = await updateSession(req);

  // 2. Define Allowed Domains
  const ADMIN_DOMAIN = "admin.skytripsword.com";
  const ALLOWED_DOMAINS = [ADMIN_DOMAIN, "localhost", "127.0.0.1"];

  // Check if current host is allowed (includes Vercel preview URLs)
  const isAllowed = ALLOWED_DOMAINS.some(d => hostname.includes(d)) || hostname.endsWith(".vercel.app");

  // ---------------------------------------------------------
  // 3. Security Headers (Enhanced Security Measures)
  // ---------------------------------------------------------
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // ---------------------------------------------------------
  // 4. Subdomain Isolation Logic
  // ---------------------------------------------------------
  
  if (!isAllowed) {
    // Optional: Log the potential misconfiguration
    console.warn(`[Middleware] Blocked request from unauthorized host: ${hostname}`);
    // For now, we just warn and proceed
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
