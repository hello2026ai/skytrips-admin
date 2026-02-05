"use client";

import { ModulePermission, PermissionType, Role } from "./types";

interface PermissionMatrixProps {
  role: Role;
  onUpdateRoleName: (name: string) => void;
  onUpdatePermission: (moduleId: string, type: PermissionType, value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  isDirty: boolean;
  readOnly?: boolean;
}

export function PermissionMatrix({
  role,
  onUpdateRoleName,
  onUpdatePermission,
  onSave,
  onCancel,
  onReset,
  isDirty,
  readOnly = false,
}: PermissionMatrixProps) {
  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="w-full max-w-md space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Role Label
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-teal-600 transition-colors">
                badge
              </span>
              <input
                type="text"
                value={role.name}
                onChange={(e) => onUpdateRoleName(e.target.value)}
                disabled={readOnly}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter role name"
              />
            </div>
            <p className="text-xs text-slate-400 italic pl-1">
              Editing permissions for &quot;{role.name}&quot; role.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            {!readOnly && (
              <button
                onClick={onSave}
                disabled={!isDirty}
                className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-teal-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Role
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-wider w-[40%]">
                Module Name
              </th>
              <th className="text-center py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-wider w-[15%]">
                View
              </th>
              <th className="text-center py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-wider w-[15%]">
                Add
              </th>
              <th className="text-center py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-wider w-[15%]">
                Edit
              </th>
              <th className="text-center py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-wider w-[15%]">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {role.modules.map((module) => (
              <tr key={module.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-6 px-8">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mt-1">
                      <span className="material-symbols-outlined text-[20px]">{module.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{module.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] leading-relaxed">
                        {module.description}
                      </div>
                    </div>
                  </div>
                </td>
                {(["view", "add", "edit", "delete"] as const).map((type) => (
                  <td key={type} className="py-6 px-4 text-center align-middle">
                    <div className="flex justify-center">
                      <label className={`relative flex items-center justify-center p-2 group ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={module.permissions[type]}
                          onChange={(e) =>
                            onUpdatePermission(module.id, type, e.target.checked)
                          }
                          disabled={readOnly}
                        />
                        <div className={`size-6 rounded-md border-2 border-slate-300 bg-white transition-all peer-checked:border-teal-600 peer-checked:bg-teal-600 peer-focus:ring-4 peer-focus:ring-teal-500/20 ${!readOnly ? 'group-hover:border-slate-400' : 'opacity-60'}`}></div>
                        <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none transform scale-50 peer-checked:scale-100 duration-200">
                          check
                        </span>
                      </label>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          Changes will be audited and logged for the current role.
        </div>
        {!readOnly && (
          <button
            onClick={onReset}
            className="text-teal-700 hover:text-teal-800 hover:underline transition-colors font-bold"
          >
            Reset to System Defaults
          </button>
        )}
      </div>
    </div>
  );
}
