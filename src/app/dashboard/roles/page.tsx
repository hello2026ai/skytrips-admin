"use client";

import { useState, useEffect } from "react";
import { Role, INITIAL_MODULES, PermissionType } from "@/components/dashboard/roles/types";
import { RoleSidebar } from "@/components/dashboard/roles/RoleSidebar";
import { PermissionMatrix } from "@/components/dashboard/roles/PermissionMatrix";
import CreateRoleModal from "@/components/dashboard/roles/CreateRoleModal";
import { useToast } from "@/components/ui/ToastContext";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export default function RolesPage() {
  const { addToast } = useToast();
  const { can, loading: permissionsLoading } = useUserPermissions();

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Deep clone to track changes
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
        setEditingRole(JSON.parse(JSON.stringify(data[0])));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      addToast("Failed to load roles. Please refresh the page.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRole = (role: Role) => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to switch roles?")) {
        return;
      }
    }
    
    setSelectedRole(role);
    setEditingRole(JSON.parse(JSON.stringify(role)));
    setIsDirty(false);
  };

  const handleAddRole = () => {
    if (!can("roles", "add")) {
      addToast("You do not have permission to add roles.", "error");
      return;
    }
    if (isDirty && !confirm("Discard changes?")) return;
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (newRole: Role) => {
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setEditingRole(JSON.parse(JSON.stringify(newRole)));
    setIsDirty(false);
    addToast("Role created successfully!", "success");
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!can("roles", "delete")) {
      addToast("You do not have permission to delete roles.", "error");
      return;
    }
    if (!confirm("Are you sure you want to delete this role? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete role");
      }

      const newRoles = roles.filter((r) => r.id !== roleId);
      setRoles(newRoles);
      
      if (newRoles.length > 0) {
        // If the deleted role was selected, select the first available role
        if (selectedRole?.id === roleId) {
            setSelectedRole(newRoles[0]);
            setEditingRole(JSON.parse(JSON.stringify(newRoles[0])));
            setIsDirty(false);
        }
      } else {
        setSelectedRole(null);
        setEditingRole(null);
        setIsDirty(false);
      }
      addToast("Role deleted successfully!", "success");
    } catch (error: unknown) {
      console.error("Error deleting role:", error);
      addToast(error instanceof Error ? error.message : "Failed to delete role", "error");
    }
  };

  const handleUpdateRoleName = (name: string) => {
    if (!can("roles", "edit")) {
      addToast("You do not have permission to edit roles.", "error");
      return;
    }
    if (!editingRole) return;
    setEditingRole({ ...editingRole, name });
    setIsDirty(true);
  };

  const handleUpdatePermission = (
    moduleId: string,
    type: PermissionType,
    value: boolean
  ) => {
    if (!can("roles", "edit")) {
        addToast("You do not have permission to edit roles.", "error");
        return;
      }
    if (!editingRole) return;
    const newModules = editingRole.modules.map((m) => {
      if (m.id === moduleId) {
        return {
          ...m,
          permissions: { ...m.permissions, [type]: value },
        };
      }
      return m;
    });
    setEditingRole({ ...editingRole, modules: newModules });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!can("roles", "edit")) {
        addToast("You do not have permission to edit roles.", "error");
        return;
      }
    if (!editingRole) return;
    setIsSaving(true);

    try {
      const url = `/api/roles/${editingRole.id}`;
      const method = "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRole),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save role");
      }

      const updatedRoles = roles.map((r) => (r.id === editingRole.id ? editingRole : r));
      setRoles(updatedRoles);
      setSelectedRole(editingRole);

      setIsDirty(false);
      addToast("Role saved successfully!", "success");
    } catch (error: unknown) {
      console.error("Error saving role:", error);
      addToast(error instanceof Error ? error.message : "An unknown error occurred", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedRole) {
        setEditingRole(JSON.parse(JSON.stringify(selectedRole)));
        setIsDirty(false);
    }
  };

  const handleReset = () => {
    if (!can("roles", "edit")) return;
    if (!editingRole) return;
    if (confirm("Reset permissions to defaults? This will clear all changes.")) {
      setEditingRole({
        ...editingRole,
        modules: JSON.parse(JSON.stringify(INITIAL_MODULES)),
      });
      setIsDirty(true);
    }
  };

  if (isLoading && roles.length === 0) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col items-center gap-4">
                  <span className="size-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin" />
                  <p className="text-slate-500 font-medium">Loading roles...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full font-display pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Role Management and Permissions
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Configure system roles and granular access levels for your team.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <RoleSidebar
          roles={roles}
          selectedRoleId={selectedRole?.id || null}
          onSelectRole={handleSelectRole}
          onAddRole={handleAddRole}
          onDeleteRole={handleDeleteRole}
        />
        
        <CreateRoleModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
            onSuccess={handleCreateSuccess} 
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
          {selectedRole && editingRole ? (
            <>
              <PermissionMatrix
                role={editingRole}
                onUpdateRoleName={handleUpdateRoleName}
                onUpdatePermission={handleUpdatePermission}
                onSave={handleSave}
                onCancel={handleCancel}
                onReset={handleReset}
                isDirty={isDirty}
                readOnly={!can("roles", "edit")}
              />

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <h4 className="font-bold text-slate-900">View Access</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Allows the user to see data and search within the module without making any modifications.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <span className="material-symbols-outlined">edit</span>
                    </div>
                    <h4 className="font-bold text-slate-900">Edit & Create</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Permits creation of new records and modification of existing entries within specified modules.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <span className="material-symbols-outlined">delete_forever</span>
                    </div>
                    <h4 className="font-bold text-slate-900">Delete Access</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    High-level permission to permanently remove data. Use with caution for sensitive modules.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">shield</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Role Selected</h3>
              <p className="text-slate-500 text-sm">Select a role from the sidebar or create a new one to get started.</p>
              <button
                onClick={handleAddRole}
                className="mt-6 px-6 py-2.5 bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 hover:bg-teal-800 transition-all"
              >
                Create New Role
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
