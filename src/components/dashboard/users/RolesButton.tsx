"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RolesButtonProps {
  className?: string;
}

export function RolesButton({ className }: RolesButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    try {
      setIsLoading(true);
      router.push("/dashboard/roles");
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      aria-label="Show system roles and permissions"
    >
      {isLoading ? (
        <span className="size-5 border-2 border-slate-300 border-t-teal-600 rounded-full animate-spin" />
      ) : (
        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
      )}
      Show Roles
    </button>
  );
}
