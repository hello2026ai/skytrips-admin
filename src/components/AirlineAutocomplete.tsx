"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Airline {
  id: string;
  name: string;
  iata_code: string;
  country: string;
}

interface ChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

interface AirlineAutocompleteProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string | ChangeEvent) => void;
  onSelect?: (airline: Airline) => void;
  disabled?: boolean;
  icon?: string;
  placeholder?: string;
  className?: string;
}

const AirlineAutocomplete = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onSelect, 
  disabled, 
  icon,
  placeholder = "Airline Name",
  className
}: AirlineAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = name ? `${name}-listbox` : "airline-listbox";

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
    if (!isOpen || value.length < 1) {
      if (value.length < 1) setOptions([]);
      return;
    }

    const fetchAirlines = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("airlines")
          .select("id, name, iata_code, country")
          .eq("status", "Active")
          .ilike("name", `%${value}%`)
          .limit(20);

        if (error) throw error;

        setOptions(data || []);
      } catch (err) {
        console.error("Error fetching airlines:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAirlines, 300);
    return () => clearTimeout(timer);
  }, [value, isOpen]);

  const highlight = (text: string, query: string) => {
    if (!text) return "";
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1 || !query) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-100">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const handleSelect = (airline: Airline) => {
    // Create a synthetic event for backward compatibility with handlers expecting an event object
    const event: ChangeEvent = {
      target: {
        name: name || 'airline',
        value: airline.name,
      },
    };

    onChange(event);
    
    if (onSelect) {
      onSelect(airline);
    }
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || options.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(options[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>
              {icon}
            </span>
          </div>
        )}
        <input
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className={className || `block w-full h-12 ${icon ? 'pl-12' : 'px-4'} rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium`}
          name={name}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600"
            onClick={() => {
              onChange("");
              setActiveIndex(-1);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
      {isOpen && (options.length > 0 || loading) && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto"
        >
          {loading && options.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500 italic">Loading...</li>
          )}
          {options.map((option, index) => (
            <li
              role="option"
              aria-selected={activeIndex === index}
              key={option.id}
              className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none group ${activeIndex === index ? "bg-slate-50" : ""}`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">
                    {highlight(option.name, value)}
                  </div>
                  <div className="text-xs text-slate-500">
                     {option.country}
                  </div>
                </div>
                {option.iata_code && (
                  <div className="bg-slate-100 px-2 py-1 rounded text-xs font-black text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                    {highlight(option.iata_code, value)}
                  </div>
                )}
              </div>
            </li>
          ))}
          {!loading && options.length === 0 && value.length >= 1 && (
             <li className="px-4 py-3 text-sm text-slate-500 italic">No active airlines found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AirlineAutocomplete;
