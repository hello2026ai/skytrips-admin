"use client";

import Link from "next/link";
import AirportForm from "@/components/airports/AirportForm";

export default function CreateAirportPage() {
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
            <h1 className="text-2xl font-bold text-slate-900">Add New Airport</h1>
            <p className="text-sm text-slate-500 mt-1">
              Create a new airport record in the system.
            </p>
          </div>
        </div>
      </div>
      
      <AirportForm />
    </div>
  );
}
