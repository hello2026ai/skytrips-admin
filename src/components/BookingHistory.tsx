"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/types";

interface BookingHistoryProps {
  customerId?: number | string;
}

export default function BookingHistory({ customerId }: BookingHistoryProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (!customerId) {
        setBookings([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("customerid", customerId) // Use correct column 'customerid'
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error("Error fetching booking history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="text-base font-bold text-slate-900 flex items-center tracking-tight gap-2">
          <span className="material-symbols-outlined text-slate-400">history</span>
          Customer Booking History
        </h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 5 Bookings</span>
      </div>
      <div className="p-0">
        {loading ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
             <p className="text-slate-500 text-sm font-medium">Syncing history...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-slate-300 text-[32px] mb-2">history_toggle_off</span>
            <p className="text-slate-500 text-sm font-medium">No previous bookings found for customer #{customerId}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Travel Date</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking, index) => (
                  <tr key={booking.id || index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3">
                        <div className="font-bold text-slate-900">{booking.travelDate || "TBA"}</div>
                        <div className="text-xs text-slate-500">{booking.tripType}</div>
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                            <span>{booking.origin}</span>
                            <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
                            <span>{booking.destination}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{booking.airlines} • {booking.flightNumber}</div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : booking.status === "Cancelled"
                            ? "bg-red-50 border-red-100 text-red-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                        <div className="font-black text-slate-900">${booking.sellingPrice || booking.buyingPrice || "0.00"}</div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{booking.paymentStatus}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
