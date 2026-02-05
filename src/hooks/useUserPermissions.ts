import { useEffect, useState } from "react";

export type PermissionAction = "view" | "add" | "edit" | "delete";

export function useUserPermissions() {
  const [permissions, setPermissions] = useState<Map<string, Set<PermissionAction>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        // Fetch from server-side API; authentication is handled via HTTP-only cookie or Bearer token
        const token = typeof window !== "undefined" ? localStorage.getItem("sky_admin_session") : null;
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("/api/auth/my-permissions", { headers });
        if (!response.ok) {
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        console.log(`[useUserPermissions] Loaded Role: ${data.role}`);
        setRoleName(data.role);

        if (data.permissions) {
          const newPerms = new Map<string, Set<PermissionAction>>();
          data.permissions.forEach((p: { module_id: string; can_view: boolean; can_add: boolean; can_edit: boolean; can_delete: boolean }) => {
            const actions = new Set<PermissionAction>();
            if (p.can_view) actions.add("view");
            if (p.can_add) actions.add("add");
            if (p.can_edit) actions.add("edit");
            if (p.can_delete) actions.add("delete");
            newPerms.set(p.module_id, actions);
          });
          setPermissions(newPerms);
        }

      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  const can = (module: string, action: PermissionAction) => {
    // Admins/Managers generally have full access, but let's respect the table
    // If no permissions loaded yet, safe default is false
    if (loading) return false;
    
    // Fallback for Manager if permissions are missing (bootstrap problem)
    if (roleName === "Manager") return true;

    const modulePerms = permissions.get(module);
    return modulePerms?.has(action) || false;
  };

  return { can, loading, roleName };
}
