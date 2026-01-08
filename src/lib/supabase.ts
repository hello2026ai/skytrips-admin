import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }

    return data?.role === "admin";
  } catch (error) {
    console.error("Error in isUserAdmin:", error);
    return false;
  }
}

// Get current session
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return session;
}

// Get current user with admin check
export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return { user: null, isAdmin: false };
  }

  const isAdmin = await isUserAdmin(session.user.id);
  return { user: session.user, isAdmin };
}
