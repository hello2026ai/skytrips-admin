"use client";
import { useState, useEffect, useRef } from "react";

export default function BookingRowMenu({
  bookingId,
  onRefund,
  onReissue,
}: {
  bookingId: number;
  onRefund: () => void;
  onReissue: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { label: "Refund", icon: "currency_exchange", action: onRefund },
    { label: "Re-issue", icon: "sync", action: onReissue },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0);
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0) {
          options[activeIndex].action();
          setOpen(false);
          setActiveIndex(-1);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-center">
      <button
        type="button"
        aria-label="Open actions menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="size-10 min-w-10 min-h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 mt-2"
      >
        <span className="material-symbols-outlined text-[18px]">more_vert</span>
      </button>
      {open && (
        <div
          role="menu"
          aria-label={`Actions for booking ${bookingId}`}
          className="absolute z-30 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in duration-300"
        >
          <ul className="py-2">
            {options.map((opt, idx) => (
              <li key={opt.label}>
                <button
                  role="menuitem"
                  tabIndex={0}
                  aria-label={opt.label}
                  onClick={() => {
                    opt.action();
                    setOpen(false);
                    setActiveIndex(-1);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-200 ${activeIndex === idx ? "bg-slate-50" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:scale-105">
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
