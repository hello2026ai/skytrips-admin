import { createClient } from "@/lib/supabase-ssr";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: roleId } = await params;

  try {
    // 1. Check Authentication & Authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
       const { data: userRole } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', user.id)
         .eq('role', 'admin')
         .single();
       if (!userRole) {
         return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
       }
    }

    const body = await request.json();
    const { name, description, modules } = body;

    // 1. Update Role details
    const { error: roleError } = await supabase
      .from("roles")
      .update({ name, description })
      .eq("id", roleId);

    if (roleError) throw roleError;

    // 2. Update Permissions
    // Strategy: Upsert permissions
    const permissionsToUpsert = modules.map((m: any) => ({
      role_id: roleId,
      module_id: m.id,
      can_view: m.permissions.view,
      can_add: m.permissions.add,
      can_edit: m.permissions.edit,
      can_delete: m.permissions.delete,
    }));

    const { error: permError } = await supabase
      .from("role_permissions")
      .upsert(permissionsToUpsert, { onConflict: "role_id, module_id" });

    if (permError) throw permError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: roleId } = await params;

  try {
    // 1. Check Authentication & Authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
       const { data: userRole } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', user.id)
         .eq('role', 'admin')
         .single();
       if (!userRole) {
         return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
       }
    }

    // Check if system role
    const { data: role, error: fetchError } = await supabase
      .from("roles")
      .select("is_system")
      .eq("id", roleId)
      .single();

    if (fetchError) throw fetchError;
    if (role.is_system) {
      return NextResponse.json(
        { error: "Cannot delete system roles" },
        { status: 403 }
      );
    }

    // Delete role (permissions cascade delete)
    const { error: deleteError } = await supabase
      .from("roles")
      .delete()
      .eq("id", roleId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete role" },
      { status: 500 }
    );
  }
}
