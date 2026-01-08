import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(`${origin}/?error=auth_failed`);
      }

      if (data.user) {
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (roleError || roleData?.role !== "admin") {
          // User doesn't have admin role - sign them out
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/?error=admin_access_required`
          );
        }

        // User is an admin - redirect to dashboard
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    } catch (err) {
      console.error("Callback error:", err);
      return NextResponse.redirect(`${origin}/?error=auth_error`);
    }
  }

  // No code present, redirect to home
  return NextResponse.redirect(`${origin}/`);
}
