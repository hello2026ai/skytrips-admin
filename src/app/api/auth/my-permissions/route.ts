import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getTokenFromRequest, verifySession } from "@/lib/auth";

// Admin client to bypass RLS for fetching permissions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);
  const session = verifySession(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Determine high-level role from session
    // For now we map the legacy 'admin' to the RBAC 'Manager' role
    let roleName = "Staff";
    if (session.role === "admin") {
      roleName = "Manager";
    } else if (session.role === "user") {
      roleName = "Staff";
    }

    // 2. Fetch permissions for the mapped role from RBAC tables
    const { data: roleData, error: roleLookupError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleLookupError) {
      console.error("[my-permissions] Error looking up role:", roleLookupError);
    }

    let permissions: { module_id: string; can_view: boolean; can_add: boolean; can_edit: boolean; can_delete: boolean }[] = [];

    if (roleData) {
      const { data: perms, error: permsError } = await supabaseAdmin
        .from("role_permissions")
        .select("module_id, can_view, can_add, can_edit, can_delete")
        .eq("role_id", roleData.id);

      if (permsError) {
        console.error("[my-permissions] Error loading permissions:", permsError);
      } else if (perms) {
        permissions = perms;
      }
    }

    return NextResponse.json({
      role: roleName,
      permissions,
    });
  } catch (error) {
    console.error("Permission API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
