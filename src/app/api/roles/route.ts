import { createClient } from "@/lib/supabase-ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { INITIAL_MODULES } from "@/components/dashboard/roles/types";
import { getTokenFromRequest, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Admin client to bypass RLS
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const supabase = await createClient();

  try {
    // Fetch roles with permissions
    const { data: roles, error } = await supabase
      .from("roles")
      .select(`
        *,
        role_permissions (*)
      `)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Transform data to match frontend structure
    const formattedRoles = roles.map((role: { id: string; name: string; description: string; is_system: boolean; role_permissions: { module_id: string; can_view: boolean; can_add: boolean; can_edit: boolean; can_delete: boolean }[] }) => {
      // Create a map of existing permissions
      const permissionMap = new Map();
      role.role_permissions.forEach((p: { module_id: string; can_view: boolean; can_add: boolean; can_edit: boolean; can_delete: boolean }) => {
        permissionMap.set(p.module_id, {
          view: p.can_view,
          add: p.can_add,
          edit: p.can_edit,
          delete: p.can_delete,
        });
      });

      // Merge with INITIAL_MODULES to ensure all modules are present
      const modules = INITIAL_MODULES.map((module) => {
        const existing = permissionMap.get(module.id);
        return {
          ...module,
          permissions: existing || {
            view: false,
            add: false,
            edit: false,
            delete: false,
          },
        };
      });

      return {
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.is_system,
        modules,
      };
    });

    return NextResponse.json(formattedRoles);
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate using custom admin session (Cookie or Bearer)
    const token = getTokenFromRequest(request);
    const session = verifySession(token);

    if (!session) {
      console.log("[POST /api/roles] Unauthorized (no admin session)");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorize: only users with role 'admin' in the admin app
    if (session.role !== "admin") {
      console.log(`[POST /api/roles] Access Denied. Session role: ${session.role}`);
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    console.log(`[POST /api/roles] Access Granted for ${session.email}. Proceeding to create role.`);
    const body = await request.json();
    const { name, description, modules } = body;

    // 3. Create Role (Using Admin Client to bypass RLS)
    const { data: role, error: roleError } = await supabaseAdmin
      .from("roles")
      .insert({
        name,
        description,
        is_system: false,
      })
      .select()
      .single();

    if (roleError) throw roleError;

    // 4. Create Permissions (Using Admin Client)
    const permissions = modules.map((m: { id: string; permissions: { view: boolean; add: boolean; edit: boolean; delete: boolean } }) => ({
      role_id: role.id,
      module_id: m.id,
      can_view: m.permissions.view,
      can_add: m.permissions.add,
      can_edit: m.permissions.edit,
      can_delete: m.permissions.delete,
    }));

    const { error: permError } = await supabaseAdmin
      .from("role_permissions")
      .insert(permissions);

    if (permError) {
      // Rollback role creation if permissions fail
      await supabaseAdmin.from("roles").delete().eq("id", role.id);
      throw permError;
    }

    return NextResponse.json({ success: true, role });
  } catch (error: any) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create role" },
      { status: 500 }
    );
  }
}
