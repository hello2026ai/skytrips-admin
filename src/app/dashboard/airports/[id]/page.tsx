"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AirportForm from "@/components/airports/AirportForm";
import { Airport } from "@/types/airport";

export default function EditAirportPage() {
  const params = useParams();
  const router = useRouter();
  const [airport, setAirport] = useState<Airport | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAirport = async () => {
      try {
        setLoading(true);
        // Ensure params.id is a string
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;

        console.log(`Fetching airport data for ID: ${id}`);
        const res = await fetch(`/api/airports/${id}`, { 
          signal,
          cache: 'no-store' 
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch airport: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Airport data fetched successfully");
        setAirport(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            console.log("Fetch aborted");
            return;
          }
          console.error("Error fetching airport:", err);
          setError(err.message);
        } else {
          console.error("Unknown error fetching airport:", err);
          setError("An unexpected error occurred");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (params.id) {
      fetchAirport();
    }

    return () => {
      controller.abort();
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading airport data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 font-medium">Error: {error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/airports"
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors w-fit"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-sm font-medium">Back to Airports</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Airport</h1>
            <p className="text-sm text-slate-500 mt-1">
              Update details for {airport?.name} ({airport?.iata_code})
            </p>
          </div>
        </div>
      </div>
      
      <AirportForm initialData={airport} isEditing />
    </div>
  );
}
