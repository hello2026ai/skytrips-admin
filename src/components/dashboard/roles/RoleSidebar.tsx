"use client";

import { useState } from "react";
import { Role } from "./types";

interface RoleSidebarProps {
  roles: Role[];
  selectedRoleId: string | null;
  onSelectRole: (role: Role) => void;
  onAddRole: () => void;
  onDeleteRole: (roleId: string) => void;
}

export function RoleSidebar({
  roles,
  selectedRoleId,
  onSelectRole,
  onAddRole,
  onDeleteRole,
}: RoleSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when search changes
  if (searchTerm && currentPage !== 1) {
    setCurrentPage(1);
  }

  return (
    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">
            System Roles
          </h3>
          <button
            onClick={onAddRole}
            className="flex items-center gap-1 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add New
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        {paginatedRoles.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No roles found.
          </div>
        ) : (
          paginatedRoles.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div
                key={role.id}
                onClick={() => onSelectRole(role)}
                className={`group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-50 border-teal-600 shadow-sm"
                    : "bg-white border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm"
                }`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {role.id.toLowerCase().includes("manager")
                      ? "admin_panel_settings"
                      : role.id.toLowerCase().includes("staff")
                      ? "person"
                      : "support_agent"}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                    {role.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {role.description}
                  </div>
                </div>

                {/* Edit/Delete Actions (visible on hover or active) */}
                <div className={`flex items-center gap-1 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRole(role);
                    }}
                    className="p-1 text-slate-400 hover:text-teal-600 rounded"
                    title="Edit Role Name"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // The page component handles confirmation, but here we trigger it
                      onDeleteRole(role.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete Role"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-teal-600 rounded-r-full" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-xs font-bold text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
