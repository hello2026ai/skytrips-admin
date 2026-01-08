"use client";

import { useState, useEffect, useRef } from "react";
import { airports } from "../../libs/shared-utils/constants/airport";

const AirportAutocomplete = ({ label, name, value, onChange, disabled, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!value) {
        setFilteredOptions(airports.slice(0, 50));
      } else {
        const lower = value.toLowerCase();
        const filtered = airports.filter(
          (a) =>
            (a.name && a.name.toLowerCase().includes(lower)) ||
            (a.IATA && a.IATA.toLowerCase().includes(lower)) ||
            (a.city && a.city.toLowerCase().includes(lower))
        );
        setFilteredOptions(filtered.slice(0, 50));
      }
    }
  }, [value, isOpen]);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-bold text-slate-700 mb-2 tracking-tight">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>
            {icon}
          </span>
        </div>
        <input
          className="block w-full h-12 pl-12 rounded-lg border-slate-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/10 transition-all sm:text-sm font-medium"
          name={name}
          placeholder="City or Airport"
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          autoComplete="off"
        />
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none group"
              onClick={() => {
                onChange({
                  target: {
                    name,
                    value: `${option.name} (${option.IATA})`,
                  },
                });
                setIsOpen(false);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">
                    {option.city}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {option.name}
                  </div>
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs font-black text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  {option.IATA}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportAutocomplete;
