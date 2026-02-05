"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface RouteOption {
  id: string;
  departure_airport: string;
  arrival_airport: string;
}

interface RouteMultiSelectProps {
  label?: string;
  value: RouteOption[];
  onChange: (value: RouteOption[]) => void;
  disabled?: boolean;
  placeholder?: string;
  excludeIds?: string[]; // IDs to exclude from search results
}

export const RouteMultiSelect = ({
  label,
  value,
  onChange,
  disabled,
  placeholder = "Select routes...",
  excludeIds = [],
}: RouteMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRoutes = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("routes")
          .select(`
            id, 
            departure_airport, 
            arrival_airport
          `)
          .limit(20);

        if (searchTerm) {
          query = query.or(`departure_airport.ilike.%${searchTerm}%,arrival_airport.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Filter out already selected routes and excluded IDs
        const selectedIds = new Set(value.map(r => r.id));
        const excludeIdSet = new Set(excludeIds);
        
        const filteredOptions = (data || []).map((item: any) => ({
          id: item.id,
          departure_airport: item.departure_airport,
          arrival_airport: item.arrival_airport,
        })).filter(
          (route: RouteOption) => !selectedIds.has(route.id) && !excludeIdSet.has(route.id)
        );

        setOptions(filteredOptions);
      } catch (err) {
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRoutes, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, value, excludeIds]);

  const handleSelect = (route: RouteOption) => {
    onChange([...value, route]);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleRemove = (routeId: string) => {
    onChange(value.filter(r => r.id !== routeId));
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`min-h-[42px] px-3 py-2 border rounded-lg bg-white flex flex-wrap gap-2 items-center cursor-text transition-all ${
          isOpen ? "ring-2 ring-blue-500 border-blue-500" : "border-slate-300 hover:border-slate-400"
        } ${disabled ? "bg-slate-50 cursor-not-allowed opacity-75" : ""}`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {value.map((route) => (
          <div
            key={route.id}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm border border-blue-100"
          >
            <span>
              {route.departure_airport} → {route.arrival_airport}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(route.id);
              }}
              className="hover:text-blue-900 rounded-full p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 bg-transparent outline-none min-w-[120px] text-sm"
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">Loading...</div>
          ) : options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">
              {searchTerm ? "No routes found" : "Type to search routes"}
            </div>
          ) : (
            options.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => handleSelect(route)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm flex items-center justify-between group"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {route.departure_airport} → {route.arrival_airport}
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 opacity-0 group-hover:opacity-100 text-[20px]">
                  add
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
