"use client";

import { useEffect, useState } from "react";
import { FlightOffer } from "@/types/flight-search";

interface FlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: FlightOffer;
}

export default function FlightDetailsModal({ isOpen, onClose, offer }: FlightDetailsModalProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setShowModal(true), 10);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!showModal && !isOpen) return null;

  // Helper to generate segments if not provided
  // In a real app, `offer.segments` would likely exist.
  // Here we mock it based on stops for visualization.
  const segments = (() => {
    const segs = [];
    // const stopLocation = offer.stops.locations?.[0] || "Doha (DOH)"; // Fallback mock
    
    if (offer.stops.count > 0) {
      // Segment 1: Origin -> Stop
      segs.push({
        id: "seg1",
        airline: offer.airline,
        flightNumber: offer.flightNumber,
        aircraft: offer.aircraft || "Boeing 777",
        class: "Economy Class",
        dep: { ...offer.departure, terminal: "Terminal 5" },
        arr: { city: "Doha", code: "DOH", terminal: "Terminal 1", time: "16:45", date: "Oct 24" },
        duration: "6h 30m"
      });
      // Layover
      // Segment 2: Stop -> Destination
      segs.push({
        id: "seg2",
        airline: offer.airline,
        flightNumber: "FL-302", // Mock diff number
        aircraft: "Boeing 787",
        class: "Economy Class",
        dep: { city: "Doha", code: "DOH", terminal: "Terminal 1", time: "19:00", date: "Oct 24" },
        arr: { ...offer.arrival, terminal: "Terminal 4", date: "Oct 25" },
        duration: "13h 00m"
      });
    } else {
      // Direct
      segs.push({
        id: "seg1",
        airline: offer.airline,
        flightNumber: offer.flightNumber,
        aircraft: offer.aircraft || "Airbus A350",
        class: "Economy Class",
        dep: { ...offer.departure, terminal: "Terminal 5", date: "Oct 24" },
        arr: { ...offer.arrival, terminal: "Terminal 4", date: "Oct 24" },
        duration: offer.duration
      });
    }
    return segs;
  })();

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">Flight Itinerary Details</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {offer.departure.code} <span className="mx-1">→</span> {offer.arrival.code} • {offer.stops.count === 0 ? "Direct" : `${offer.stops.count} Stopover`} • Oct 24, 2024
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-6">
            {segments.map((seg, index) => (
              <div key={seg.id}>
                {/* Flight Segment Card */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
                  {/* Decorative timeline line */}
                  <div className="absolute left-[35px] top-[80px] bottom-[30px] w-[2px] border-l-2 border-dashed border-slate-200 z-0"></div>

                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                      {seg.airline.logo ? (
                        <img src={seg.airline.logo} alt={seg.airline.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">flight_sm</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {seg.airline.name} <span className="text-slate-300">•</span> {seg.flightNumber}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        {seg.aircraft} • {seg.class}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[60px_1fr] gap-4 relative z-10">
                    {/* Departure */}
                    <div className="text-right pt-1">
                      <p className="text-lg font-black text-slate-900 leading-none">{seg.dep.time}</p>
                      <p className="text-[10px] font-bold text-primary uppercase mt-1">{seg.dep.date}</p>
                    </div>
                    <div className="pb-8 relative">
                      <div className="absolute left-[-25px] top-[6px] w-3 h-3 rounded-full bg-white border-[3px] border-blue-400"></div>
                      <p className="font-bold text-slate-900 text-sm">{seg.dep.city} ({seg.dep.code})</p>
                      <p className="text-xs text-slate-500 font-medium">{seg.dep.terminal}</p>
                    </div>

                    {/* Arrival */}
                    <div className="text-right pt-1">
                      <p className="text-lg font-black text-slate-900 leading-none">{seg.arr.time}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{seg.arr.date}</p>
                    </div>
                    <div className="relative">
                       <div className="absolute left-[-25px] top-[6px] w-3 h-3 rounded-full bg-white border-[3px] border-slate-400"></div>
                      <p className="font-bold text-slate-900 text-sm">{seg.arr.city} ({seg.arr.code})</p>
                      <p className="text-xs text-slate-500 font-medium">{seg.arr.terminal}</p>
                    </div>
                  </div>
                  
                   <div className="mt-6 ml-[76px] inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                     <span className="text-xs font-bold text-slate-600 uppercase">Flight Duration: {seg.duration}</span>
                   </div>
                </div>

                {/* Layover Info (if not last segment) */}
                {index < segments.length - 1 && (
                  <div className="my-6 mx-4 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between text-orange-800">
                    <span className="text-sm font-bold flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">transfer_within_a_station</span>
                       Layover in Doha (DOH)
                    </span>
                    <span className="text-sm font-bold">2h 15m</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Duration</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">
               {offer.duration}
               {offer.stops.count > 0 && <span className="text-slate-400 font-normal ml-1">(including layover)</span>}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
