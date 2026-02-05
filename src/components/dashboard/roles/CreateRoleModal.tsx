"use client";

import { useState } from "react";
import { INITIAL_MODULES, Role } from "./types";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRole: Role) => void;
}

export default function CreateRoleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("sky_admin_session") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/roles", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          modules: INITIAL_MODULES,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create role");
      }

      onSuccess(result); // result should be the new role object (or we fetch again)
      onClose();
      setFormData({ name: "", description: "" });
    } catch (err: unknown) {
      console.error("Error creating role:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Create New Role
          </h2>
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                error
              </span>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Travel Agent"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Description
            </label>
            <textarea
              placeholder="Describe the role's responsibilities..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
