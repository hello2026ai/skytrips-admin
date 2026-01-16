"use client";

import { useEffect, useState, useRef } from "react";

interface TotalBookingsCardProps {
  uid: string;
  initialCount?: number;
}

export default function TotalBookingsCard({ uid, initialCount = 0 }: TotalBookingsCardProps) {
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(!initialCount);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState(12.5); // Mock trend for now

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/agencies/${uid}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.stats?.totalBookings !== undefined) {
        setCount(data.stats.totalBookings);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching booking stats:", err);
      setError("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch if no initial count provided
    if (!initialCount) {
        fetchStats();
    }

    // Polling every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [uid]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10" role="status">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
           <span className="sr-only">Loading...</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</h3>
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <span className="material-symbols-outlined text-[18px]">flight</span>
        </div>
      </div>
      
      <div className="text-3xl font-bold text-slate-900 mb-2">
        {count.toLocaleString()}
      </div>
      
      <div className="flex items-center gap-1 text-xs font-bold">
        <span className="text-emerald-600 flex items-center">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +{trend}%
        </span>
        <span className="text-slate-400 ml-1">vs last month</span>
      </div>

      {error && (
        <div className="absolute bottom-2 right-2 text-[10px] text-red-500 bg-red-50 px-1 rounded">
            {error}
        </div>
      )}
    </div>
  );
}
